#ifndef TABLE_HPP
#define TABLE_HPP

#include <variant>
#include <vector>
#include <iostream>
#include <unordered_map>
#include <exception>
#include <queue>
#include <optional>

using Cell = std::variant<std::monostate, int, float, bool, std::string>;

enum class TypeTag { NULL_TYPE = 0, INT, FLOAT, BOOL, STRING};

struct Column {
    std::string name;
    TypeTag type;
};

struct Row {
    size_t id;
    std::vector<Cell> data;
    bool is_dead = true;
};

class Table {
    private:
        std::string name;
        std::vector<Column> cols;
        std::vector<Row> rows;
        std::unordered_map<std::string, size_t> col_name_to_index;
        std::queue<size_t> free_ids;
        size_t last_row_id = 0;

        using ValidationResult = std::optional<std::string>;
        ValidationResult validateRow (const std::vector<Cell>& data) const;

    public:
        Table(std::string n) : name(n) {};
        ~Table() = default;

        void createColumn(const std::string &col_name, const TypeTag type);
        void insertRow(std::vector<Cell> data);
        
        void removeColumn(const std::string &col_name);
        void deleteRow(const size_t id);

        void updateRow(const size_t id, std::vector<Cell> new_data);
        const Row& getRow(const size_t id) const;
        Row& getRowMutable(const size_t id);
};

#endif