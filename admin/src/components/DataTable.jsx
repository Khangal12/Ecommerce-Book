// src/components/DataTable.js
import React from "react";
import { DataGrid } from "@mui/x-data-grid";

function DataTable({ rows, columns }) {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} pageSize={5} />
    </div>
  );
}

export default DataTable;