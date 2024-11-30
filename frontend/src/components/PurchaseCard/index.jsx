import React, { useState } from "react";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
} from "@mui/material";

const PurchaseCard = ({ stock, price }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "16px",
        padding: 3,
        maxWidth: 300,
        textAlign: "center",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Price Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
          marginTop:3,
          maxHeight:400
        }}
      >
        <Typography variant="subtitle1">Онлайн үнэ:</Typography>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#2c3e50" }}>
          {price}₮
        </Typography>
      </Box>

      {/* Stock Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Typography variant="subtitle1">Үлдэгдэл:</Typography>
        <Typography variant="h6" sx={{ color: "#2c3e50" }}>
          {stock} ширхэг
        </Typography>
      </Box>

      {/* Quantity Selection */}
      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel id="quantity-label">Авах</InputLabel>
        <Select
        size="small"
          labelId="quantity-label"
          value={quantity}
          onChange={handleQuantityChange}
        >
          {[...Array(10).keys()].map((num) => (
            <MenuItem value={num + 1} key={num}>
              {num + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Action Buttons */}
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: "#5E3A90",
          color: "#fff",
          marginTop: 5,
          borderRadius: "50px",
          padding: "12px 16px", // Custom size
          fontSize: "16px", 
          "&:hover": { backgroundColor: "#4a2e75" },
        }}
      >
        ❤️ Сагсанд нэмэх
      </Button>

      <Button
        variant="outlined"
        fullWidth
        size="medium"
        sx={{
          marginTop: 2,
          borderColor: "#ccc",
          color: "#333",
          borderRadius: "50px",
          padding: "12px 16px", // Custom size
          fontSize: "16px", 
          "&:hover": { backgroundColor: "#f9f9f9" },
        }}
      >
        ☆ Худалдан авах
      </Button>
    </Box>
  );
};

export default PurchaseCard;
