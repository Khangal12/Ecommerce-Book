import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Grid,
  Tabs,
} from "@mui/material";
import { Search, Menu, Book, ShoppingBag, Person } from "@mui/icons-material";
import Tab from "@mui/material/Tab";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";

const Header = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ paddingBottom: 2 }}>
      {/* AppBar Header */}
      <AppBar position="static" color="transparent" sx={{ px: 6 }}>
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={3}>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                E-Book
              </Typography>
            </Grid>
            <Grid item xs={7}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "#dadbe0",
                  borderRadius: "50px",
                  padding: "2px 12px",
                  width: "100%",
                }}
              >
                <IconButton
                  sx={{
                    paddingX: 5,
                    fontSize: "2.5rem",
                    color: "#000",
                  }}
                >
                  <Menu />
                </IconButton>
                <InputBase
                  placeholder="Хайх үг оруулна уу"
                  sx={{ flex: 1, ml: 1 }}
                />
                <IconButton sx={{ fontSize: "2rem" }}>
                  <Search />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                sx={{
                  paddingX: 5,
                  fontSize: "2.5rem",
                  color: "#000",
                }}
              >
                <ShoppingBag />
              </IconButton>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: "right" }}>
              <IconButton
                sx={{
                  fontSize: "2.5rem",
                  color: "#000",
                  borderRadius: "50%",
                }}
              >
                <Person />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          aria-label="Navigation Tabs"
          TabIndicatorProps={{ style: { backgroundColor: "#000" } }}
        >
          <Tab
            component={Link}
            to="/"
            icon={<Book />}
            label="Нүүр"
            value="1"
            sx={{
              textTransform: "none",
              flex: 1,
              textAlign: "center",
              fontWeight: value === "1" ? "bold" : "normal", // Bold text for active tab
              transition: "color 0.3s, font-weight 0.3s", // Smooth transition
            }}
          />
          <Tab
            component={Link}
            to="/books"
            icon={<Book />}
            label="Ном"
            value="2"
            sx={{
              textTransform: "none",
              flex: 1,
              textAlign: "center",
              fontWeight: value === "2" ? "bold" : "normal", // Bold text for active tab
              transition: "color 0.3s, font-weight 0.3s", // Smooth transition
            }}
          />
          <Tab
            component={Link}
            to="/top"
            icon={<Person />}
            label="Шилдэг"
            value="3"
            sx={{
              textTransform: "none",
              flex: 1,
              textAlign: "center",
              fontWeight: value === "3" ? "bold" : "normal", // Bold text for active tab
              transition: "color 0.3s, font-weight 0.3s", // Smooth transition
            }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default Header;
