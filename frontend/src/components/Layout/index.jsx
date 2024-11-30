import React from "react";
import { Outlet } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material";
import Header from "../header";
const AppLayout = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header/>
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet /> {/* Renders child routes */}
      </Container>
      <Box
        component="footer"
        sx={{
          backgroundColor: "#f5f5f5",
          textAlign: "center",
          padding: "10px",
          mt: "auto",
        }}
      >
        <Typography variant="body2" color="textSecondary" sx={{ margin: 0 }}>
          © 2024 E-Book. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout;
