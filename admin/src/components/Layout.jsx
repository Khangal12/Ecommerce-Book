import React from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";

const drawerWidth = 200; // Adjust drawer width if needed

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${drawerWidth}px)`,
          ml: `${drawerWidth}px`,
          bgcolor: "#1976d2",
        }}
      >
        <Toolbar>
          <IconButton
            aria-label="open drawer"
            edge="end"
            sx={{ display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Sidebar sx={{ width: drawerWidth }} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 5,
          marginLeft: `${drawerWidth}px`,
        }}
      >
        <Toolbar />
        <Outlet /> {/* Render nested routes */}
      </Box>
    </Box>
  );
}
