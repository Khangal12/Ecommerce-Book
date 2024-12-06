import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Divider
} from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";

const CheckoutPage = () => {
  const steps = ["Хүргэх хаяг", "Төлбөр", "Баталгаажуулалт"];

  const [activeStep, setActiveStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    city: "Улаанбаатар",
    district: "",
    subDistrict: "",
    detailedAddress: "",
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const { user } = useUser();
  const { fetchCartCount } = useCart();

  const paymentMethods = [
    {
      id: 1,
      name: "Хаан банк",
      image: "/assets/khanbank.png",
    },
    {
      id: 2,
      name: "Голомт банк",
      image: "/assets/golomt.png",
    },
    {
      id: 3,
      name: "Хас банк",
      image: "/assets/khas.png",
    },
    {
      id: 4,
      name: "M банк",
      image: "/assets/mbank.png",
    },
  ];

  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] };

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleNext = () => {
    if (activeStep === 0) {
      // Step 1: Validate address form fields
      const { name, phone, city, district, subDistrict, detailedAddress } =
        formValues;
      if (
        !name ||
        !phone ||
        !city ||
        !district ||
        !subDistrict ||
        !detailedAddress
      ) {
        setSnackbarMessage("Бүх хаягийн мэдээллийг оруулна уу!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
    } else if (activeStep === 1) {
      // Step 2: Ensure payment method is selected
      if (!selectedPayment) {
        setSnackbarMessage("Төлбөрийн хэрэгслийг сонгоно уу!");
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
    } else if (activeStep === steps.length - 1) {
      // Final Step: Optionally validate all fields again if needed
      if (
        !formValues.name ||
        !formValues.phone ||
        !formValues.city ||
        !formValues.district ||
        !formValues.subDistrict ||
        !formValues.detailedAddress ||
        !selectedPayment
      ) {
        setSnackbarMessage(
          "Дараах бүх мэдээллийг бөглөсөн эсэхийг шалгана уу!"
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
        return;
      }
    }

    // Proceed to the next step if everything is valid
    if (activeStep === steps.length - 1) {
		fetchCartCount();hanga
      handleOrderSubmit(); // Final submission
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () =>
    setActiveStep((prevActiveStep) => prevActiveStep - 1);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleOrderSubmit = async () => {
    try {
      // Construct the order object
      const orderData = {
        customer: {
          user_id: user.id,
		  address:{
			name: formValues.name,
			phone: formValues.phone,
			city: formValues.city,
			district: formValues.district,
			subDistrict: formValues.subDistrict,
			detailedAddress: formValues.detailedAddress,
		  }
        },
        cartItems: cartItems,
      };

      // Make an API call to submit the order
      const response = await axios.post(
        "http://127.0.0.1:5000/orders/",
        orderData
      );

      // Handle API response
      if (response.status === 200) {
        setSnackbarMessage("Захиалга амжилттай хүлээн авлаа!");
        setSnackbarSeverity("success");
        setOpenSnackbar(true);
		// fetchCartCount();
        setActiveStep(steps.length - 1); // Move to the confirmation step
      } else {
        setSnackbarMessage(
          "Захиалга илгээхэд алдаа гарлаа. Дахин оролдоно уу."
        );
        setSnackbarSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Error submitting the order: ", error);
      setSnackbarMessage("Захиалга илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  return (
    <Box sx={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      {/* Stepper */}
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {activeStep === 0 && (
        <Box>
          <Typography variant="h6" mb={2}>
            Хүргэлтийн хаяг
          </Typography>
          <TextField
            fullWidth
            label="Хүлээн авагчийн нэр"
            name="name"
            value={formValues.name}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Утас"
            name="phone"
            value={formValues.phone}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Хот / Аймаг</InputLabel>
            <Select
              name="city"
              value={formValues.city}
              onChange={handleInputChange}
            >
              <MenuItem value="Улаанбаатар">Улаанбаатар</MenuItem>
              <MenuItem value="Багануур">Багануур</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Дүүрэг / Сум"
            name="district"
            value={formValues.district}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Хороо / Баг"
            name="subDistrict"
            value={formValues.subDistrict}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Дэлгэрэнгүй хаяг"
            name="detailedAddress"
            value={formValues.detailedAddress}
            onChange={handleInputChange}
            multiline
            rows={3}
            sx={{ mb: 2 }}
          />
        </Box>
      )}

      {activeStep === 1 && (
        <Grid container spacing={3}>
          {/* Payment Method Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Төлбөрийн хэрэгсэл сонгох
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 2,
              }}
            >
              {paymentMethods.map((method) => (
                <Box
                  key={method.id}
                  sx={{
                    p: 2,
                    border: "1px solid",
                    borderColor:
                      method.id === selectedPayment.id ? "blue" : "#ddd",
                    borderRadius: "8px",
                    textAlign: "center",
                    cursor: "pointer",
                    backgroundColor:
                      method.id === selectedPayment.id ? "black" : "white",
                    color: method.id === selectedPayment.id ? "white" : "black",
                    "&:hover": {
                      borderColor: "blue",
                    },
                  }}
                  onClick={() => setSelectedPayment(method)}
                >
                  <img
                    src={method.image}
                    alt={method.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginBottom: "8px",
                    }}
                  />
                  <Typography>{method.name}</Typography>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6}>
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
                  mt: 2,
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "50px",
                  padding: "8px 20px",
                  "&:hover": { backgroundColor: "darkgray" },
                }}
				onClick={handleOrderSubmit}
              >
                Төлбөр төлөх
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}

{activeStep === 2 && (
  <Box 
    sx={{
      maxWidth: 600,
      margin: 'auto',
      padding: 3,
      boxShadow: 3,
      borderRadius: 2,
      backgroundColor: '#f9f9f9'
    }}
  >
    <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold', marginBottom: 2 }}>
      Захиалга Дэлгэрэнгүй
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
      <Typography variant="body1" color="text.secondary">Нийт үнэ:</Typography>
      <Typography variant="body1">{totalPrice}₮</Typography>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
      <Typography variant="body1" color="text.secondary">Төлбөрийн хэрэгсэл:</Typography>
      <Typography variant="body1">{selectedPayment.name}</Typography>
    </Box>
    <Divider sx={{ marginY: 2 }} />
    <Box sx={{ marginBottom: 1 }}>
      <Typography variant="subtitle1" color="text.secondary" sx={{ marginBottom: 1 }}>Хүргэлтийн мэдээлэл</Typography>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" color="text.secondary">Хүлээн авагч:</Typography>
        <Typography variant="body1">{formValues.name}</Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" color="text.secondary">Бүртгүүлсэн утас:</Typography>
        <Typography variant="body1">{formValues.phone}</Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" color="text.secondary">Хот:</Typography>
        <Typography variant="body1">{formValues.city}</Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" color="text.secondary">Дүүрэг:</Typography>
        <Typography variant="body1">{formValues.district}</Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" color="text.secondary">Хороо:</Typography>
        <Typography variant="body1">{formValues.subDistrict}</Typography>
      </Box>
      <Box sx={{ marginBottom: 1 }}>
        <Typography variant="body1" color="text.secondary">Дэлгэрэнгүй хаяг:</Typography>
        <Typography variant="body1">{formValues.detailedAddress}</Typography>
      </Box>
    </Box>
  </Box>
)}


      {/* Action Buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          variant="outlined"
        >
          Буцах
        </Button>
        <Button onClick={handleNext} variant="contained">
          {activeStep === steps.length - 1 ? "Дуусгах" : "Дараах"}
        </Button>
      </Box>

      {/* Snackbar for Toast Notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CheckoutPage;
