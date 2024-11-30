import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardMedia,
  CardContent,
  Divider,
  CircularProgress,
  Rating,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import PurchaseCard from "../../components/PurchaseCard";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IconButton from "@mui/material/IconButton";
import CommentModal from "./CommentModal";
import { useUser } from "../../context/UserContext";
import WarningModal from "../../components/WarningModal";

const Detail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const book = location.state?.book;
  const textRef = useRef(null);
  const { user } = useUser();

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [modal, setModal] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  const commentsRef = useRef(null); // Reference for the reviews container

  const navigateDetail = (book) => {
    setRecommendations([]);
    setLoadingRecommendations(true);
    navigate(`/books/${book.id}`, { state: { book: book } });
  };

  function handleModal() {
	if(user){
		setModal(!modal);
	}
    else {
		setWarningOpen(true);
	}
  }

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/review/${book.id}/`);
      const data = await response.json();

      if (data.status === "success") {
        setComments(data.reviews); // Update recommendations state
      } else {
        console.error("Error from API:", data.status);
      }
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setLoadingComments(false); // Ensure loading state is updated
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/recommendations/${book.id}/`
        );
        const data = await response.json();

        if (data.status === "success") {
          setRecommendations(data.book); // Update recommendations state
        } else {
          console.error("Error from API:", data.message);
        }
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoadingRecommendations(false); // Ensure loading state is updated
      }
    };

    if (book) {
      fetchRecommendations();
      fetchComments();
    }
  }, [book]);

  useEffect(() => {
    const checkOverflow = () => {
      if (textRef.current) {
        setIsOverflowing(
          textRef.current.scrollHeight > textRef.current.clientHeight
        );
      }
    };

    checkOverflow(); // Check initially
    window.addEventListener("resize", checkOverflow); // Recheck on window resize

    return () => {
      window.removeEventListener("resize", checkOverflow); // Clean up on unmount
    };
  }, [book.description]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString();
  };

  const scrollTo = (direction) => {
    const container = commentsRef.current;
    if (container) {
      const scrollAmount = direction === "next" ? 300 : -300; // Define the scroll amount per button click
      container.scrollBy({
        left: scrollAmount,
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

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
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              maxHeight: "4em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              "&:hover": {
                maxHeight: "none",
                overflow: "visible",
                WebkitLineClamp: "none",
              },
            }}
          >
            {book?.title || "Араатан"}
          </Typography>
          <Divider />
          <Typography variant="h6">
            {book?.author || "Кармен Мола"} (Зохиолч)
          </Typography>
          <Typography
            ref={textRef}
            variant="body2"
            sx={{
              height: expanded ? "auto" : "18em",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: expanded && "none",
              WebkitBoxOrient: "vertical",
              marginTop: 2,
            }}
          >
            {book?.description ||
              "Нобелийн уран зохиолын шагнал 11 сая швед кроны эзэн болсон триллер зохиол."}
          </Typography>
          {isOverflowing && (
            <Button onClick={() => setExpanded(!expanded)} size="small">
              {expanded ? "Read Less" : "Read More"}
            </Button>
          )}
        </Grid>

        <Grid item xs={12} sm={4}>
          <PurchaseCard price={book.price} stock={book.stock_quantity} bookId={book.id} />
        </Grid>
      </Grid>

      {/* Recommendations Section */}
      <Typography variant="h5" sx={{ marginTop: 5, marginBottom: 2 }}>
        Санал болгох
      </Typography>
      {loadingRecommendations ? (
        <CircularProgress />
      ) : (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 3,
            paddingBottom: 2,
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar
            },
          }}
        >
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              sx={{
                minWidth: 200,
                maxWidth: 200,
                flexShrink: 0,
                cursor: "pointer",
              }}
              onClick={() => navigateDetail(rec)}
            >
              <CardMedia
                component="img"
                height="200"
                image={rec.image_url || "placeholder_image_url"}
                alt={rec.title}
              />
              <CardContent>
                <Typography variant="h6">{rec.title}</Typography>
                <Typography variant="body2">{rec.author}</Typography>
                <Typography variant="body1">₮{rec.price}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Typography variant="h5" sx={{ marginTop: 4, marginBottom: 2 }}>
          Санал хүсэлт
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 2,
            justifyContent: "end",
            alignItems: "center",
          }}
        >
          {/* Previous Button */}
          <IconButton
            onClick={() => scrollTo("previous")}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "50%",
              padding: "1px",
              "&:hover": { backgroundColor: "darkgray" },
            }}
          >
            <ArrowBackIcon />
          </IconButton>

          {/* Next Button */}
          <IconButton
            onClick={() => scrollTo("next")}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: "50%",
              padding: "1px",
              "&:hover": { backgroundColor: "darkgray" },
            }}
          >
            <ArrowForwardIcon />
          </IconButton>
        </Box>
      </Box>

      {loadingComments ? (
        <CircularProgress />
      ) : comments.length === 0 ? (
        <Typography variant="body1" sx={{ marginTop: 2, color: "gray" }}>
          Одоогоор сэтгэгдэл байхгүй байна
        </Typography>
      ) : (
        <Box
          ref={commentsRef}
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            paddingBottom: 2,
            scrollBehavior: "smooth",
            "&::-webkit-scrollbar": {
              display: "none", // Hide scrollbar
            },
          }}
        >
          {comments.map((review, index) => (
            <Card
              key={index}
              sx={{ minWidth: 250, maxWidth: 250, flexShrink: 0 }}
            >
              <CardContent>
                <Box>
                  <Rating
                    name="rating"
                    value={review.rating}
                    readOnly
                    precision={0.5}
                    size="large"
                  />
                </Box>
                <Typography variant="body2">{review.comment}</Typography>
                <Typography variant="caption">
                  {review.user_name} - {formatDate(review.review_date)}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Box sx={{ textAlign: "end", marginTop: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: "50px",
            padding: "8px 20px",
            "&:hover": { backgroundColor: "darkgray" },
          }}
          onClick={handleModal}
        >
          Сэтгэгдэл өгөх
        </Button>
      </Box>
      {modal && (
        <CommentModal
          open={modal}
          handleModal={handleModal}
          bookId={book.id}
          refresh={fetchComments}
		  user={user}
        />
      )}
	  {
		warningOpen && (
			<WarningModal open={warningOpen} handleClose={()=>setWarningOpen(false)}/>
		)
	  }
    </Box>
  );
};

export default Detail;
