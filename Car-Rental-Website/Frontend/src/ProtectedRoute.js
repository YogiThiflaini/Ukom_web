// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly }) => {
  const isLoggedIn = localStorage.getItem("id") !== null;
  const userLevel = localStorage.getItem("level");

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && userLevel !== 'admin') {
    return <Navigate to="/home" />;
  }

  return children;
};

export default ProtectedRoute;
