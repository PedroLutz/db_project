import { useState } from "react";
import { Type } from "../utils/TypeObject";

interface Column {
    type: number,
    name: string
};

const columnTypeToInputType = {
    [Type.INT]: "number",
    [Type.FLOAT]: "number",
    [Type.BOOL]: ""
} as const;

const columnTypeInputHandlers = {
    [Type.INT]: () => {},
    [Type.FLOAT]: () => {},
    [Type.BOOL]: () => {},
    [Type.STRING]: () => {}
} as const;

const Table = () => {
    const [columns, setColumns] = useState<Column[]>([]);

    return (
        <>
            <div className="main">
                <table>
                    <thead>
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column.name}</th>
                            ))}
                            <th>Add column</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            {columns.map((column, index) => (
                                <td key={index}>
                                    <input
                                        name={column.name}
                                    
                                    />
                                </td>
                            ))}
                        </tr>
                        { /* Dynamically generated table rows */}
                    </tbody>
                    
                </table>
            </div>
        </>
    )
};

export default Table;