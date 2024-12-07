import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider
} from "@mui/material";
import axios from "axios";

const OrderDetailsModal = ({ open, onClose, order }) => {
  const [details, setDetails] = useState(null); // Holds the detailed order data
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({});

  useEffect(() => {
    if (open && order?.id) {
      fetchDetail();
    }
  }, [open, order?.id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/admin/orders/${order.id}/`
      );
      const data = response.data
      const parsedAddress = typeof data.address === "string" ? JSON.parse(data.address) : data.address;

      setDetails(data);
      setAddress(parsedAddress);
    } catch (err) {
      setError("Захиалгын дэлгэрэнгүйг авахад алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  if (!order) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Захиалгын дэлгэрэнгүй</DialogTitle>
      <DialogContent>
        {loading ? (
          <Typography>Ачааллаж байна...</Typography>
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : details ? (
          <Box>
            <Typography variant="body1">
              <strong>Захиалгын дугаар:</strong> {order.id}
            </Typography>
            <Typography variant="body1">
              <strong>Захиалагчийн нэр:</strong>{" "}
              {order.user?.name || "Мэдээлэл байхгүй"}
            </Typography>
            <Typography variant="body1">
              <strong>Захиалагчийн имэйл:</strong>{" "}
              {order.user?.email || "Мэдээлэл байхгүй"}
            </Typography>
            <Typography variant="body1">
              <strong>Огноо:</strong> {order.order_date || "Мэдээлэл байхгүй"}
            </Typography>
            <Typography variant="body1">
              <strong>Төлөв:</strong> {order.status || "Мэдээлэл байхгүй"}
            </Typography>
            <Typography variant="body1">
              <strong>Төлбөр:</strong> {Math.round(order.total_price)}₮
            </Typography>

            {/* Address (Updated Section) */}
            {address && (
              <Box
                sx={{
                  maxWidth: 600,
                  margin: "auto",
                  padding: 3,
                  boxShadow: 3,
                  borderRadius: 2,
                  marginTop:2,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  align="center"
                  sx={{ fontWeight: "bold", marginBottom: 2 }}
                >
                  Захиалга хаяг
                </Typography>
                <Divider sx={{ marginY: 2 }} />
                <Box sx={{ marginBottom: 1 }}>
                  <Box sx={{ display:"flex", justifyContent:"space-between",marginBottom: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Хүлээн авагч:
                    </Typography>
                    <Typography variant="body1">{address?.name || "Мэдээлэл байхгүй"}</Typography>
                  </Box>
                  <Box sx={{ display:"flex", justifyContent:"space-between",marginBottom: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Бүртгүүлсэн утас:
                    </Typography>
                    <Typography variant="body1">{address?.phone}</Typography>
                  </Box>
                  <Box sx={{ display:"flex", justifyContent:"space-between",marginBottom: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Хот:
                    </Typography>
                    <Typography variant="body1">{address.city}</Typography>
                  </Box>
                  <Box sx={{ display:"flex", justifyContent:"space-between",marginBottom: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Дүүрэг:
                    </Typography>
                    <Typography variant="body1">{address.district}</Typography>
                  </Box>
                  <Box sx={{ display:"flex", justifyContent:"space-between",marginBottom: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Хороо:
                    </Typography>
                    <Typography variant="body1">
                      {address.subDistrict}
                    </Typography>
                  </Box>
                  <Box sx={{ display:"flex", justifyContent:"space-between",marginBottom: 1 }}>
                    <Typography variant="body1" color="text.secondary">
                      Дэлгэрэнгүй хаяг:
                    </Typography>
                    <Typography variant="body1">
                      {address.detailedAddress}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                <strong>Захиалгын зүйлс:</strong>
              </Typography>
              {details.items?.length > 0 ? (
                <List>
                  {details.items.map((item) => (
                    <ListItem key={item.id} divider>
                      <ListItemText
                        primary={`${item.book?.title || "Нэргүй"} (${
                          item.quantity
                        } x ${item.price}₮)`}
                        secondary={`Нийт: ${item.total}₮`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography>Захиалгын зүйлс байхгүй.</Typography>
              )}
            </Box>
          </Box>
        ) : (
          <Typography>Мэдээлэл байхгүй.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Хаах
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
