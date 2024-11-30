import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Chip, Divider, CircularProgress } from "@mui/material";
import axios from "axios"; // Import axios

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([5000, 500000]);
  const [rating, setRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [categories, setCategories] = useState([]); // State to store categories
  const [authors, setAuthors] = useState([]); // You can modify this to fetch authors from API as well if needed
  const [loading, setLoading] = useState(true);  // Loading state for API request

  // Fetch categories from the backend API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/categories/"); 
        setCategories(response.data?.categories); 
        setAuthors(response.data?.authors);
        setLoading(false);  // Set loading to false once the data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);  // Set loading to false even if there's an error
      }
    };

    fetchCategories();
  }, []);

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange({ ...filters, priceRange: newValue });
  };

  const handleCategoryToggle = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];

    setSelectedCategories(updatedCategories);
    onFilterChange({ ...filters, category: updatedCategories.map((item) => item.id) });
  };

  const handleAuthorToggle = (author) => {
    const updatedAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter((item) => item !== author)
      : [...selectedAuthors, author];

    setSelectedAuthors(updatedAuthors);
    onFilterChange({ ...filters, author: updatedAuthors });
  };

  return (
    <Box sx={{ width: 250, padding: 2, borderRight: "1px solid #ddd" }}>
      {/* Show a loading spinner if the data is still loading */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Filter summary */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1">Сонгосон</Typography>
            {selectedCategories.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onDelete={() => handleCategoryToggle(category)}
                    color="primary"
                  />
                ))}
              </Box>
            )}
            {selectedAuthors.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ marginTop: 1 }}>
                {selectedAuthors.map((author) => (
                  <Chip
                    key={author}
                    label={author}
                    onDelete={() => handleAuthorToggle(author)}
                    color="primary"
                  />
                ))}
              </Box>
            )}
            {rating > 0 && (
              <Chip
                label={`${rating} Star${rating > 1 ? "s" : ""}`}
                onDelete={() => setRating(0)}
                color="primary"
                sx={{ marginTop: 1 }}
              />
            )}
          </Box>

          <Divider sx={{ marginBottom: 2 }} />

          {/* Category Filter */}
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Төрөл
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => handleCategoryToggle(category)}
                color={selectedCategories.includes(category.id) ? "primary" : "default"}
                variant={selectedCategories.includes(category.id) ? "filled" : "outlined"}
              />
            ))}
          </Box>

          <Divider sx={{ margin: "16px 0" }} />

          {/* Author Filter */}
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Зохиолч
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {authors.map((author) => (
              <Chip
                key={author}
                label={author}
                onClick={() => handleAuthorToggle(author)}
                color={selectedAuthors.includes(author) ? "primary" : "default"}
                variant={selectedAuthors.includes(author) ? "filled" : "outlined"}
              />
            ))}
          </Box>

          <Divider sx={{ margin: "16px 0" }} />

          {/* Price Range Slider */}
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Үнэ
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormatter={(value) => `₮${value}`}
            min={5000}
            max={500000}
            sx={{ marginBottom: 2 }}
          />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">Min: ₮{priceRange[0]}</Typography>
            <Typography variant="body2">Max: ₮{priceRange[1]}</Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default FilterSidebar;
