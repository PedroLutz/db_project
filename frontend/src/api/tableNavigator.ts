export const Action = {
    CREATE: "create_table",
    DROP: "drop_table"
} as const;

export const getTableNames = async () => {
    const response = await fetch("http://localhost:8080/tables");
    const data = await response.json();
    if(data.status !== "success") throw new Error("Error while fetching tables");
    return data.result;
}

export const submitTableAction = async (tableName: string, action: string) => {
    const dataPackage = {
        action: action,
        table: tableName
    }

    const response = await fetch("http://localhost:8080/query", 
        {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dataPackage)
        }
    )

    const result = await response.json();
    return result;
}