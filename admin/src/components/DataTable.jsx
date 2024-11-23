import React, { useState } from "react";
import PropTypes from "prop-types";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

function DataTable({ rows, columns, pageSize = 5, customStyles = {} }) {
  const [openModal, setOpenModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageClick = (imageUrl) => {
    setImageUrl(imageUrl);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const modifiedColumns = columns.map((col) => {
    if (col.field === "image_url") {
      return {
        ...col,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Button
              variant="contained"
              size="small"
              color="primary"
              onClick={() => handleImageClick(params.value)}
              style={{ textTransform: "none" }}
            >
              Зураг
            </Button>
          </div>
        ),
      };
    }
    return col;
  });

  return (
    <div style={{ height: 400, width: "100%", ...customStyles }}>
      <DataGrid rows={rows} columns={modifiedColumns} pageSize={pageSize} />

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Зураг</DialogTitle>
        <DialogContent>
          <img
            src={imageUrl}
            alt="Selected"
            style={{ width: "100%", height: "auto", objectFit: "contain" }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Хаах
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

DataTable.propTypes = {
  rows: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  onRowClick: PropTypes.func,
  checkboxSelection: PropTypes.bool,
  onSelectionModelChange: PropTypes.func,
  customStyles: PropTypes.object,
};

export default DataTable;
