#ifndef REQUEST_MANAGER_HPP
#define REQUEST_MANAGER_HPP

#include "table_manager.hpp"
#include <functional>
#include <nlohmann/json.hpp>

using json = nlohmann::json;

class RequestManager {
    private:
        TableManager& db;

    public:
        RequestManager(TableManager& t) : db(t) {};

        std::string handleRequest(const std::string& request);
};

#endif