// src/pages/Orders.js
import React from "react";
import DataTable from "../../components/DataTable";
import { Box } from "@mui/material";

const columns = [
  { field: "id", headerName: "Book ID", width: 100 },
  { field: "name", headerName: "Book Name", width: 150 },
  { field: "date", headerName: "Published Date", width: 130 },
  { field: "price", headerName: "Price", width: 130 },
  { field: "size", headerName: "Size", width: 130 },
  { field: "author", headerName: "Book Author", width: 130 },
  { field: "category", headerName: "Category", width: 130 },
];

const rows = [
  {
    id: 1,
    name: "The Great Gatsby",
    date: "1925-04-10",
    price: "$10.99",
    size: "Small",
    author: "F. Scott Fitzgerald",
    category: "Fiction",
  },
  {
    id: 2,
    name: "1984",
    date: "1949-06-08",
    price: "$14.99",
    size: "Medium",
    author: "George Orwell",
    category: "Dystopian",
  },
  {
    id: 3,
    name: "To Kill a Mockingbird",
    date: "1960-07-11",
    price: "$18.99",
    size: "Large",
    author: "Harper Lee",
    category: "Historical Fiction",
  },
  {
    id: 4,
    name: "The Catcher in the Rye",
    date: "1951-07-16",
    price: "$12.99",
    size: "Medium",
    author: "J.D. Salinger",
    category: "Classics",
  },
  {
    id: 5,
    name: "Moby-Dick",
    date: "1851-10-18",
    price: "$22.99",
    size: "Large",
    author: "Herman Melville",
    category: "Adventure",
  },
  {
    id: 6,
    name: "The Hobbit",
    date: "1937-09-21",
    price: "$15.99",
    size: "Small",
    author: "J.R.R. Tolkien",
    category: "Fantasy",
  },
  {
    id: 7,
    name: "Pride and Prejudice",
    date: "1813-01-28",
    price: "$9.99",
    size: "Medium",
    author: "Jane Austen",
    category: "Romance",
  },
  {
    id: 8,
    name: "War and Peace",
    date: "1869-01-01",
    price: "$25.99",
    size: "Large",
    author: "Leo Tolstoy",
    category: "Historical Fiction",
  },
  {
    id: 9,
    name: "Brave New World",
    date: "1932-08-31",
    price: "$13.99",
    size: "Medium",
    author: "Aldous Huxley",
    category: "Science Fiction",
  },
  {
    id: 10,
    name: "Fahrenheit 451",
    date: "1953-10-19",
    price: "$11.99",
    size: "Small",
    author: "Ray Bradbury",
    category: "Dystopian",
  },
];

function Orders() {
  return (
    <Box>
      <DataTable rows={rows} columns={columns} />
    </Box>
  );
}

export default Orders;
