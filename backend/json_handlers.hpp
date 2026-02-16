#ifndef JSON_HANDLERS_HPP
#define JSON_HANDLERS_HPP

#include <nlohmann/json.hpp>
#include "table.hpp"

using json = nlohmann::json;

json cellToJson(const Cell& cell);
json rowToJson(const Row& row);
Cell jsonToCell(const json& j);

#endif