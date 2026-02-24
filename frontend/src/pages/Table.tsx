import React, { useEffect, useState } from "react";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Type } from "../utils/TypeObject";
import AdaptiveInput from "../components/AdaptiveInput";
import { handleOperation } from "../api/table";
import ColumnInput from "../components/ColumnInput";

interface Column {
    type: string;
    name: string;
};

interface Row {
    id: number;
    data: any[];
}

const Table = (): React.ReactNode => {
    const { tableName } = useParams<{ tableName: string }>();

    const navigate: NavigateFunction = useNavigate();

    const [columns, setColumns] = useState<Column[]>([]);
    const [columnsTypes, setColumnsTypes] = useState<Record<string, string>>({});
    const [rows, setRows] = useState<Row[]>([]);

    const [newData, setNewData] = useState<Record<string, any>>({});
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<Record<string, any>>({});

    const fetchTable = async (): Promise<void> => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        const response = await handleOperation({
            action: "fetch_table",
            table: tableName
        })

        if (response.status !== "success") {
            console.error("Error: " + response.message);
            return;
        }

        const { result } = response;
        setColumns(result.cols);
        const colTypes: Record<string, string> = {};
        for (const col of result.cols) {
            colTypes[col.name] = col.type;
        }
        setColumnsTypes(colTypes);
        setRows(result.rows);
    }

    const dropColumn = async (column: string): Promise<void> => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        const response = await handleOperation({
            action: "drop_column",
            table: tableName,
            name: column
        });

        if (response.status !== "success")
            console.error("Error: " + response.message);

        await fetchTable();
    }

    const castToType = (key: string, value: string | number): string | number | boolean => {
        if (columnsTypes[key] == Type.INT || columnsTypes[key] == Type.FLOAT)
            return Number(value);
        else if (columnsTypes[key] == Type.BOOL)
            return value === 1;
        else
            return value;
    }

    const insertRow = async (): Promise<void> => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        const dataArray = [];
        for (const [key, value] of Object.entries(newData)) {
            dataArray.push(castToType(key, value));
        }

        const response = await handleOperation({
            action: "insert_row",
            table: tableName,
            data: dataArray
        });

        if (response.status !== "success")
            console.error("Error: " + response.message);

        await fetchTable();
        setNewData({});
    }

    const deleteRow = async (id: number): Promise<void> => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        const response = await handleOperation({
            action: "delete_row",
            table: tableName,
            id: id
        })

        if (response.status !== "success")
            console.error("Error: " + response.message);

        await fetchTable();
    }

    const handleUpdateClick = (id: number, data: Record<string, any>) : void => {
        setEditingId(id);
        const dataObj : Record<string, any> = {};
        
        var i = 0;
        for(const col of columns){
            dataObj[col.name] = data[i++];
        }
        setEditData(dataObj);
    }

    const updateRow = async () : Promise<void> => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        if(editingId === null) {
            console.error("No row selected!");
            return;
        }

        const dataArray = [];
        for (const [key, value] of Object.entries(editData)) {
            dataArray.push(castToType(key, value));
        }

        const response = await handleOperation({
            action: "update_row",
            table: tableName,
            data: dataArray,
            id: editingId
        });

        if (response.status !== "success")
            console.error("Error: " + response.message);

        await fetchTable();
        setEditingId(null);
        setEditData({});
    }

    useEffect(() => {
        fetchTable();
    }, [])

    useEffect(() => {
        const obj: Record<string, any> = {};

        columns.forEach((column) => {
            obj[column.name] = "";
        })

        setNewData(obj);
    }, [columns]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, 
        obj: Record<string, any>,
        setter: React.Dispatch<React.SetStateAction<Record<string, any>>>): void => {
        const { name, value } = e.target;

        setter({
            ...obj,
            [name]: value
        })
    }

    return (
        <>
            <div className="main">
                <h2>{tableName}</h2>
                <button onClick={() => navigate("/")}>Back to Table Navigation</button>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            {columns.map((column, index) => (
                                <th key={index}>
                                    <div>
                                        {column.name}
                                        <button onClick={() => dropColumn(column.name)}>Drop</button>
                                    </div>
                                </th>
                            ))}
                            <th><ColumnInput tableName={tableName} fetchTable={fetchTable} /></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            {columns.map((column, index) => (
                                <td key={index}>
                                    <AdaptiveInput
                                        name={column.name}
                                        type={column.type}
                                        value={newData[column.name]}
                                        placeholder={column.name}
                                        onChange={(e) => handleChange(e, newData, setNewData)}
                                    />
                                </td>
                            ))}
                            <td>
                                <button onClick={() => insertRow()}>Add row</button>
                            </td>
                        </tr>
                        {rows.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{row.id}</td>
                                {editingId !== row.id && (
                                    <>
                                        {row.data.map((item, itemIndex) => (
                                            <td key={itemIndex}>{item}</td>
                                        ))}
                                        <td>
                                            <div>
                                                <button
                                                    onClick={() => handleUpdateClick(row.id, row.data)}
                                                >
                                                    Edit row
                                                </button>
                                                <button
                                                    onClick={() => deleteRow(row.id)}
                                                >
                                                    Delete row
                                                </button>
                                            </div>

                                        </td>
                                    </>
                                )}
                                {editingId === row.id && (
                                    <>
                                        {columns.map((column, index) => (
                                            <td key={index}>
                                                <AdaptiveInput
                                                    name={column.name}
                                                    type={column.type}
                                                    value={editData[column.name]}
                                                    placeholder={column.name}
                                                    onChange={(e) => handleChange(e, editData, setEditData)}
                                                />
                                            </td>
                                        ))}
                                        <td>
                                            <button onClick={() => updateRow()}>Confirm edit</button>
                                            <button onClick={() => setEditingId(null)}>Quit editing</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </>
    )
};

export default Table;