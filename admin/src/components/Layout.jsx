import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import CssBaseline from "@mui/material/CssBaseline";
import Sidebar from "./Sidebar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const drawerWidth = 200;

export default function Layout() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: `${drawerWidth}px 1fr`,
        gridTemplateRows: "auto 1fr",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          gridColumn: "1 / span 2",
          bgcolor: "white",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "end" }}>
          <Button
            aria-controls={open ? "user-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleMenuOpen}
          >
            <AccountCircleIcon sx={{ color: "black", fontSize: 30 }} />
          </Button>
          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "user-menu-button",
            }}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Sidebar sx={{ gridRow: "2", gridColumn: "1" }} />
      <Box
        component="main"
        sx={{
          gridRow: "2",
          gridColumn: "2",
          mt: 10,
          p: 5,
          overflowY: "auto",
        }}
      >
        <Outlet />
      </Box>
      <ToastContainer />
    </Box>
  );
}
