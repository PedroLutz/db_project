type ActionFetchTable = {
    action: "fetch_table";
    table: string;
}

type ActionInsertColumn = {
    action: "insert_column";
    table: string;
    name: string;
    type: string;
}

type ActionDropColumn = {
    action: "drop_column"
    table: string;
    name: string;
}

type ActionColumnConfig = ActionInsertColumn | ActionDropColumn;

type ActionDeleteRow = {
    action: "delete_row";
    table: string;
    id: number;
}

type ActionInsertRow = {
    action: "insert_row";
    table: string;
    data: any[];
}

type ActionUpdateRow = {
    action: "update_row";
    table: string;
    id: number;
    data: any[];
}

type ActionRowConfig = ActionDeleteRow | ActionInsertRow | ActionUpdateRow;

export type DbPayload =
    ActionFetchTable | ActionColumnConfig | ActionRowConfig;

export const handleOperation = async (payload: DbPayload) => {
    const response = await fetch("http://localhost:8080/query", 
        {
            method: "POST",
            mode: "cors",
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payload)
        }
    )
    const result = await response.json();
    return result;
}