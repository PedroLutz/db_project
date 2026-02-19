import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Table from "./pages/Table";
import TableNavigator from "./pages/TableNavigator";

const router = createBrowserRouter([
    {
        path: "/",
        element: <TableNavigator/>
    },
    {
        path: "/:tableName",
        element: <Table/>

    }
])

export function AppRoutes() {
    return <RouterProvider router={router}/>
}