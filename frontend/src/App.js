import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Import pages
import SignUp from "./pages/loginForm/signin/signUp";
import Login from "./pages/loginForm/login";
import ResetPassword from "./pages/loginForm/resetPassword/resetPassword";
import HomePage from "./pages/home/home";
import Filter from "./pages/Filter";
import Detail from "./pages/Detail";
import Cart from "./pages/Cart"
import CheckoutPage from "./pages/Order";
import UserSettings from './components/userSettings/settings';

// Import AppLayout
import AppLayout from "./components/Layout";

import { UserProvider, useUser } from "./context/UserContext";
import { CartProvider } from "./context/CartContext";
function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/books" element={<Filter />} />
              <Route path="/settings" element={<UserSettings />} />
                <Route path="/books/:id" element={<Detail />} />
                <Route path="/top" element={<Filter />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/order" element={<CheckoutPage />} />
              </Route>
              <Route path="/signUp" element={<SignUp />} />
              <Route path="/resetPassword" element={<ResetPassword />} />
              <Route path="/login" element={<Login />} />

            </Routes>

            {/* Toast notifications */}
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
