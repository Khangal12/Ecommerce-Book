import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import Header from '../../header/header';
import axios from 'axios';
import useApi from '../../useApi';
const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const {apiCallWithToast , loading} = useApi()
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/books/',{
                    method:'GET'
                });
                setBooks(response.data?.books); 
                console.log(response.data)
            } catch (error) {
                console.error('Error fetching books:', error);
                setError('Error fetching books');
            }
        };

        fetchBooks();
    }, []); 

    return (
        <div>
            <Header />
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
            }}>
                {error && <Typography color="error">{error}</Typography>}
                <Grid container spacing={3} justifyContent="center">
                    {books.map((book) => (
                        <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
                            <Card sx={{ maxWidth: 345 }}>
                                {book.image_url && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={book.image_url} 
                                        alt={book.title}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" component="div">
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {book.author}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        Price: ${book.price}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {book.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </div>
    );
};

export default HomePage;
