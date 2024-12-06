import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Grid,
  Tabs,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Menu as MenuIcon,
  Book,
  ShoppingBag,
  Person,
} from "@mui/icons-material";
import Tab from "@mui/material/Tab";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { toast } from "react-toastify"; // Import toast

const Header = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null); // For the dropdown menu
  const navigate = useNavigate();

  const { user, logout } = useUser();
  const { cartItems } = useCart();

  const getTabValue = () => {
    switch (location.pathname) {
      case "/books":
        return "2";
      case "/top":
        return "3";
      default:
        return "1"; // Default to home page
    }
  };
  const [value, setValue] = useState(getTabValue);
  // Tab сонголт өөрчлөгдөх үед утга шинэчлэх функц
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu on icon click
  };

  const handleMenuClose = () => {
    setAnchorEl(null); // Close the menu
  };

  const handleLogout = () => {
    // Add your logout logic here
    logout();
    toast.success("Successfully logged out!");
    handleMenuClose();
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
                  <MenuIcon />
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
                  ml: 8,
                  fontSize: "2.5rem",
                  color: "#000",
                }}
                onClick={() => {
                  if (user) {
                    navigate("/cart");
                  } else {
                    toast.error("Нэвтэрэх шаардлагатай");
                  }
                }}
              >
                <ShoppingBag />
                {cartItems > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "red",
                      color: "white",
                      borderRadius: "50%",
                      width: "15px",
                      height: "15px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: "12px",
                    }}
                  >
                    {cartItems}
                  </Box>
                )}
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
                onClick={handleMenuClick} // Open dropdown menu on click
              >
                <Person />
              </IconButton>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)} // Menu is open if there's an anchor element
                onClose={handleMenuClose}
              >
                {user ? (
                  <>
                    <MenuItem onClick={() => navigate("/settings")}>
                      Тохиргоо
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Гарах</MenuItem>
                  </>
                ) : (
                  <MenuItem onClick={() => navigate("/login")}>
                    Нэвтрэх
                  </MenuItem>
                )}
              </Menu>
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
