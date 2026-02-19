export const getTableNames = async () => {
    const response = await fetch("http://localhost:8080/tables");
    const data = await response.json();
    if(data.code !== 200) throw new Error("Error while fetching tables");
    return data.body;
}

export const submitNewTable = async (tableName: string) => {
    const dataPackage = {
        action: "create_table",
        table: tableName
    }

    const response = await fetch("http://localhost:8080/query", 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(dataPackage)
        }
    )

    const result = await response.json();
    return result;
}