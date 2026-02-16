#include "crow_all.h"
#include "request_manager.hpp"
#include "file_manager.hpp"

int main(void)
{
    TableManager db;
    FileManager file_manager(db);
    RequestManager req_manager(db, file_manager);

    std::vector<std::string> operations = file_manager.loadFileData();

    for(const std::string& op : operations) {
        req_manager.handleRequest(op);
    }

    crow::SimpleApp app;

    CROW_ROUTE(app, "/query")
        .methods(crow::HTTPMethod::POST)
        ([&req_manager](const crow::request &req){
            std::string response = req_manager.handleRequest(req.body);

            crow::response res;
            res.code = 200;
            res.set_header("Content-Type", "application/json");
            res.body = response; 

            return res;
        });

    CROW_ROUTE(app, "/status")([](){
        return "Database is running!";
    });

    app.port(8080).multithreaded().run();

    return 0;
}