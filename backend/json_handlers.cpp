#include "json_handlers.hpp"

json cellToJson(const Cell& cell){
    return std::visit([](auto&& arg) -> json {
        using T = std::decay_t<decltype(arg)>;
        if constexpr (std::is_same_v<T, std::monostate>){
            return nullptr;
        } else {
            return arg;
        }
    }, cell);
}

json rowToJson(const Row& row){
    json j;
    j["id"] = row.id;
    j["data"] = json::array();

    for(const auto& cell : row.data){
        j["data"].push_back(cellToJson(cell));
    }

    return j;
}

Cell jsonToCell(const json& j){
    if(j.is_null()) return std::monostate{};
    else if (j.is_number_integer()) return j.get<int>();
    else if (j.is_number_float()) return j.get<float>();
    else if (j.is_boolean()) return j.get<bool>();
    else if (j.is_string()) return j.get<std::string>();

    throw std::invalid_argument("JSON data type not supported!");
}