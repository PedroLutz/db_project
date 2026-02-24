import { useState, useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { Action, getTableNames, submitTableAction } from "../api/tableNavigator";

const TableNavigator = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [newTable, setNewTable] = useState<string>("");

    const navigate: NavigateFunction = useNavigate();

    const fetchTables = async () : Promise<void> => {
        const tables = await getTableNames();
        setTables(tables);
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleAction = async (table: string, action: string) => {
        await submitTableAction(table, action);
        await fetchTables();
    }

    return (
        <div className="main">
            {tables.map((table, index) => (
                <div key={index}
                    className="table_container"
                >
                    {table}
                    <div>
                        <button onClick={() => navigate(`/${table}`)}>Access</button>
                        <button onClick={() => handleAction(table, Action.DROP)}>Drop</button>
                    </div>
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
                <button onClick={() => handleAction(newTable, Action.CREATE)}>Add new table</button>
            </div>
        </div>
    )
};

export default TableNavigator;