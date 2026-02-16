#ifndef FILE_MANAGER_HPP
#define FILE_MANAGER_HPP

#include "request_manager.hpp"
#include <fstream>
#include <thread>
#include <atomic>
#include <condition_variable>

class FileManager {
    private:
        TableManager &db;
        
        std::thread persistence_thread;
        std::atomic<bool> running{true};
        std::condition_variable cv;
        std::mutex cv_mutex;
        bool data_changed = false;

        void saveDataToFile();

    public:
        FileManager(TableManager &d);
        ~FileManager();

        std::vector<std::string> loadFileData();
        void notifyChange();
};

#endif