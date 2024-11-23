import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for the toast notifications

import SignUp from './pages/loginForm/signin/signUp';
import Login from './pages/loginForm/login';
import ResetPassword from './pages/loginForm/resetPassword/resetPassword';
import HomePage from './pages/home/home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
        
        {/* Add ToastContainer to show toast notifications */}
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
