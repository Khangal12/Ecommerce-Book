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
import { styled } from "@mui/material/styles";
import OrderDetailsModal from "./Modal";

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
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState({})

  useEffect(() => {
    fetchOrders(currentPage, search);
  }, [currentPage]); // Trigger fetch when user or page changes

  const fetchOrders = async (page = 1, search = "") => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/admin/orders/`, {
        params: {
          page,
          limit: 10, // Number of items per page
        },
      });
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

  const handleDetailClick = (order) => {
    setSelectedOrder(order)
    setOpenModal(!openModal)
  };

  const changeOrder = async (id) => {
    try {
      const response = await axios.put(`http://127.0.0.1:5000/admin/orders/${id}/`);
      fetchOrders(currentPage,search)
    } catch (err) {
      setError("Failed to fetch orders");
      setLoading(false);
    }
  };
  
  const handleStatusClick = (orderId) => {
    changeOrder(orderId)
  };
  

  return (
    <Container maxWidth="lg">
      <Typography variant="body3" gutterBottom>
        Захиалга
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
        <TextField
          label="Номны нэрээр хайх"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          fullWidth
          size="small"
          sx={{ maxWidth: "400px" }}
        />
      </Box>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{marginTop:2}}>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Захиалгын дугаар</StyledTableCell>
                <StyledTableCell>Захиалагчийн нэр</StyledTableCell>
                <StyledTableCell>Захиалагчийн email</StyledTableCell>
                <StyledTableCell>Огноо</StyledTableCell>
                <StyledTableCell>Төлөв</StyledTableCell>
                <StyledTableCell>Төлбөр</StyledTableCell>
                <StyledTableCell>Үйлдэл</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user?.name}</TableCell>
                    <TableCell>{order.user?.email}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>
                      <StatusChip status={order.status} />
                    </TableCell>
                    <TableCell>{Math.round(order.total_price)}₮</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={() => handleDetailClick(order)}
                      >
                        Дэлгэрэнгүй
                      </Button>
                      <Button
                        variant="outlined"
                        color="dark"
                        size="small"
                        onClick={() => handleStatusClick(order.id)}
                        disabled={order.status==='success'}
                      >
                        Хүргэсэн
                      </Button>
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
      {openModal && <OrderDetailsModal open={openModal} onClose={handleCloseModal} order={selectedOrder}/>}
    </Container>
  );
};

export default OrdersPage;
