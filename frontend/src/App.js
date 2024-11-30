import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for the toast notifications

// Import pages
import SignUp from './pages/loginForm/signin/signUp';
import Login from './pages/loginForm/login';
import ResetPassword from './pages/loginForm/resetPassword/resetPassword';
import HomePage from './pages/home/home';
import Filter from './pages/Filter';
import Detail from "./pages/Detail";

// Import AppLayout
import AppLayout from './components/Layout';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="/books" element={<Filter />} />
            <Route path='/books/:id' element={<Detail/>} />
            <Route path="/top" element={<Filter />} />
          </Route>
          <Route path="/signUp" element={<SignUp />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/login" element={<Login />} />
        </Routes>
        
        {/* Add ToastContainer for toast notifications */}
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
  );
}

export default App;
