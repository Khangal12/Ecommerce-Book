import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { styled } from "@mui/material/styles";

// Styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
}));

// Төлвийг тодорхойлж, өнгө болон нэрийг нь харуулах компонент
const StatusChip = ({ status }) => {
  let color = "default";
  let label = "";

  if (status === "success") {
    color = "success"; // Амжилттай гэж үзэх үед ногоон өнгө
    label = "Хүргэгдсэн";
  } else if (status === "pending") {
    color = "warning"; // Хүлээгдэж буй үед шар өнгө
    label = "Хүлээгдэж буй";
  } else if (status === "canceled") {
    color = "error"; // Цуцлагдсан үед улаан өнгө
    label = "Цуцлагдсан";
  } else {
    label = "Тодорхойгүй"; // Төлөв тодорхойгүй үед
  }

  return <Chip label={label} color={color} variant="outlined" />;
};

const OrdersPage = () => {
  const { user } = useUser(); // Хэрэглэгчийн мэдээллийг авна
  const navigate = useNavigate(); // Систем доторх шилжих функц
  const [orders, setOrders] = useState([]); // Захиалгуудын жагсаалт
  const [filteredOrders, setFilteredOrders] = useState([]); // Шалгарсан захиалгууд
  const [loading, setLoading] = useState(true); // Ачаалж буй байдал
  const [error, setError] = useState(""); // Алдааны мэдээлэл
  const [openModal, setOpenModal] = useState(false); // Нэвтрэхгүй бол харуулах modal
  const [currentPage, setCurrentPage] = useState(1); // Одоо байгаа хуудас
  const [pagination, setPagination] = useState({}); // Хуудаслах мэдээлэл
  const [search, setSearch] = useState(""); // Хайлт хийх орон

  // Хэрэглэгч байхгүй бол нэвтрэх хэрэгтэй гэсэн хэлбэрт шилжүүлнэ
  useEffect(() => {
    if (!user) {
      setOpenModal(true);
      return;
    }

    fetchOrders(currentPage, search); // Захиалгуудыг авна
  }, [user, currentPage]); // Хэрэглэгч болон хуудас өөрчлөгдсөн үед fetch хийх

  // Захиалгуудыг авдаг асинхрон функц
  const fetchOrders = async (page = 1, search = "") => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/orders/${user.id}/`, // API руу захиалгуудыг авах хүсэлт илгээнэ
        {
          params: {
            page,
            limit: 10, // Хуудаслах тоо
          },
        }
      );
      const { items, pagination } = response.data; // Захиалгууд болон хуудаслах мэдээллийг авна
      setOrders(items); // Захиалгуудыг хадгална
      setPagination(pagination); // Хуудаслах мэдээллийг хадгална
      filterOrders(items, search); // Хайлт хийсний дараах шүүлт хийх
      setLoading(false); // Ачаалал дууслаа
    } catch (err) {
      setError("Failed to fetch orders"); // Алдаа гарсан бол мессеж харуулах
      setLoading(false); // Ачаалал дууслаа
    }
  };

  // Захиалгуудыг хайлтаар шүүж харуулах
  const filterOrders = (orders, search) => {
    if (search) {
      const filtered = orders.filter(
        (order) =>
          order.title.toLowerCase().includes(search.toLowerCase()) || // Номны нэрээр хайх
          order.author.toLowerCase().includes(search.toLowerCase()) // Зохиогчийн нэрээр хайх
      );
      setFilteredOrders(filtered); // Шалгарсан захиалгуудыг хадгална
    } else {
      setFilteredOrders(orders); // Хайлтгүй бол бүх захиалгуудыг харуулна
    }
  };

  // Хайлт хийх талбарыг өөрчлөх функц
  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue); // Хайлт хийх утгыг хадгалах
    filterOrders(orders, searchValue); // Шүүлт хийх
    setCurrentPage(1); // Хайлт хийх үед хуудас 1-р хуудас руу шилжинэ
  };

  // Нэвтрэхгүй бол modal-г хаах
  const handleCloseModal = () => {
    setOpenModal(false);
    navigate(-1); // Өмнөх хуудас руу буцах
  };

  // Хуудас өөрчлөх үед
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage); // Хуудас шинэчлэх
  };

  // Огноог форматаар харуулах функц
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("mn-MN", options).format(
      new Date(dateString) // Монгол огнооны форматаар харуулах
    );
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      {user ? (
        <>
          <Typography variant="h4" gutterBottom>
            Захиалга
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <TextField
              label="Номны нэрээр хайх"
              variant="outlined"
              value={search}
              onChange={handleSearchChange} // Хайлт хийх үед үйлдлийг ажиллуулна
              fullWidth
              sx={{ maxWidth: "400px" }}
            />
          </Box>
          {loading ? (
            <Typography>Loading...</Typography> // Ачаалж буй үед
          ) : error ? (
            <Typography color="error">{error}</Typography> // Алдаа гарсан үед
          ) : (
            <TableContainer component={Paper} elevation={3}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Захиалгын дугаар</StyledTableCell>
                    <StyledTableCell>Номны нэр</StyledTableCell>
                    <StyledTableCell>Зохиолчийн нэр</StyledTableCell>
                    <StyledTableCell>Огноо</StyledTableCell>
                    <StyledTableCell>Төлөв</StyledTableCell>
                    <StyledTableCell>Номны үнэ</StyledTableCell>
                    <StyledTableCell>Тоо ширхэг</StyledTableCell>
                    <StyledTableCell>Нийт үнэ</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.title}</TableCell>
                        <TableCell>{order.author}</TableCell>
                        <TableCell>{formatDate(order.order_date)}</TableCell>
                        <TableCell>
                          <StatusChip status={order.status} />
                        </TableCell>
                        <TableCell>{Math.round(order.price)}₮</TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>
                          {Math.round(order.price) * order.quantity}₮
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        Захиалга байхгүй.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Хуудас хуваарилах товч */}
          {pagination.total_pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={pagination.total_pages} // Нийт хуудасны тоо
                page={currentPage} // Одоо байгаа хуудас
                onChange={handlePageChange} // Хуудас өөрчлөх үед
                color="primary"
                siblingCount={1}
              />
            </Box>
          )}
        </>
      ) : (
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Анхааруулга</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Та заавал нэвтрэх шаардлагатай.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="dark" variant="contained">
              Буцах
            </Button>
            <Button
              onClick={() => navigate("/login")}
              color="primary"
              variant="contained"
            >
              Нэвтрэх
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default OrdersPage;
