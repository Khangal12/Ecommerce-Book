import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const WarningModal = ({ open, handleClose }) => {
  const navigate = useNavigate();

  function handleNavigate() {
    navigate("/login");
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Анхааруулга</DialogTitle>
      <DialogContent>
        <p>Энэ үйлдэл хийхэд нэвтрэх шаардлагатай</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Хаах
        </Button>
        <Button onClick={handleNavigate}>Нэвтрэх</Button>
      </DialogActions>
    </Dialog>
  );
};

export default WarningModal;
