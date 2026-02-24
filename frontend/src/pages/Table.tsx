import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Type } from "../utils/TypeObject";
import AdaptiveInput from "./AdaptiveInput";
import { handleOperation } from "../api/table";

interface Column {
    type: string;
    name: string;
};

interface Row {
    id: number;
    data: any[];
}

const Table = () => {
    const { tableName } = useParams<{ tableName: string }>();

    const [columns, setColumns] = useState<Column[]>([]);
    const [data, setData] = useState<Record<string, any>>({});
    const [rows, setRows] = useState<Row[]>([]);

    const fetchTable = async () => {
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
        console.log(result)
        setRows(result.rows);
    }

    const dropColumn = async (column: string) => {
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

    const insertRow = async () => {
        if (!tableName) {
            console.error("Table name not found in the URL!");
            return;
        }

        const dataArray = [];
        for(const [_, value] of Object.entries(data)){
            dataArray.push(value);
        }
        
        const response = await handleOperation({
            action: "insert_row",
            table: tableName,
            data: dataArray
        });

        if (response.status !== "success")
            console.error("Error: " + response.message);

        
        await fetchTable();
    }

    useEffect(() => {
        fetchTable();
    }, [])

    useEffect(() => {
        const obj: Record<string, any> = {};

        columns.forEach((column) => {
            obj[column.name] = "";
        })

        setData(obj);
    }, [columns]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setData({
            ...data,
            [name]: value
        })
    }

    const ColumnInput = () => {
        const [colName, setColName] = useState<string>("");
        const [colType, setColType] = useState<string>(Type.INT);

        const createColumn = async () => {
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

    return (
        <>
            <div className="main">
                <h2>{tableName}</h2>
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
                            <th><ColumnInput /></th>
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
                                        value={data[column.name]}
                                        placeholder={column.name}
                                        onChange={handleChange}
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
                                {row.data.map((item, itemIndex) => (
                                    <td key={itemIndex}>{item}</td>
                                ))}
                                <td>Edit row</td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </>
    )
};

export default Table;