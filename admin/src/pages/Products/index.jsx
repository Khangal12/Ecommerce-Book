import React from "react";
import { Button, Box } from "@mui/material";
import DataTable from "../../components/DataTable";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  { field: "name", headerName: "Name", width: 150 },
  { field: "price", headerName: "Price", width: 130 },
  { field: "category", headerName: "Category", width: 130 },
];

const rows = [
  { id: 1, name: "Product A", price: "$100", category: "Electronics" },
  { id: 2, name: "Product B", price: "$200", category: "Apparel" },
];

function Products() {
  return (
    <Box>
      {/* Box to wrap the button for better control */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary.main">
          Add Product
        </Button>
      </Box>

      {/* Data table */}
      <DataTable rows={rows} columns={columns} />
    </Box>
  );
}

export default Products;
