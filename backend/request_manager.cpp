#include "request_manager.hpp"
#include "file_manager.hpp"

std::string RequestManager::handleRequest(const std::string& request){
    auto j = json::parse(request);
    std::string action = j["action"];

    static const std::unordered_map<std::string, std::function<json(const json&, TableManager&, FileManager&)>> handlers {
        {"fetch_all_tables", [](const json& req, TableManager& db, FileManager &fm){
            json result = json::array();
            const std::vector<std::string> tables = db.getTableNames();
            for(const std::string& table : tables){
                result.push_back(table);
            }
            return result;
        }},
        
        {"fetch_all", [](const json& req, TableManager& db, FileManager &fm){
            std::vector<const Row*> rows = db.getAllRowsInTable(req["table"].get<std::string>());
            json result = json::array();
            for(const Row* row : rows){
                result.push_back(rowToJson(*row));
            }
            return result;
        }},

        {"fetch_id", [](const json& req, TableManager& db, FileManager &fm){
            const Row& row = db.getRowInTable(req["table"].get<std::string>(), req["id"].get<int>());
            json result = rowToJson(row);
            return result;
        }},

        {"fetch_table", [](const json& req, TableManager& db, FileManager &fm){
            std::string table_name = req["table"].get<std::string>();
            
            std::vector<const Row*> rows = db.getAllRowsInTable(table_name);
            std::vector<Column> cols = db.getColsInTable(table_name);
            json result;
            
            result["table"] = table_name;
            
            result["cols"] = json::array();
            for(const Column& col : cols){
                json col_json;
                col_json["name"] = col.name;
                col_json["type"] = typeTagtoTypeString.at(col.type);
                result["cols"].push_back(col_json);
            }
            
            result["rows"] = json::array();
            for(const Row* row : rows){
                result["rows"].push_back(rowToJson(*row));
            }
            
            return result;
        }},

        {"insert_row", [](const json& req, TableManager& db, FileManager &fm){
            std::vector<Cell> row;
            for(auto& element : req["data"])
                row.push_back(jsonToCell(element));
            
            db.insertRowInTable(req["table"].get<std::string>(), std::move(row));
            fm.notifyChange();
            return "Row inserted successfully";
        }},

        {"insert_column", [](const json& req, TableManager& db, FileManager &fm){
            Column col = {req["name"], typeStringToTypeTag.at(req["type"])};
            db.createColumnInTable(req["table"].get<std::string>(), std::move(col));
            fm.notifyChange();
            return "Column created successfully";
        }},

        {"create_table", [](const json& req, TableManager& db, FileManager &fm){
            db.createTable(req["table"].get<std::string>());
            fm.notifyChange();
            return "Table created successfully";
        }},

        
        {"delete_row", [](const json& req, TableManager& db, FileManager &fm){
            db.deleteRowInTable(req["table"].get<std::string>(), req["id"].get<int>());
            fm.notifyChange();
            return "Row deleted successfully";
        }},

        {"drop_column", [](const json& req, TableManager& db, FileManager &fm){
            db.dropColumnInTable(req["table"].get<std::string>(), req["name"].get<std::string>());
            fm.notifyChange();
            return "Column dropped successfully";
        }},

        {"drop_table", [](const json& req, TableManager& db, FileManager &fm){
            db.dropTable(req["table"].get<std::string>());
            fm.notifyChange();
            return "Table dropped successfully";
        }},

        {"update_row", [](const json& req, TableManager& db, FileManager &fm){
            std::vector<Cell> row;
            for(auto& element : req["data"])
                row.push_back(jsonToCell(element));
            
            db.updateRowInTable(req["table"].get<std::string>(), req["id"].get<int>(), std::move(row));
            fm.notifyChange();
            return "Row updated successfully";
        }},
    };

    try {
        if(handlers.count(action)){
            json result = handlers.at(action)(j, db, fm);

            return json{
                {"status", "success"},
                {"result", result}
            }.dump();
        } else {
            return json{
            {"status", "error"},
            {"message", "Action not found"}
            }.dump();
        }
    } catch(const std::exception &e) {
        return json{
            {"status", "error"},
            {"message", e.what()}
        }.dump();
    }
}