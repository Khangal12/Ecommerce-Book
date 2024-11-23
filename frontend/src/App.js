import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import SignUp from './pages/signin/signUp';
// Import your components
import Login from './pages/login';
import ResetPassword from './pages/resetPassword/resetPassword';
import HomePage from './pages/home/home';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the login route */}
          <Route path="/" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/resetPassword" element={<ResetPassword/>}/>
          <Route path="/home" element={<HomePage/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
