import React, { useState, useEffect } from "react";
import FilterSidebar from "../../components/Sidebar";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
const ECommercePage = () => {
  const [filters, setFilters] = useState({
    author: [],
    category: [],
    priceRange: [],
  });
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [books, setBooks] = useState([]); // Initialize as an empty array
  const [totalPages, setTotalPages] = useState(0); // Store total pages
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true); // Set loading state to true when the fetch starts
      try {
        const params = new URLSearchParams({
          ...filters,
          page: currentPage,
          limit: 9,
        });
        const response = await fetch(
          `http://127.0.0.1:5000/books?${params.toString()}`
        );

        // Check if the response was successful
        if (response.ok) {
          const data = await response.json(); // Parse JSON response
          setBooks(data.books || []); // Ensure books is an array
          setTotalPages(data.totalPages || 0); // Set the total pages value
        } else {
          console.error("Failed to fetch books");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setIsLoading(false); // Set loading state to false after the fetch is complete
      }
    };

    fetchBooks();
  }, [filters, currentPage]);

  const handleCardClick = (product) => {
    navigate(`/books/${product.id}`, { state: { book: product } });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", gap: 10 }}>
      <Box sx={{ width: 250, padding: 2 }}>
        <FilterSidebar filters={filters} onFilterChange={handleFilterChange} />
      </Box>

      <Box sx={{ flex: 1, marginTop: 3 }}>
        {/* Show loading spinner while books are loading */}
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={2}>
              {books.length === 0 ? (
                <Typography variant="body1">No books available</Typography>
              ) : (
                books.map((product) => (
                  <Grid item xs={12} sm={6} md={4} key={product.id}>
                    <Card
                      onClick={() => handleCardClick(product)}
                      sx={{ cursor: "pointer" }}
                    >
                      <CardMedia
                        component="img"
                        height="300"
                        image={product.image_url}
                        alt={product.title}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography
                          variant="body1"
                          sx={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                          }}
                        >
                          {product.title}
                        </Typography>
                        <Typography variant="caption">
                          {product.author}
                        </Typography>
                        <Typography
                          variant="body5"
                          sx={{
                            display: "block",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "100%",
                            marginTop: 1,
                          }}
                        >
                          ₮{product.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
            <Box
              sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}
            >
              <Pagination
                count={totalPages} // Use totalPages from backend response
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: 2 }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default ECommercePage;
