#ifndef REQUEST_MANAGER_HPP
#define REQUEST_MANAGER_HPP

#include "table_manager.hpp"
#include "file_manager.hpp"
#include <functional>
#include "json_handlers.hpp"

class RequestManager {
    private:
        TableManager& db;
        FileManager& fm;

    public:
        RequestManager(TableManager& t, FileManager& f) : db(t), fm(f) {};

        std::string handleRequest(const std::string& request);
};

#endif