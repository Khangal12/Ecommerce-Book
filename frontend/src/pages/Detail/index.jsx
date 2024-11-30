import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Divider,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import PurchaseCard from "../../components/PurchaseCard";
const Detail = () => {
  const location = useLocation();
  const book = location.state?.book;
  console.log(book);
  const [expanded, setExpanded] = useState(false);
  const recommendations = [
    {
      title: "Хол биш",
      price: 20000,
      image: "recommendation_image_url",
      author: "Ганжадвын Чадраабал",
    },
    {
      title: "Хол биш",
      price: 20000,
      image: "recommendation_image_url",
      author: "Ганжадвын Чадраабал",
    },
    {
      title: "Хол биш",
      price: 20000,
      image: "recommendation_image_url",
      author: "Ганжадвын Чадраабал",
    },
  ];

  const reviews = [
    {
      title: "Amazing book",
      body: "Loved every bit of it",
      reviewer: "User1",
      date: "2024-11-27",
    },
    {
      title: "Good read",
      body: "Quite interesting",
      reviewer: "User2",
      date: "2024-11-26",
    },
    {
      title: "Not bad",
      body: "Decent storyline",
      reviewer: "User3",
      date: "2024-11-25",
    },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <CardMedia
            component="img"
            height="400"
            image={book?.image_url || "placeholder_image_url"}
            alt={book?.title || "Book image"}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h3" gutterBottom>
            {book?.title || "Араатан"}
          </Typography>
          <Divider />
          <Typography variant="h6">
            {book?.author || "Кармен Мола"} (Зохиолч)
          </Typography>
          <Typography
            variant="body2"
            sx={{
              height: expanded ? "auto" : "18em", // Adjust the height for preview
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: expanded && "none", // Limit to 3 lines in preview mode
              WebkitBoxOrient: "vertical",
              marginTop: 2,
            }}
          >
            {book?.description ||
              "Нобелийн уран зохиолын шагнал 11 сая швед кроны эзэн болсон триллер зохиол."}
          </Typography>
          <Button
            onClick={() => setExpanded(!expanded)}
            size="small"
          >
            {expanded ? "Read Less" : "Read More"}
          </Button>
        </Grid>

        <Grid item xs={12} sm={4}>
        <PurchaseCard price={book.price} stock={book.stock_quantity}/>
      </Grid>
      </Grid>

      {/* Recommendations Section */}
      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
        Санал болгох
      </Typography>
      <Grid container spacing={2}>
        {recommendations.map((rec, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={rec.image}
                alt={rec.title}
              />
              <CardContent>
                <Typography variant="h6">{rec.title}</Typography>
                <Typography variant="body2">{rec.author}</Typography>
                <Typography variant="body1">₮{rec.price}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Reviews Section */}
      <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
        Санал хүсэлт
      </Typography>
      <Grid container spacing={2}>
        {reviews.map((review, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{review.title}</Typography>
                <Typography variant="body2">{review.body}</Typography>
                <Typography variant="caption">
                  {review.reviewer} - {review.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Review Submission */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" sx={{ marginBottom: 2 }}>
          Санал өгөх
        </Typography>
        <TextField
          fullWidth
          label="Review Title"
          sx={{ marginBottom: 2 }}
          variant="outlined"
        />
        <TextField
          fullWidth
          label="Review Body"
          multiline
          rows={4}
          sx={{ marginBottom: 2 }}
          variant="outlined"
        />
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </Box>
    </Box>
  );
};

export default Detail;
