import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTableNames, submitNewTable } from "../api/tables";

const TableNavigator = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [newTable, setNewTable] = useState<string>("");

    const navigate = useNavigate();

    const fetchTables = async () => {
            const tables = await getTableNames();
            console.log(tables)
            setTables(tables);
        };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleSubmit = async () => {
        submitNewTable(newTable);
        fetchTables();
    }

    return (
        <div className="main">
            {tables.map((table, index) => (
                <div key={index}
                    className="table_container"
                    onClick={() => navigate(`/${table}`)}
                >
                    {table}
                </div>
            ))}
            <div className="table_container">
                <input
                    name="table"
                    value={newTable}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
                        setNewTable(e.target.value)}
                    placeholder="Table name"
                />
                <button onClick={handleSubmit}>Add new table</button>
            </div>
        </div>
    )
};

export default TableNavigator;