import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import { format } from "date-fns";
import useApi from "../../../useApi";

const AddModal = ({ open, handleModal, refresh, editData }) => {
  const [formData, setFormData] = useState({
    name: "",
    author: "",
    detail: "",
    price: "",
    category: [],
    quantity: "",
    file: null,
    publishedDate: null,
  });
  const { apiCallWithToast, loading } = useApi();

  // Static list of book categories (for demo purposes, increase the length to test scroll)
  const categories = [
    "Утга зохиол", // Literature
    "Түүх", // History
    "Шинжлэх ухаан", // Science
    "Нийгэм", // Sociology
    "Газар зүй", // Geography
    "Уран зохиол", // Fiction
    "Биографи", // Biography
    "Философи", // Philosophy
    "Эдийн засаг", // Economics
    "Психологи", // Psychology
    "Математик", // Mathematics
    "Шашин", // Religion
    "Дизайн", // Design
    "Урлаг", // Art
    "Спорт", // Sports
    "Туршлага", // Experience/Travel
    "Эрүүл мэнд", // Health
    "Бизнес", // Business
    "Хувь хүн хөгжүүлэлт", // Self-Help
    "Программчлал", // Programming
    "Маркетинг", // Marketing
    "Санхүү", // Finance
    "Байгаль орчин", // Environment
    "Үйлдвэрлэл", // Industry
    "Улс төр", // Politics
    "Хууль",
    "Хүүхдийн ном",
  ];

  useEffect(() => {
    if (editData) {
      setFormData({
        name: editData.title || "",
        author: editData.author || "",
        price: editData.price || "",
        category: Array.isArray(editData.categories) ? editData.categories : [],
        file: editData.image_url || "",
        publishedDate: editData.published_date || "",
        quantity: editData.stock_quantity || "",
        detail: editData.description || "",
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      category: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      file: file,
    }));
  };

  const handleDateChange = (newValue) => {
    const formattedDate = newValue ? format(newValue, "yyyy-MM-dd") : null;
    console.log(formattedDate);
    setFormData((prev) => ({
      ...prev,
      publishedDate: formattedDate,
    }));
  };

  const handleConfirm = async () => {
    const form = new FormData();
    form.append("name", formData.name);
    form.append("author", formData.author);
    form.append("description", formData.detail);
    form.append("price", formData.price);
    formData.category.forEach((category) => {
      form.append("category", category);
    });
    form.append("quantity", formData.quantity);
    const formattedDate = formData.publishedDate
      ? format(new Date(formData.publishedDate), "yyyy-MM-dd")
      : null;
    form.append("publishedDate", formattedDate);

    if (formData.file) {
      form.append("file", formData.file);
    }

    try {
      const method = editData ? "PUT" : "POST";
      const url = editData
        ? `http://127.0.0.1:5000/admin/edit_book/${editData.id}/`
        : `http://127.0.0.1:5000/admin/add_book/`;
      const response = await apiCallWithToast(url, {
        method,
        data: form,
      });
      console.log(response);

      if (response.status === "success") {
        handleModal();
        refresh();
      }
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleModal} fullWidth maxWidth="sm">
      <DialogTitle>{editData ? "Ном засах" : "Шинэ ном нэмэх"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Нэр"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Зохиолч"
              name="author"
              value={formData.author}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              margin="dense"
              label="Тайлбар"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Төрөл</InputLabel>
              <Select
                label="Төрөл"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
                multiple
                renderValue={(selected) => selected.join(", ")} // Display selected categories as a comma-separated string
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300, // Set max height to make it scrollable
                      overflowY: "auto",
                    },
                  },
                }}
              >
                {categories.map((category, index) => (
                  <MenuItem key={index} value={category}>
                    <Checkbox
                      checked={formData.category.indexOf(category) > -1}
                    />
                    <ListItemText primary={category} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Тоо ширхэг"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              margin="dense"
              label="Үнэ"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Хэвлэгдсэн огноо"
                value={
                  formData.publishedDate
                    ? new Date(formData.publishedDate)
                    : null
                }
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    margin="dense"
                    sx={{
                      width: "100%",
                      "& .MuiInputBase-root": {
                        padding: "0 !important",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Typography variant="body1" gutterBottom>
                Зураг оруулах
              </Typography>
              <Button variant="contained" component="label">
                Сонгох
                <input type="file" hidden onChange={handleFileChange} />
              </Button>
              {formData.file && (
                <Typography variant="body2" color="textSecondary" mt={1}>
                  Сонгосон зураг: {formData.file.name}
                </Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleModal} variant="outlined" color="primary">
          Хаах
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="primary"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" /> // Show loading spinner
          ) : (
            "Хадгалах"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddModal;
