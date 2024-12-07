import React, { useEffect, useState } from "react";
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Typography,
    IconButton,
    Button,
    Grid,
    CircularProgress,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
    const navigate = useNavigate();

    // Статик номын мэдээлэл номын нэр,зохиолч,үнэ,зураг,тайлбар
    const [book] = useState([
        {
            title: "The Great Gatsby",
            author: "F. Scott Fitzgerald",
            price: 10.99,
            image_url: "/assets/books.png",
            description:
                "Америкийн нэрт зохиолч Ф. Скотт Фицжеральдын 1925 онд бичигдсэн Агуу Гэтсби роман нийгэмд амжилт олох үзэл санаа буюу америк мөрөөдлийг ёс суртахууны талаас нь ямар ч нэр хүндгүй болгож орхисон бүтээл ажээ. Зохиолын гол баатар болох хөлгүй баян Гэтсбигийн зүсэн бүрийн хүмүүст бэлэглэж байсан баяр цэнгэлийн цаана согтууруулах ундааны хууль бус худалдаагаар баяжсан зальхай дамчин байгааг харуулдаг. Архины хууль бус наймаачны намтарыг дүрсэлсэн нь Хорвоо ертөнцөд гайхалтай сайхан өнгө будаг өгдөг хоосон санааны сүйрлийн тухай ба хүн ийм ид шидийг нэгэнтээ амсах юм бол дараа нь жинхэнэ ба хуурамчийн тухай ойлголтод ямар ч ялгаагүй ханддаг болчихдог тухай гэж зохиолч өөрөө Агуу Гэтсби зохиолын үндсэн санааг тодорхойлсон байдаг.",
        },
        {
            title: "Хогвартс дахь зул сарын байр",
            author: "Ж.К.Роулинг",
            price: 39900,
            image_url: "/assets/harry.png",
            description:
                "Xарри Поттер ба Философийн чулуу номын 12-р бүлэг болон Хогвартст болсон Харри Поттерын анхны Зул сарын баярын тухай сэтгэл хөдөлгөм түүх...Нууц өрөө нээгдлээ. Удам залгамжлагчийн дайснууд сэрэмжилцгээ Харри, Рон, Хермиона гуравтай хамт тавин жилийн тэртээ болсон аймшигт нууцыг тайлахын тулд амь насаа дэнчинд тавьсан аялалд гарахад бэлэн үү? Их Британийн зохиолч Ж.К.Роулингийн бичсэн өсвөр насны хүү Харри Поттерын тухай өгүүлсэн долоон цуврал, дэлхийд алдартай зохиолын эхний хоёр боть албан ёсны эрхтэйгээр уншигчдын гарт хүрэхэд бэлэн боллоо.Харри Поттер цуврал 79 хэлээр орчуулагдан дэлхий даяар 450 гаруй сая хувь борлогдож, 8 ангит кино бүтээгдсэн төдийгүй дэлхийн хүүхэд багачуудын заавал унших номын жагсаалтанд байнга нэрлэгдэж Харри Поттерын хэсгээс уншихад хамгийн шуугиантай анги хүртэл нам гүм болдог хэмээн багш нарын бахархан өгүүлдэг ном юм.",
        },
    ]);

    // useState
    // Номыг оноож өгөх
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollRef = React.useRef(null);
    const [loading, setLoading] = useState(true);

    // Номын мэдээллийг серверээс татах функц
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:5000/books/", {
                    method: "GET",
                });
                setBooks(response.data?.books || []); // Серверээс ирсэн номын мэдээлэл
            } catch (error) {
                console.error("Error fetching books:", error);
                setError("Номыг татахад алдаа гарлаа");
            } finally {
                setLoading(false); // Татах процесс дууссан
            }
        };

        fetchBooks(); // Уг функц нь номын мэдээллийг татаж авдаг
    }, []);

    // Дараагийн зураг руу гүйлгэх функц
    const handleNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += 250; // 250px-ээр гүйлгэнэ
            setScrollPosition(scrollRef.current.scrollLeft); // Гүйлгээний байрлал
        }
    };

    // Өмнөх зураг руу гүйлгэх функц
    const handlePrevious = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= 250; // 250px-ээр эргүүлнэ
            setScrollPosition(scrollRef.current.scrollLeft);
        }
    };

    return (
        <Box
            padding={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={3}>
                    {/* Номын нэр болон тайлбар */}
                    <Grid
                        item
                        xs={6}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ textDecoration: "underline", marginBottom: "10px" }}
                        >
                            {book[0].title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {book[0].description}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<ArrowForward />}
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                marginTop: "20px",
                                alignSelf: "flex-end",
                                borderRadius: "20px",
                                "&:hover": {
                                    backgroundColor: "grey",
                                },
                            }}
                        >
                            Дэлгэрэнгүй
                        </Button>
                    </Grid>

                    {/* Зураг тал */}
                    <Grid item xs={6}>
                        <CardMedia
                            component="img"
                            height="550"
                            image={book[0].image_url}
                            alt={book[0].title}
                            sx={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                    </Grid>
                </Grid>
            </Box>

            {/* Алдааг харуулах хэсэг */}
            {error && <Typography color="error">{error}</Typography>}

            {/* Номын жагсаалттай хуваарь */}
            <Box position="relative" width="100%" maxWidth="1200px">
                <IconButton
                    onClick={handlePrevious}
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                    }}
                    disabled={scrollPosition <= 0}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                    Top 10
                </Typography>

                <Box
                    ref={scrollRef}
                    display="flex"
                    overflow="auto"
                    width="100%"
                    sx={{
                        scrollBehavior: "smooth",
                        paddingTop: "1rem",
                        paddingBottom: "3rem",
                        "::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    {loading ? (
                        <CircularProgress sx={{ marginTop: "50px" }} />
                    ) : (
                        books.map((book) => (
                            <Card
                                key={book.id}
                                sx={{
                                    minWidth: "180px",
                                    height: "300px",
                                    marginRight: "16px",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 4px 20px rgb(102, 179, 255)",
                                        cursor: "pointer",
                                    },
                                }}
                                onClick={() =>
                                    navigate(`/books/${book.id}`, { state: { book: book } })
                                }
                            >
                                {book.image_url && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={book.image_url}
                                        alt={book.title}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" component="div" noWrap>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" noWrap>
                                        <b>{book.price}₮</b>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {book.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                    }}
                >
                    <ArrowForward fontSize="large" />
                </IconButton>
            </Box>

            {/* Номын жагсаалттай хуваарь */}
            <Box position="relative" width="100%" maxWidth="1200px">
                <IconButton
                    onClick={handlePrevious}
                    sx={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                    }}
                    disabled={scrollPosition <= 0}
                >
                    <ArrowBack fontSize="large" />
                </IconButton>
                <Typography variant="h5" sx={{ marginBottom: "10px" }}>
                    Christmas is coming
                </Typography>

                <Box
                    ref={scrollRef}
                    display="flex"
                    overflow="auto"
                    width="100%"
                    sx={{
                        scrollBehavior: "smooth",
                        paddingTop: "1rem",
                        paddingBottom: "3rem",
                        "::-webkit-scrollbar": { display: "none" },
                    }}
                >
                    {loading ? (
                        <CircularProgress sx={{ marginTop: "50px" }} />
                    ) : (
                        books.map((book) => (
                            <Card
                                key={book.id}
                                sx={{
                                    minWidth: "180px",
                                    height: "300px",
                                    marginRight: "16px",
                                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                                    "&:hover": {
                                        transform: "scale(1.05)",
                                        boxShadow: "0px 4px 20px rgb(102, 179, 255)",
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                {book.image_url && (
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={book.image_url}
                                        alt={book.title}
                                    />
                                )}
                                <CardContent>
                                    <Typography variant="h6" component="div" noWrap>
                                        {book.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.primary" noWrap>
                                        <b>{book.price}₮</b>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" noWrap>
                                        {book.author}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>
                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        right: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        zIndex: 1,
                    }}
                >
                    <ArrowForward fontSize="large" />
                </IconButton>
            </Box>

            {/* Дараагийн номын хэсэг */}
            <Box sx={{ flexGrow: 1, paddingTop: "1rem" }}>
                <Grid container spacing={3}>
                    <Grid
                        item
                        xs={6}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            textAlign: "center",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{ textDecoration: "underline", marginBottom: "10px" }}
                        >
                            {book[1].title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {book[1].description}
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<ArrowForward />}
                            sx={{
                                backgroundColor: "black",
                                color: "white",
                                marginTop: "20px",
                                alignSelf: "flex-end",
                                borderRadius: "20px",
                                "&:hover": {
                                    backgroundColor: "grey",
                                },
                            }}
                        >
                            Дэлгэрэнгүй
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <CardMedia
                            component="img"
                            height="450"
                            image={book[1].image_url}
                            alt={book[1].title}
                            sx={{ objectFit: "cover", borderRadius: "8px" }}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default HomePage;
