import React, { useState, useEffect } from "react";
import { Box, Typography, Slider, Chip, Divider, CircularProgress } from "@mui/material";
import axios from "axios"; // axios-г импортлоод API хүсэлт хийхэд ашиглана.

const FilterSidebar = ({ filters, onFilterChange }) => {
  const [priceRange, setPriceRange] = useState([5000, 500000]); // Үнэ хязгаарын тохиргоо, анх 5000-500000₮
  const [rating, setRating] = useState(0); // Үнэлгээний тохиргоо
  const [selectedCategories, setSelectedCategories] = useState([]); // Сонгосон төрлүүдийн жагсаалт
  const [selectedAuthors, setSelectedAuthors] = useState([]); // Сонгосон зохиолчдын жагсаалт
  const [categories, setCategories] = useState([]); // Категориудыг хадгалах хувьсагч
  const [authors, setAuthors] = useState([]); // Зохиолчдыг хадгалах хувьсагч
  const [loading, setLoading] = useState(true);  // API хүсэлт хийх үед лоадингийн төлөв

  // API-с категория болон зохиолчдыг татах функц
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:5000/categories/"); 
        setCategories(response.data?.categories); // Категориудыг тохирох хувьсагчид хадгална.
        setAuthors(response.data?.authors); // Зохиолчдыг тохирох хувьсагчид хадгална.
        setLoading(false);  // Өгөгдлийг амжилттай татсан тул лоадингийг дуусгав.
      } catch (error) {
        console.error("Error fetching categories:", error); // Алдааг дэлгэцэнд хэвлэх
        setLoading(false);  // Алдаа гарсан ч лоадингийг дуусгав.
      }
    };

    fetchCategories(); // Категори болон зохиолчдын өгөгдлийг татах
  }, []);

  // Үнэ хязгаарыг өөрчлөх функц
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue); // Үнэ хязгаарыг шинэчилнэ
    onFilterChange({ ...filters, priceRange: newValue }); // Фильтрийн сонголтыг өөрчлөн дамжуулна.
  };

  // Категори сонгох/солоох функц
  const handleCategoryToggle = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category) // Хэрэв сонгогдсон бол хасна
      : [...selectedCategories, category]; // Сонгоогүй бол нэмнэ

    setSelectedCategories(updatedCategories); // Сонгосон категориудыг шинэчилнэ
    onFilterChange({ ...filters, category: updatedCategories.map((item) => item.id) }); // Фильтрэд шинэ тохиргоог дамжуулна
  };

  // Зохиолч сонгох/солоох функц
  const handleAuthorToggle = (author) => {
    const updatedAuthors = selectedAuthors.includes(author)
      ? selectedAuthors.filter((item) => item !== author) // Хэрэв сонгогдсон бол хасна
      : [...selectedAuthors, author]; // Сонгоогүй бол нэмнэ

    setSelectedAuthors(updatedAuthors); // Сонгосон зохиолчдыг шинэчилнэ
    onFilterChange({ ...filters, author: updatedAuthors }); // Фильтрэд шинэ тохиргоог дамжуулна
  };

  return (
    <Box sx={{ width: 250, padding: 2, borderRight: "1px solid #ddd" }}>
      {/* Өгөгдлийг татаж байх үед лоадинг spinner-г харуулах */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress /> {/* Лоадингийн эргэлт */}
        </Box>
      ) : (
        <>
          {/* Сонгосон фильтруудын дэлгэц */}
          <Box sx={{ marginBottom: 2 }}>
            <Typography variant="subtitle1">Сонгосон</Typography>
            {/* Сонгосон категориудыг харуулах */}
            {selectedCategories.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1}>
                {selectedCategories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onDelete={() => handleCategoryToggle(category)} // Устгах товч
                    color="primary"
                  />
                ))}
              </Box>
            )}
            {/* Сонгосон зохиолчдыг харуулах */}
            {selectedAuthors.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={1} sx={{ marginTop: 1 }}>
                {selectedAuthors.map((author) => (
                  <Chip
                    key={author}
                    label={author}
                    onDelete={() => handleAuthorToggle(author)} // Устгах товч
                    color="primary"
                  />
                ))}
              </Box>
            )}
            {/* Үнэлгээ сонгосон бол харуулах */}
            {rating > 0 && (
              <Chip
                label={`${rating} Star${rating > 1 ? "s" : ""}`}
                onDelete={() => setRating(0)} // Үнэлгээг устгах
                color="primary"
                sx={{ marginTop: 1 }}
              />
            )}
          </Box>

          <Divider sx={{ marginBottom: 2 }} />

          {/* Категори сонгох хэсэг */}
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Төрөл
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {categories.map((category) => (
              <Chip
                key={category.id}
                label={category.name}
                onClick={() => handleCategoryToggle(category)} // Категорийг сонгох
                color={selectedCategories.includes(category.id) ? "primary" : "default"}
                variant={selectedCategories.includes(category.id) ? "filled" : "outlined"}
              />
            ))}
          </Box>

          <Divider sx={{ margin: "16px 0" }} />

          {/* Зохиолч сонгох хэсэг */}
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Зохиолч
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {authors.map((author) => (
              <Chip
                key={author}
                label={author}
                onClick={() => handleAuthorToggle(author)} // Зохиолчийг сонгох
                color={selectedAuthors.includes(author) ? "primary" : "default"}
                variant={selectedAuthors.includes(author) ? "filled" : "outlined"}
              />
            ))}
          </Box>

          <Divider sx={{ margin: "16px 0" }} />

          {/* Үнэ тохируулах хэсэг */}
          <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
            Үнэ
          </Typography>
          <Slider
            value={priceRange}
            onChange={handlePriceChange} // Үнэ сонголтыг шинэчлэх
            valueLabelDisplay="auto"
            valueLabelFormatter={(value) => `₮${value}`} // Үнэ харуулах формат
            min={5000} // Минимум үнэ
            max={500000} // Хамгийн их үнэ
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
