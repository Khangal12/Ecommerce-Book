import React, { useState, useEffect } from "react";
import { Button, Box, IconButton, CircularProgress } from "@mui/material";
import DataTable from "../../components/DataTable";
import AddModal from "./Modal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import useApi from "../../useApi";

const Products = () => {
  const [modal, setModal] = useState(false);
  const [rows, setRows] = useState([]);
  const [currentProduct, setCurrentProduct] = useState(null); // Store selected product data
  const { apiCallWithToast, loading } = useApi(); // Use the custom hook

  const handleModal = () => {
    setModal(!modal);
    setCurrentProduct(null); // Reset the product when closing the modal
  };

  const handleEdit = (product) => {
    setCurrentProduct(product); // Set the product to be edited
    setModal(true); // Open the modal in edit mode
  };

  const getDatas = async () => {
    try {
      const response = await apiCallWithToast(
        "http://127.0.0.1:5000/admin/books/"
      );
      const books = response.books;
      setRows(books);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiCallWithToast(`http://127.0.0.1:5000/admin/delete_book/${id}/`, {
        method: "DELETE",
      });
      getDatas();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    getDatas();
  }, []);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "title", headerName: "Нэр", width: 150 },
    { field: "author", headerName: "Зохиолч", width: 150 },
    { field: "price", headerName: "Үнэ", width: 90 },
    { field: "categories", headerName: "Төрөл", width: 130 },
    { field: "image_url", headerName: "Зураг", width: 130 },
    { field: "published_date", headerName: "Хэвлэгдсэн огноо", width: 170 },
    { field: "stock_quantity", headerName: "Үлдэгдэл", width: 90 },
    { field: "description", headerName: "Тайлбар", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleModal}
          disabled={loading}
        >
          {loading ? "Loading..." : "Ном нэмэх"}
        </Button>
      </Box>
      <Box sx={{ width: "100%", overflowX: "auto" }}>
        {loading ? (
          <CircularProgress />
        ) : (
          <DataTable
            rows={rows}
            columns={columns}
            checkboxSelection
            autoHeight
          />
        )}
      </Box>
      {modal && (
        <AddModal
          open={modal}
          handleModal={handleModal}
          refresh={getDatas}
          editData={currentProduct}
        />
      )}
    </Box>
  );
};

export default Products;
