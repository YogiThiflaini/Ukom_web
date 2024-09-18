// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import SignUp from './pages/SignUpPage';
import Login from './pages/LoginPage';
import Home from './pages/HomePage';
import BookCars from './pages/BookCarsPage';
import Rent from './pages/RentPage';
import Verify from './pages/VerifyPage';
import Profile from './pages/ProfilePage';
import Dashboard from './pages/DashboardPage';
import NotFound from './pages/Page404';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute';
import Service from './pages/SyaratPage';
import PasswordForm from './pages/ResetPassword';
import LoadingSpinner from "./components/ui/loading-spinner";
import Order from './pages/OrderPage';
import Comment from './pages/FilteredRentTable';

function App() {
  const [isLoading, setLoading] = useState(true);

  useEffect(()=>{
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    // Cleanup timer saat komponen di-unmount
    return () => clearTimeout(timer);
  },[]);

  if (isLoading) return <LoadingSpinner />;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="service" element={<Service />} />
          <Route path="verify" element={<Verify />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="login" element={<Login />} />
          <Route path="order" element={<Order />} />
          <Route path="comment" element={<Comment />} />
          <Route path="reset-password" element={<PasswordForm />} />
          <Route path="cars" element={<BookCars />} />
          <Route path="cars/:id" element={<Rent />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
