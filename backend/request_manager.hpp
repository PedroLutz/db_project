#ifndef REQUEST_MANAGER_HPP
#define REQUEST_MANAGER_HPP

#include "table_manager.hpp"
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class RequestManager {
    private:
        TableManager& db;
};

#endif