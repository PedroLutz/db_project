import { useState, useEffect } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { Action, getTableNames, submitTableAction } from "../api/tableNavigator";

const TableNavigator = () => {
    const [tables, setTables] = useState<string[]>([]);
    const [newTable, setNewTable] = useState<string>("");

    const navigate: NavigateFunction = useNavigate();

    const fetchTables = async (): Promise<void> => {
        const tables = await getTableNames();
        setTables(tables);
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const handleDrop = async (table: string): Promise<void> => {
        let droppingConfirmation = confirm("Are you sure you want to drop the table?");

        if (!droppingConfirmation)
            return;

        const response = await submitTableAction(table, Action.DROP);
         if(response.status !== "success"){
            alert("Error: " + response.message);
            console.error("Error: " + response.message);
            return;
        }
        
        await fetchTables();
    }

    const handleCreate = async (table: string): Promise<void> => {
        const response = await submitTableAction(table, Action.CREATE);
        if(response.status !== "success"){
            alert("Error: " + response.message);
            console.error("Error: " + response.message);
            return;
        }
            
        await fetchTables();
        setNewTable("");
    }

    return (
        <div className="main">
            <div className="table_nav_container">
                <div className="table_nav_table_wrapper table_nav_new_table">
                    <div className="table_nav_table_name">New table</div>
                    <div className="table_nav_table_inputs">
                        <input
                            name="table"
                            value={newTable}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                setNewTable(e.target.value)}
                            placeholder="Table name"
                        />
                        <button onClick={() => handleCreate(newTable)}>Add new table</button>
                    </div>

                </div>
                {tables.map((table, index) => (
                    <div key={index} className="table_nav_table_wrapper">
                        <div className="table_nav_table_name">{table}</div>

                        <div className="table_nav_table_inputs">
                            <button onClick={() => navigate(`/${table}`)}>Access</button>
                            <button onClick={() => handleDrop(table)}>Drop</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};

export default TableNavigator;