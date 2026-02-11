#include "table.hpp"

Table::ValidationResult Table::validateRow (const std::vector<Cell>& data) const {
    if(data.size() != cols.size())
        return "The number of columns is invalid!";
    

    for(size_t i = 0; i < data.size(); i++){
        if(data.at(i).index() != static_cast<size_t>(cols.at(i).type) &&
            data.at(i).index() != 0)
            return "Incorrect type in column " + cols.at(i).name;
    }

    return std::nullopt;
}

void Table::createColumn(const Column& column){
    std::unique_lock lock(rw_lock);
    if(col_name_to_index.count(column.name))
        throw std::invalid_argument("Column already exists!");
    
    cols.push_back({column.name, column.type}); //insert column definition
    col_name_to_index[column.name] = cols.size() - 1; //insert column index

    for(auto& row : rows) {
        row.data.push_back(Cell{}); //add null value in column of existing rows
    }
};

void Table::insertRow(std::vector<Cell> data){
    std::unique_lock lock(rw_lock);
    auto error = validateRow(data);

    if(error.has_value())
        throw std::invalid_argument(error.value());

    if(!free_ids.empty()){
        size_t id = free_ids.front();
        rows.at(id) = {id, std::move(data), false};
        free_ids.pop();
    } else {
        rows.push_back({last_row_id++, std::move(data), false});
    }
}

void Table::removeColumn(const std::string &col_name){
    std::unique_lock lock(rw_lock);
    if(!col_name_to_index.count(col_name))
        throw std::invalid_argument("This column does not exist!");

    size_t index = col_name_to_index.at(col_name);
    cols.erase(cols.begin() + index); //delete the column defiition
    col_name_to_index.erase(col_name); //delete the column index

    for(auto &pair : col_name_to_index){ //fix index of remaining columns
        if(pair.second > index) {
            pair.second--;
        }
    }

    for(auto &r : rows) { //delete the columns from the rows
        r.data.erase(r.data.begin() + index);
    }
}

void Table::deleteRow(const size_t id){
    std::unique_lock lock(rw_lock);
    if(id >= last_row_id || rows.at(id).is_dead) 
        throw std::invalid_argument("This ID does not exist!");

    rows.at(id).is_dead = true;
    rows.at(id).data.clear();
    free_ids.push(id);
}

void Table::updateRow(const size_t id, std::vector<Cell> new_data){
    std::unique_lock lock(rw_lock);
    if(id >= last_row_id || rows.at(id).is_dead)
        throw std::invalid_argument("This ID does not exist!");

    auto error = validateRow(new_data);

    if(error.has_value())
        throw std::invalid_argument(error.value());

    rows.at(id).data = std::move(new_data);
}

const Row& Table::getRow(const size_t id) const{
    std::shared_lock lock(rw_lock);
    if(id >= last_row_id || rows.at(id).is_dead)
        throw std::invalid_argument("This ID does not exist!");

    return rows.at(id);
}

Row& Table::getRowMutable(const size_t id){
    std::shared_lock lock(rw_lock);
    if(id >= last_row_id || rows.at(id).is_dead)
        throw std::invalid_argument("This ID does not exist!");

    return rows.at(id);
}

const std::vector<Row>& Table::getAllRows() const{
    std::shared_lock lock(rw_lock);
    return rows;
}

const std::vector<Column>& Table::getCols() const {
    std::shared_lock lock(rw_lock);
    return cols;
}