#include "crow_all.h" // O CORSHandler já vem embutido aqui nas versões modernas
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

    crow::App<crow::CORSHandler> app;

    auto& cors = app.get_middleware<crow::CORSHandler>();
    cors.global()
      .origin("*")
      .methods("POST"_method, "GET"_method, "OPTIONS"_method)
      .headers("Content-Type", "Authorization");

    CROW_ROUTE(app, "/tables")
        .methods(crow::HTTPMethod::GET)
        ([&req_manager](){
            std::string json_request = "{\"action\": \"fetch_all_tables\"}";
            std::string response = req_manager.handleRequest(json_request);

            crow::response res;
            res.code = 200;
            res.set_header("Content-Type", "application/json");
            res.body = response; 
            return res;
        });

    CROW_ROUTE(app, "/query")
        .methods(crow::HTTPMethod::POST)
        ([&req_manager](const crow::request &req){
            crow::response res;
            try {
                std::string response_data = req_manager.handleRequest(req.body);
                res.code = 200;
                res.set_header("Content-Type", "application/json");
                res.body = response_data;
            } catch (const std::exception& e) {
                res.code = 500;
                res.body = "{\"error\": \"Internal Server Error\"}";
            }
            return res;
        });

    CROW_ROUTE(app, "/status")([](){
        return "Database is running!";
    });

    app.port(8080).multithreaded().run();

    return 0;
}