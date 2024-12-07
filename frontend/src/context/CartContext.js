import React, { createContext, useState, useContext, useEffect } from "react";
import { useUser } from "./UserContext";
// Create CartContext
const CartContext = createContext();

// CartProvider component
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(0); // Local state for the cart count
  const { user } = useUser();

  const fetchCartCount = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/cart/count/${user.id}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add any authentication token if needed
        },
      });
      const data = await response.json();
      setCartItems(data.count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchCartCount();
    }
  }, [user]); // Runs only once when the component mounts

  const addToCart = async (bookId, quantity) => {
    if (user) {
      try {
        const response = await fetch("http://127.0.0.1:5000/cart/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ book_id: bookId, quantity, user_id:user.id }),
        });

        if (response.ok) {
          fetchCartCount()
        } else {
          console.error("Failed to add item to cart");
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart,fetchCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};
