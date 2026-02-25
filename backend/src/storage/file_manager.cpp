#include "file_manager.hpp"

FileManager::FileManager(TableManager &d) : db(d) {
    persistence_thread = std::thread([this]() {
        while(running) {
            std::unique_lock<std::mutex> lock(cv_mutex);

            cv.wait_for(lock, std::chrono::seconds(30), [this]{
                return data_changed || !running;
            });
            //reminiding the behavior of condition_variable:
            //the .wait_for() function puts the thread to sleep for 30 seconds, unlocking the mutex
            //after waking up, it locks the mutex and checks the lambda
            //if it's false, unlocks the mutex and goes back to sleep
            //if it's true, proceeds with the rest of the execution
            //the lambda also is used to prevent execution in the case of Spurious Wakeup (random wakeup due to OS optimizations)

            if(data_changed){
                this->saveDataToFile();
                data_changed = false;
            }
            if(!running) break;
        }
    });
}

FileManager::~FileManager(){
    {
        std::lock_guard<std::mutex> lock(cv_mutex);
        running = false;
    }
    cv.notify_all();
    if(persistence_thread.joinable())
        persistence_thread.join();
    this->saveDataToFile();
}

void FileManager::saveDataToFile(){
    std::fstream file("db.bin", std::ios::out | std::ios::trunc | std::ios::binary);

    if(!file){
        std::cerr << "Error while opening file!";
        return;
    }

    json result = json::array();

    std::vector<std::string> table_names = db.getTableNames();

    for(const std::string& table_name : table_names){
        json table_creation_req;
        table_creation_req["action"] = "create_table";
        table_creation_req["table"] = table_name;

        result.push_back(table_creation_req);

        const std::vector<Column> cols = db.getColsInTable(table_name);

        for(const auto& col : cols){
            json column_creation_req;
            column_creation_req["action"] = "insert_column";
            column_creation_req["table"] = table_name;
            column_creation_req["name"] = col.name;
            column_creation_req["type"] = typeTagtoTypeString.at(col.type);

            result.push_back(column_creation_req);
        }

        std::vector<const Row*> rows = db.getAllRowsInTable(table_name);

        for(const auto* row : rows){
            json row_creation_req;
            row_creation_req["action"] = "insert_row";
            row_creation_req["table"] = table_name;
            row_creation_req["data"] = json::array();
            for(const auto& cell : row->data){
                row_creation_req["data"].push_back(cellToJson(cell));
            }

            result.push_back(row_creation_req);
        }
    }
    
    std::vector<uint8_t> binary_data = json::to_msgpack(result);
    //messagepack is an efficient way of storing json data in binary, with many optimizations
    //a direct translation from json to binary would be UBJSON, but it has no optimizations, so msgpack works best
    file.write(reinterpret_cast<const char*>(binary_data.data()), binary_data.size());
}

std::vector<std::string> FileManager::loadFileData(){
    std::vector<std::string> logs;

    std::fstream file("db.bin", std::ios::in | std::ios::binary);

    if(!file.is_open()){
        return logs;
    }

    try{
        json json_array = json::from_msgpack(file);

        for(const auto& op : json_array){
            logs.push_back(op.dump());
        }
    } catch (const std::exception& e){
        std::cerr << "Error while loading binary: " << e.what() << "\n";
    }

    return logs;
}

void FileManager::notifyChange(){
    std::lock_guard<std::mutex> lock(cv_mutex);
    data_changed = true;
}