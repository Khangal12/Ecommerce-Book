import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete Icon
import { useUser } from "../../context/UserContext";
import axios from "axios"; // Make sure axios is installed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CartPage = () => {
  const { user } = useUser(); // Get user data from context
  const navigate  = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchCartData(user.id);
    }
  }, [user]);

  const fetchCartData = async (userId) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:5000/cart/${userId}/`); // Replace with your API endpoint
      setCartItems(response.data.items); // Assuming the API response contains cart items
    } catch (error) {
      console.error("Failed to fetch cart data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (id, type) => {
    try {
      const updatedItems = cartItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity:
                type === "increase"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      );

      // Update quantity on the server
      const updatedItem = updatedItems.find((item) => item.id === id);
      await axios.patch(`http://127.0.0.1:5000/cart/item/${id}/`, {
        quantity: updatedItem.quantity,
      });

      setCartItems(updatedItems);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/cart/item/${id}/`);
      setCartItems(cartItems.filter((item) => item.id !== id));
      toast.success("Амжилттай устгалаа");
    } catch (error) {
      console.error("Failed to delete item:", error);
    }
  };
  const handleCheckout = () => {
    navigate("/order", { state: { cartItems } });
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (cartItems.length === 0) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Миний сагс
        </Typography>
        <Typography variant="body1">Таны сагс хоосон байна.</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Миний сагс
      </Typography>
      <Grid container spacing={4}>
        {/* Cart Items Section */}
        <Grid item xs={8}>
          {cartItems.map((item) => (
            <Card
              key={item.id}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 2,
                p: 2,
              }}
            >
              <CardMedia
                component="img"
                image={item.image_url || "https://via.placeholder.com/100"}
                alt={item.title}
                sx={{ width: 100, height: 100 }}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.author}
                </Typography>
                <Typography variant="body1">{item.price}₮</Typography>
              </CardContent>
              <CardActions>
                <Typography variant="body1" sx={{ mr: 2 }}>
                  Ширхэг:
                </Typography>
                <IconButton
                  onClick={() => handleQuantityChange(item.id, "decrease")}
                >
                  <RemoveIcon />
                </IconButton>
                <Typography>{item.quantity}</Typography>
                <IconButton
                  onClick={() => handleQuantityChange(item.id, "increase")}
                >
                  <AddIcon />
                </IconButton>
                {/* Delete Icon */}
                <IconButton onClick={() => handleDelete(item.id)}>
                  <DeleteIcon style={{color:'red'}}/>
                </IconButton>
              </CardActions>
            </Card>
          ))}
        </Grid>

        <Grid item xs={4}>
          <Typography variant="h6" gutterBottom>
            Захиалгын мэдээлэл
          </Typography>
          <Box
            sx={{
              p: 3,
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            {cartItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    display: "-webkit-box",
                    overflow: "hidden",
                    WebkitBoxOrient: "vertical",
                    WebkitLineClamp: 1, // Number of lines before truncation
                    textOverflow: "ellipsis",
                    maxWidth: "10em",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1">
                  x{item.quantity} {item.price * item.quantity}₮
                </Typography>
              </Box>
            ))}
            <Typography variant="h6" sx={{ mt: 2 }}>
              Нийт: {totalPrice}₮
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{
                mt:2,
                backgroundColor: "black",
                color: "white",
                borderRadius: "50px",
                padding: "8px 20px",
                "&:hover": { backgroundColor: "darkgray" },
              }}
              onClick={handleCheckout}
            >
              Захиалах
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CartPage;
