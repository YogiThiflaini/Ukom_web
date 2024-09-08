import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState(null);

  // Load initial authentication status from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (storedEmail) {
      setEmail(storedEmail);
      setIsLoggedIn(true);
    }
  }, []);

  // Handle login
  const login = (email) => {
    localStorage.setItem("email", email);
    setEmail(email);
    setIsLoggedIn(true);
  };

  // Handle logout
  const logout = () => {
    localStorage.removeItem("email");
    setEmail(null);
    setIsLoggedIn(false);
  };

  // Listen for localStorage changes (e.g., from other tabs)
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.storageArea === localStorage) {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
          setEmail(storedEmail);
          setIsLoggedIn(true);
        } else {
          setEmail(null);
          setIsLoggedIn(false);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
