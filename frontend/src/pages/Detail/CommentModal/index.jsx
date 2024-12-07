import React, { useState } from "react"; 
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  Rating, 
  Box 
} from "@mui/material";

// Энэ модал нь номын сэтгэгдэл болон үнэлгээ бичих боломжийг хэрэглэгчдэд олгодог.
const CommentModal = ({ open, handleModal, bookId, refresh, user }) => {

  const [comment, setComment] = useState(""); // Сэтгэгдлийг хадгалах
  const [rating, setRating] = useState(0); // Үнэлгээг хадгалах
  const [loading, setLoading] = useState(false); // Уншиж буй мэдээллийг харуулах
  const [error, setError] = useState(""); // Алдааг хадгалах

  // Сэтгэгдлийг хадгалах функц
  const handleSave = async () => {
    if (rating === 0) {
      setError("Үнэлгээ өгнө үү!"); // Үнэлгээ сонгоогүй бол анхааруулга
      return; // Хэрэв үнэлгээ 0 байвал хадгалалтыг үргэлжлүүлэхгүй
    }
    setLoading(true); // Татаж авах үед байршлыг идэвхжүүлнэ
    setError(""); // Алдааг цэвэрлэнэ

    try {
      // Сэтгэгдэл, үнэлгээ болон номын ID-г сервер рүү илгээх
      const response = await fetch("http://127.0.0.1:5000/review", {
        method: "POST", // HTTP POST хүсэлт
        headers: {
          "Content-Type": "application/json", // JSON форматын хүсэлт
        },
        // ирж буй датаг хадгалах
        body: JSON.stringify({
          book_id: bookId, // Номын ID
          rating: rating, // Үнэлгээ
          comment: comment, // Сэтгэгдэл
          user_id: user.id, // Хэрэглэгчийн ID
        }),
      });

      const data = await response.json(); // Серверээс ирсэн хариуг авна

      // Хэрэв серверээс хариу амжилттай ирсэн бол
      if (response.ok) {
        refresh(); // Номын сэтгэгдлийг дахин ачаална
        handleModal(); // Модалыг хаана
      } else {
        // Амжилтгүй бол алдааг харуулна
        setError(data.error || "Сэтгэгдэл хадгалахад алдаа гарлаа");
      }
    } catch (error) {
      // Хэрэв сервер рүү хүсэлт хийхэд алдаа гарвал
      setError("Сэтгэгдэл хадгалахад алдаа гарлаа.");
    } finally {
      // Хүсэлт дууссаны дараа байршлыг унтраана
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleModal} maxWidth="md" fullWidth>
      <DialogTitle>Сэтгэгдэл бичих</DialogTitle> 
      <DialogContent>
        {/* Хэрэв алдаа гарвал, алдааг дэлгэцэнд харуулах */}
        {error && <Box sx={{ color: "red", marginBottom: 2 }}>{error}</Box>}

        {/* Үнэлгээний хэсэг */}
        <Box sx={{ marginBottom: 2 }}>
          <Rating
            name="rating"
            value={rating} // Үнэлгээг харуулна
            onChange={(event, newValue) => setRating(newValue)} // Үнэлгээ сонгох үед хадгална
            precision={0.5} // 0.5 одоор үнэлгээ өгнө
            size="large" // Үндсэн хэмжээ томоор гарна
          />
        </Box>

        {/* Сэтгэгдэл бичих хэсэг */}
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
        {/* Модал хаах товч */}
        <Button
          onClick={handleModal}
          sx={{
            color: "black", 
            border: "1px solid white", 
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: "darkgrey",
            },
          }}
        >
          Хаах
        </Button>

        {/* Сэтгэгдэл хадгалах товч */}
        <Button
          onClick={handleSave}
          disabled={loading}
          sx={{
            backgroundColor: "black", 
            color: "white", 
            "&:hover": {
              backgroundColor: "darkgrey", 
            },
          }}
        >
          {loading ? "Хадгалаж байна..." : "Хадгалах"} {/* Хэрэв хадгалж байгаа бол, "Хадгалаж байна..." гэж бичнэ */}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CommentModal;
