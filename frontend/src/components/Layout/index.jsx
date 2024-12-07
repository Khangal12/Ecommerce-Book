import React from "react";
import { Outlet } from "react-router-dom"; 
import { AppBar, Toolbar, Typography, Box, Container } from "@mui/material"; 
import Header from "../header";

const AppLayout = () => {
  return (
    // Layout-ийн үндсэн контейнер, бүх элементийг багтаах
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      
      
      <Header/>

   
      <Container component="main" sx={{ flexGrow: 1, py: 3 }}>
        <Outlet />
      </Container>

      {/* Футер хэсэг */}
      <Box
        component="footer"
        sx={{
          backgroundColor: "#f5f5f5", 
          textAlign: "center", 
          padding: "10px",
          mt: "auto",
        }}
      >
        {/* Хэвлэх эрхийн мэдээлэл */}
        <Typography variant="body2" color="textSecondary" sx={{ margin: 0 }}>
          © 2024 E-Book. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout;
