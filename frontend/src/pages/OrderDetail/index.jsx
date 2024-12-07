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

const StatusChip = ({ status }) => {
  let color = "default";
  let label = "";

  if (status === "success") {
    color = "success";
    label = "Хүргэгдсэн";
  } else if (status === "pending") {
    color = "warning";
    label = "Хүлээгдэж буй";
  } else if (status === "canceled") {
    color = "error";
    label = "Цуцлагдсан";
  } else {
    label = "Тодорхойгүй";
  }

  return <Chip label={label} color={color} variant="outlined" />;
};

const OrdersPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(""); // Add state for search

  useEffect(() => {
    if (!user) {
      setOpenModal(true);
      return;
    }

    fetchOrders(currentPage, search);
  }, [user, currentPage]); // Trigger fetch when user or page changes

  const fetchOrders = async (page = 1, search = "") => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/orders/${user.id}/`,
        {
          params: {
            page,
            limit: 10, // Number of items per page
          },
        }
      );
      const { items, pagination } = response.data;
      setOrders(items);
      setPagination(pagination); // Save pagination data
      filterOrders(items, search); // Apply search filter locally
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };

  const filterOrders = (orders, search) => {
    if (search) {
      const filtered = orders.filter(
        (order) =>
          order.title.toLowerCase().includes(search.toLowerCase()) ||
          order.author.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredOrders(filtered);
    } else {
      setFilteredOrders(orders); // No search, show all orders
    }
  };

  const handleSearchChange = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue); // Update search state
    filterOrders(orders, searchValue); // Filter orders on search change
    setCurrentPage(1); // Reset page to 1 when search changes
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    navigate(-1);
  };

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Intl.DateTimeFormat("mn-MN", options).format(
      new Date(dateString)
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
              onChange={handleSearchChange}
              fullWidth
              sx={{ maxWidth: "400px" }}
            />
          </Box>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="error">{error}</Typography>
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

          {/* Pagination Control */}
          {pagination.total_pages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Pagination
                count={pagination.total_pages}
                page={currentPage}
                onChange={handlePageChange}
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
