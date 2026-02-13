#ifndef TABLE_MANAGER_HPP
#define TABLE_MANAGER_HPP

#include "table.hpp"
#include <memory>


class TableManager {
    private:
        std::unordered_map<std::string, std::unique_ptr<Table>> tables;

        Table& getTableOrThrow(const std::string& table_name);
        const Table& getTableOrThrow(const std::string& table_name) const;

        mutable std::shared_mutex map_lock; 
        //the mutex here is to avoid changes in the umap
        //creating or droping a table are writing in the umap
        //accessing the tables is reading the umap

    public:
        TableManager() = default;

        void createTable(const std::string& table_name);
        void dropTable(const std::string& table_name);

        void createColumnInTable(const std::string& table_name, const Column& column);
        void insertRowInTable(const std::string& table_name, std::vector<Cell> data);
        
        void dropColumnInTable(const std::string& table_name, const std::string &col_name);
        void deleteRowInTable(const std::string& table_name, const size_t id);

        void updateRowInTable(const std::string& table_name, const size_t id, std::vector<Cell> new_data);
        const Row& getRowInTable(const std::string& table_name, const size_t id) const;
        Row& getRowMutableInTable(const std::string& table_name, const size_t id);

        const std::vector<const Row*> getAllRowsInTable(const std::string& table_name) const;
        const std::vector<Column>& getColsInTable(const std::string& table_name) const;
};

#endif