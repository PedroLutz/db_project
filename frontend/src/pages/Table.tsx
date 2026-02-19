import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Type } from "../utils/TypeObject";
import AdaptiveInput from "./AdaptiveInput";

interface Column {
    type: number;
    name: string;
};

interface Row {
    id: number;
    data: any[];
}

const Table = () => {
    const { tableName } = useParams<{tableName: string}>();

    const [columns, setColumns] = useState<Column[]>([]);
    const [data, setData] = useState<Record<string, any>>({});
    const [rows, setRows] = useState<Row[]>([]);

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
        const [newCol, setNewCol] = useState<string>("");

        return (
            <>
                <input
                    type="text"
                    name="newCol"
                    value={newCol}
                    placeholder="New Column"
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setNewCol(e.target.value)}
                />
                <button>Add new column</button>
            </>
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
                                <th key={index}>{column.name}</th>
                            ))}
                            <th><ColumnInput/></th>
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
                                <button>Add row</button>
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