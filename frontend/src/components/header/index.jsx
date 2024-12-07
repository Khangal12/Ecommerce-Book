import React, { useState, useEffect } from "react";
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
  Avatar,
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
import axios from "axios";

const Header = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null); // For the dropdown menu
  const [searchQuery, setSearchQuery] = useState(""); // For managing the search input
  const [searchResults, setSearchResults] = useState([]); // For storing search results
  const [loading, setLoading] = useState(false); // For loading state
  const navigate = useNavigate();

  const { user, logout } = useUser();
  const { cartItems } = useCart();

  const getTabValue = () => {
    switch (location.pathname) {
      case "/books":
        return "2";
      case "/":
        return "1";
      case "/orders":
        return "3";
      default:
        return "1"; // Default to home page
    }
  };

  const [value, setValue] = useState(getTabValue);

  // Handle tab change
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handle menu actions
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget); // Open the menu on icon click
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out!");
    handleMenuClose();
  };

  // Fetch search results from API when the query changes
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/search?q=${searchQuery}`
        ); // Adjust your API endpoint
        setSearchResults(response.data); // Set the results from API
      } catch (error) {
        toast.error("Error fetching search results");
      } finally {
        setLoading(false);
      }
    };

    // Call the search API on query change
    const timeoutId = setTimeout(fetchSearchResults, 500); // Debouncing to avoid too many requests
    return () => clearTimeout(timeoutId); // Cleanup timeout on component unmount or searchQuery change
  }, [searchQuery]);

  const handleNavigate = (book) => {
    setSearchQuery("");
    navigate(`/books/${book.id}`, { state: { book: book } });
  };

  return (
    <Box sx={{ paddingBottom: 2 }}>
      {/* AppBar */}
      <AppBar position="static" color="transparent" sx={{ px: 6 }}>
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            {/* Logo */}
            <Grid item xs={3}>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: "bold" }}
              >
                E-Book
              </Typography>
            </Grid>

            {/* Search Bar */}
            <Grid item xs={7} sx={{ position: "relative", marginTop: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "50px",
                  padding: "8px 12px",

                  width: "100%",
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", // Light shadow for depth
                }}
              >
                <IconButton
                  sx={{
                    paddingX: 2,
                    fontSize: "1.8rem",
                    color: "#000",
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <InputBase
                  placeholder="Ном хайх"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{
                    flex: 1,
                    ml: 1,
                    fontSize: "1rem",
                    padding: "8px", // Padding inside the input field
                    borderRadius: "30px", // Soft rounded corners
                    backgroundColor: "#fff", // White background for the input field
                    transition: "background-color 0.3s ease", // Smooth transition for focus effect
                    "&:focus": {
                      backgroundColor: "#f0f0f0", // Slightly darker background on focus
                    },
                  }}
                />
                <IconButton sx={{ fontSize: "1.8rem", color: "#000" }}>
                  <Search />
                </IconButton>
              </Box>

              {/* Display search results */}
              {!loading && searchResults.length > 0 && (
                <Box
                  sx={{
                    mt: 2,
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: 2,
                    maxHeight: "300px", // Add max height to avoid large overflow
                    overflowY: "auto",
                    position: "absolute",
                    top: "100%", // Position the results below the search bar
                    width: "100%", // Ensure results take up the full width of the search bar
                    zIndex: 200, // Make results scrollable and above other elements
                  }}
                >
                  {searchResults.map((result) => (
                    <Box
                      key={result.id}
                      sx={{
                        display: "flex",
                        padding: "12px",
                        borderBottom: "1px solid #ddd",
                        "&:hover": {
                          backgroundColor: "#f9f9f9", // Hover effect for better interactivity
                        },
                      }}
                      onClick={() => handleNavigate(result)}
                    >
                      <Avatar
                        src={
                          result.image_url || "path_to_placeholder_image.jpg"
                        } // Fallback to a placeholder if no image URL is present
                        alt={result.title}
                        sx={{
                          width: 80, // Set fixed width for the avatar
                          height: 70, // Set fixed height for the avatar
                          marginRight: "12px", // Space between image and text
                        }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                            marginBottom: "4px",
                          }}
                        >
                          {result.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#888" }}>
                          {result.author}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}
            </Grid>

            {/* Cart */}
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

            {/* User */}
            <Grid item xs={1} sx={{ textAlign: "right" }}>
              <IconButton
                sx={{
                  fontSize: "2.5rem",
                  color: "#000",
                  borderRadius: "50%",
                }}
                onClick={handleMenuClick}
              >
                <Person />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
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

      {/* Navigation Tabs */}
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
              fontWeight: value === "1" ? "bold" : "normal",
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
              fontWeight: value === "2" ? "bold" : "normal",
            }}
          />
          <Tab
            component={Link}
            to="/orders"
            icon={<Person />}
            label="Захиалга"
            value="3"
            sx={{
              textTransform: "none",
              flex: 1,
              textAlign: "center",
              fontWeight: value === "3" ? "bold" : "normal",
            }}
          />
        </Tabs>
      </Box>
    </Box>
  );
};

export default Header;
