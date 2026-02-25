import { useState } from "react";
import { Type } from "../utils/TypeObject";
import { handleOperation } from "../api/table";

interface ColumnInputProps {
    tableName: string | undefined, fetchTable: () => Promise<void>
}

const ColumnInput = ({ tableName, fetchTable }: ColumnInputProps): React.ReactNode => {
    const [colName, setColName] = useState<string>("");
    const [colType, setColType] = useState<string>(Type.INT);

    const createColumn = async (): Promise<void> => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        if(colName == ""){
            alert("Please add a name to the column!");
            return;
        }

        const response = await handleOperation({
            action: "insert_column",
            table: tableName,
            name: colName,
            type: colType
        });

        if (response.status !== "success"){
            console.error("Error: " + response.message);
            alert("Error: " + response.message);
            return;
        }

        setColName("");
        setColType(Type.INT);

        await fetchTable();
    }

    return (
        <div className="column_input_component">
            <div className="ci_container">
                <div className="ci_inputs">
                    <input
                        type="text"
                        name="colName"
                        value={colName}
                        placeholder="New Column"
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setColName(e.target.value)}
                    />
                    <select
                        name="colType"
                        value={colType}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setColType(e.target.value)}
                    >
                        <option value={Type.INT}>Integer</option>
                        <option value={Type.FLOAT}>Float</option>
                        <option value={Type.BOOL}>Boolean</option>
                        <option value={Type.STRING}>String</option>
                    </select>
                </div>
                <button onClick={createColumn}>Add</button>
            </div>


        </div>
    )
};

export default ColumnInput;