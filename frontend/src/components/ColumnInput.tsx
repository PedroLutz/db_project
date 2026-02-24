import { useState } from "react";
import { Type } from "../utils/TypeObject";
import { handleOperation } from "../api/table";

interface ColumnInputProps {
    tableName: string | undefined, fetchTable: () => Promise<void>
}

const ColumnInput = ({tableName, fetchTable} : ColumnInputProps) : React.ReactNode => {
        const [colName, setColName] = useState<string>("");
        const [colType, setColType] = useState<string>(Type.INT);

        const createColumn = async (): Promise<void> => {
            if (!tableName) {
                console.error("Table name not found in the URL!");
                return;
            }

            const response = await handleOperation({
                action: "insert_column",
                table: tableName,
                name: colName,
                type: colType
            });

            if (response.status !== "success")
                console.error("Error: " + response.message);

            setColName("");
            setColType(Type.INT);

            await fetchTable();
        }

        return (
            <div>
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
                <button onClick={createColumn}>Add new column</button>
            </div>
        )
    };

    export default ColumnInput;