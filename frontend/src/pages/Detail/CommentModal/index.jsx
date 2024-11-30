import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Rating,
  Box,
} from "@mui/material";

const CommentModal = ({ open, handleModal, bookId,refresh, user }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0); // State to track the rating
  const [loading, setLoading] = useState(false); // State to track the loading state
  const [error, setError] = useState(""); // State to track any error during submission

  // Function to save the comment and rating
  const handleSave = async () => {
    if (rating === 0) {
      setError("Please select a rating before submitting.");
      return;
    }
    setLoading(true);
    setError(""); // Reset error message

    try {
      // Send the comment and rating to the backend
      const response = await fetch("http://127.0.0.1:5000/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          book_id: bookId,
          rating: rating,
          comment: comment,
          user_id: user.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        refresh();
        handleModal(); // Close the modal after saving
      } else {
        setError(data.error || "Failed to save comment");
      }
    } catch (error) {
      setError("An error occurred while saving the comment.");
    } finally {
      setLoading(false); // Set loading to false once the request is finished
    }
  };

  return (
    <Dialog open={open} onClose={handleModal} maxWidth="md" fullWidth>
      <DialogTitle>Сэтгэгдэл бичих</DialogTitle>
      <DialogContent>
        {/* Display error if there is one */}
        {error && <Box sx={{ color: "red", marginBottom: 2 }}>{error}</Box>}

        {/* Star Rating */}
        <Box sx={{ marginBottom: 2 }}>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)} // Update rating
            precision={0.5} // Allow half-star ratings
            size="large" // Larger star size
          />
        </Box>

        {/* Comment Input */}
        <TextField
          autoFocus
          multiline
          rows={4}
          fullWidth
          variant="outlined"
          label="Таны сэтгэгдэл"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
      </DialogContent>
      <DialogActions sx={{ gap: 3 }}>
        <Button
          onClick={handleModal}
          sx={{
            color: "black", // White text color
            border: "1px solid white", // White border
            backgroundColor: "transparent", // Transparent background
            "&:hover": {
              backgroundColor: "darkgrey", // Black background on hover
            },
          }}
        >
          Хаах
        </Button>

        <Button
          onClick={handleSave}
          disabled={loading} // Disable button while loading
          sx={{
            backgroundColor: "black", // Black background
            color: "white", // White text color
            "&:hover": {
              backgroundColor: "darkgrey",
            },
          }}
        >
          {loading ? "Хадгалаж байна..." : "Хадгалах"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;
