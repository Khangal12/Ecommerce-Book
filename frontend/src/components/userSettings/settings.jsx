import React, { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { useUser } from "../../context/UserContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the toast CSS

const UserSettings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");  // Added address
  const [isChanged, setIsChanged] = useState(false);
  const { user } = useUser();

  const checkIfChanged = () => {
    if (
      username !== (user?.username || "") ||
      email !== (user?.email || "") ||
      phone !== (user?.phone_number || "") ||
      address !== (user?.address || "")  // Check if address has changed
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setEmail(user.email || "");
      setPhone(user.phone_number || "");
      setAddress(user.address || "");  // Set address if available
    }
  }, [user]);

  useEffect(() => {
    checkIfChanged();
  }, [username, email, phone, address]);

  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePhoneChange = (event) => setPhone(event.target.value);
  const handleAddressChange = (event) => setAddress(event.target.value);  // Handle address change

  const handleSaveSettings = async () => {
    if (!isChanged) return;

    const userData = {
      id: user?.id,   // Get the user ID
      username,
      email,
      phone: phone,
      address,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/putUser/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      if (response.ok) {
        // Show success toast notification
        toast.success("Хэрэглэгчийн мэдээлэл амжилттай өөрчлөгдлөө");
        setIsChanged(false);
      } else {
        console.error("Error updating user:", result.error);
      }
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mb={2}>
        <Typography variant="h6">Хэрэглэгчийн тохиргоо</Typography>
        <TextField
          label="Нэр"
          value={username}
          onChange={handleUsernameChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="И-мейл"
          value={email}
          onChange={handleEmailChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Утасны дугаар"
          value={phone}
          onChange={handlePhoneChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Хаяг"
          value={address}
          onChange={handleAddressChange}  // Address input field
          fullWidth
          margin="normal"
        />
      </Box>

      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSaveSettings}
          disabled={!isChanged}
        >
          Хадгалах
        </Button>
      </Box>

      {/* ToastContainer is required to show the toasts */}
      <ToastContainer />
    </Container>
  );
};

export default UserSettings;
