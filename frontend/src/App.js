import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


// Import your components
import Login from './pages/login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Define the login route */}
          <Route path="/" element={<Login />} />
          
          {/* You can add more routes here */}
          {/* Example: */}
          {/* <Route path="/" element={<Home />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
