import React from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid } from "@mui/material";
import Book from '../assets/book.png';

const TopBooks = () => {
  const books = [
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      description: "A novel about the American dream and the disillusionment of society in the 1920s.",
      imageUrl: Book,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h5" component="div" sx={{ fontWeight: "bold", marginBottom: "20px" }}>
        Book Name
      </Typography>

      <Grid container spacing={2}>
        {books.map((book, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
              <CardMedia
                component="img"
                alt={book.title}
                height="250"
                image={book.imageUrl}
                sx={{ objectFit: "cover", width: "150px" }}
              />
              <CardContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingLeft: "16px" }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {book.author}
                </Typography>
                <Typography variant="body2" sx={{ marginTop: "10px" }}>
                  {book.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TopBooks;
