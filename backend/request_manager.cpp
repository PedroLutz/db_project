#include "request_manager.hpp"

static json cellToJson(const Cell& cell){
    return std::visit([](auto&& arg) -> json {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, std::monostate){
            return nullptr;
        } else {
            return arg;
        }
    }, cell);
}

static json rowToJson(const Row& row){
    json j;
    j["id"] = row.id;
    j["data"] = json::array();

    for(const auto& cell : row.data){
        j["data"].push_back(cellToJson(cell));
    }

    return j;
}

static Cell jsonToCell(const json& j){
    if(j.is_null()) return std::monostate{};
    else if (j.is_number_integer()) return j.get<int>();
    else if (j.is_number_float()) return j.get<float>();
    else if (j.is_boolean()) return j.get<bool>();
    else if (j.is_string()) return j.get<std::string>();

    throw std::invalid_argument("JSON data type not supported!");
}

std::string RequestManager::handleRequest(const std::string& request){
    auto j = json::parse(request);
    std::string action = j["action"];

    static const std::unordered_map<std::string, std::function<json(const json&, TableManager&)>> handlers {
        {"fetch_all", [](const json& req, TableManager& db){
            std::vector<const Row*> rows = db.getAllRowsInTable(req["table"].get<std::string>());
            json result = json::array();
            for(const Row* row : rows){
                result.push_back(rowToJson(*row));
            }
            return result;
        }},

        {"fetch_id", [](const json& req, TableManager& db){
            const Row& row = db.getRowInTable(req["table"].get<std::string>(), req["id"].get<int>());
            json result = rowToJson(row);
            return result;
        }},

        {"insert_row", [](const json& req, TableManager& db){
            std::vector<Cell> row;
            for(auto& element : req["data"])
                row.push_back(jsonToCell(element));
            
            db.insertRowInTable(req["table"].get<std::string>(), std::move(row));
            return "Row inserted successfully";
        }},

        {"insert_column", [](const json& req, TableManager& db){
            Column col = {req["name"], typeStringToTypeTag.at(req["type"])};
            db.createColumnInTable(req["table"].get<std::string>(), std::move(col));
            return "Column created successfully";
        }},

        {"create_table", [](const json& req, TableManager& db){
            db.createTable(req["table"].get<std::string>());
            return "Table created successfully";
        }},

        
        {"delete_row", [](const json& req, TableManager& db){
            db.deleteRowInTable(req["table"].get<std::string>(), req["id"].get<int>());
            return "Row deleted successfully";
        }},

        {"drop_column", [](const json& req, TableManager& db){
            db.dropColumnInTable(req["table"].get<std::string>(), req["name"].get<std::string>());
            return "Column dropped successfully";
        }},

        {"drop_table", [](const json& req, TableManager& db){
            db.dropTable(req["table"].get<std::string>());
            return "Table dropped successfully";
        }},

        {"update_row", [](const json& req, TableManager& db){
            std::vector<Cell> row;
            for(auto& element : req["data"])
                row.push_back(jsonToCell(element));
            
            db.updateRowInTable(req["table"].get<std::string>(), req["id"].get<int>(), std::move(row));
            return "Row updated successfully";
        }},

        {"update_column", [](const json& req, TableManager& db){
            
            return "Row updated successfully";
        }},
    };

    try {
        if(handlers.count(action)){
            json result = handlers.at(action)(j, db);

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