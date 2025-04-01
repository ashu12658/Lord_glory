import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from '../pages/home';
import ProductPage from '../pages/productpage';
import OrderPage from '../pages/orderpage';
import LoginPage from '../pages/loginpage';
import Register from '../pages/Register';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />  
        <Route path="/home" element={<Home />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
