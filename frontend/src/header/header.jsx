import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  IconButton,
  Box,
  Grid,
  Tabs
} from "@mui/material";
import { Search, Menu, Book, ShoppingBag, Person } from "@mui/icons-material";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Tab from "@mui/material/Tab";

const Header = () => {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{paddingBottom:2}} >
      <AppBar
        position="static"
        color="#fff"
        sx={{  px: 4 }}
      >
        <Toolbar>
          <Grid container alignItems="center" spacing={2}>
            <Grid item xs={3}>
              <Typography variant="h4" component="div" sx={{ fontWeight: "bold" }}>
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
                    paddingX:5,
                    fontSize: 45,
                    color: "#000",
                    
                  }}>
                  <Menu />
                </IconButton>
                <InputBase
                  placeholder="Хайх үг оруулна уу"
                  sx={{ flex: 1, ml: 1}}
                />
                <IconButton>
                  <Search />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                sx={{
                  paddingX:5,
                  fontSize: 45,
                  color: "#000",
                  
                }}
              >
                <ShoppingBag />
              </IconButton>
            </Grid>
            <Grid item xs={1} sx={{ textAlign: "right" }}>
          
              <IconButton
                sx={{
                  fontSize: 45,
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

      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
       
      <Tabs value={value} onChange={handleChange} centered>
            <Tab
              icon={<Book />}
              label="Ном"
              value="1"
              sx={{
                textTransform: "none",
                flex: 1,
                color: "#000",
                textAlign: "center",
              }}
            />
            <Tab
              icon={<Book />}
              label="Цахим Ном"
              value="2"
              sx={{
                textTransform: "none",
                flex: 1,
                color: "#000",
                textAlign: "center",
              }}
            />
            <Tab
              icon={<Person />}
              label="Шилдэг"
              value="3"
              sx={{
                textTransform: "none",
                flex: 1,
                color: "#000",
                textAlign: "center",
              }}
            />
          </Tabs>

          
        
      </Box>
    </Box>
  );
};

export default Header;
