#include "table_manager.hpp"

std::vector<std::string> TableManager::getTableNames() const{
    std::vector<std::string> v;
    for(const auto& pair : tables ){
        v.push_back(pair.first);
    }
    return v;
}

Table& TableManager::getTableOrThrow(const std::string& table_name){
    auto it = tables.find(table_name);

    if (it == tables.end())
        throw std::invalid_argument("The table" + table_name + " does not exist!");

    return *(it->second);
}

const Table& TableManager::getTableOrThrow(const std::string& table_name) const{
    auto it = tables.find(table_name);

    if (it == tables.end())
        throw std::invalid_argument("The table" + table_name + " does not exist!");

    return *(it->second);
}

void TableManager::createTable(const std::string& table_name){
    std::unique_lock lock(map_lock);
    auto [it, success] = tables.try_emplace(table_name, std::make_unique<Table>(table_name));

    if (!success) {
        throw std::invalid_argument("The table " + table_name + " already exists");
    }
}

void TableManager::dropTable(const std::string& table_name){
    std::unique_lock lock(map_lock);
    if (!tables.count(table_name))
        throw std::invalid_argument("The table" + table_name + " does not exist!");

    tables.erase(table_name);
}

void TableManager::createColumnInTable(const std::string& table_name, const Column& column){
    std::shared_lock lock(map_lock);
    Table& table = getTableOrThrow(table_name);
    table.createColumn(column);
}

void TableManager::insertRowInTable(const std::string& table_name, std::vector<Cell> data){
    std::shared_lock lock(map_lock);
    Table& table = getTableOrThrow(table_name);
    table.insertRow(std::move(data));
}

void TableManager::dropColumnInTable(const std::string& table_name, const std::string &col_name){
    std::shared_lock lock(map_lock);
    Table& table = getTableOrThrow(table_name);
    table.removeColumn(col_name);
}

void TableManager::deleteRowInTable(const std::string& table_name, const size_t id){
    std::shared_lock lock(map_lock);
    Table& table = getTableOrThrow(table_name);
    table.deleteRow(id);
}

void TableManager::updateRowInTable(const std::string& table_name, const size_t id, std::vector<Cell> new_data){
    std::shared_lock lock(map_lock);
    Table& table = getTableOrThrow(table_name);
    table.updateRow(id, std::move(new_data));
}

const Row& TableManager::getRowInTable(const std::string& table_name, const size_t id) const {
    std::shared_lock lock(map_lock);
    const Table& table = getTableOrThrow(table_name);
    return table.getRow(id);
}

Row& TableManager::getRowMutableInTable(const std::string& table_name, const size_t id){
    std::shared_lock lock(map_lock);
    Table& table = getTableOrThrow(table_name);
    return table.getRowMutable(id);
}

const std::vector<const Row*> TableManager::getAllRowsInTable(const std::string& table_name) const {
    std::shared_lock lock(map_lock);
    const Table& table = getTableOrThrow(table_name);
    return table.getAllRows();
}

const std::vector<Column>& TableManager::getColsInTable(const std::string& table_name) const {
    std::shared_lock lock(map_lock);
    const Table& table = getTableOrThrow(table_name);
    return table.getCols();
};