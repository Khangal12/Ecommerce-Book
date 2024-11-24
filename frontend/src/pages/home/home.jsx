// src/pages/HomePage.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Header from '../../header/header';
import TopBooks from '../top/topBook';
const HomePage = () => {
    return (
        <div>
         
            <Header/>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
            }}>
                <TopBooks/>
            </Box>
        </div>
    );
};

export default HomePage;
