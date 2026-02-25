#ifndef REQUEST_MANAGER_HPP
#define REQUEST_MANAGER_HPP

#include "../core/table_manager.hpp"
#include <functional>
#include "../utils/json_handlers.hpp"

class FileManager;

class RequestManager {
    private:
        TableManager& db;
        FileManager& fm;

    public:
        RequestManager(TableManager& t, FileManager& f) : db(t), fm(f) {};

        std::string handleRequest(const std::string& request);
};

#endif