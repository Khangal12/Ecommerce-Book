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
  // "Ном" хуудас нь эхний хуудас байх ёстой гэдэг утга.
  const [value, setValue] = React.useState("2");

  // Tab сонголт өөрчлөгдөх үед утга шинэчлэх функц
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ paddingBottom: 2 }}>
      {/* AppBar - Дээд талын хэсэг */}
      <AppBar position="static" color="transparent" sx={{ px: 6 }}>
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            {/* Лого */}
            <Grid item xs={3}>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                E-Book
              </Typography>
            </Grid>

            {/* Хайлтын талбар */}
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

            {/* Багц */}
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

            {/* Хэрэглэгч */}
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

      {/* Навигацийн таб */}
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <Tabs
          value={value} // Хэвийн анхны таб нь "Ном"
          onChange={handleChange} // Табиудын дунд шилжих функц
          centered
          aria-label="Navigation Tabs"
          TabIndicatorProps={{ style: { backgroundColor: "#000" } }} // Далд индикаторын өнгө
        >
          {/* Нүүр таб */}
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
              fontWeight: value === "1" ? "bold" : "normal", // Идэвхтэй таб-ийг бүдүүн болгож харагдуулах
              transition: "color 0.3s, font-weight 0.3s", // Өнгө, үсгийн зузаан тайван өөрчлөгдөх
            }}
          />

          {/* Ном таб */}
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
              fontWeight: value === "2" ? "bold" : "normal", // Идэвхтэй таб-ийг бүдүүн болгож харагдуулах
              transition: "color 0.3s, font-weight 0.3s", // Өнгө, үсгийн зузаан тайван өөрчлөгдөх
            }}
          />

          {/* Шилдэг таб */}
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
              fontWeight: value === "3" ? "bold" : "normal", // Идэвхтэй таб-ийг бүдүүн болгож харагдуулах
              transition: "color 0.3s, font-weight 0.3s", // Өнгө, үсгийн зузаан тайван өөрчлөгдөх
            }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default Header;
