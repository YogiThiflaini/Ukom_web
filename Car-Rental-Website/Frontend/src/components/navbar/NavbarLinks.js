import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./NavbarLinks.css";

const NavbarLinks = () => {
  const { t } = useTranslation();
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

  // useEffect(() => {
  //   // Check login status when component mounts
  //   checkLoginStatus();
  // }, []);

  // const checkLoginStatus = () => {
  //   // Implement your logic to check login status
  //   // For example, check if there's a token in localStorage or if user is authenticated via context
  //   const email = localStorage.getItem("email");
  //   const loggedIn = email !== null; // Example: check if email exists in localStorage
  //   setIsLoggedIn(loggedIn);
  // };

  return (
    <div className="collapse navbar-collapse mt-lg-0 mt-4" id="navbarLinks">
      <Link className="navbar-brand" to="/home">
        DAYstore
      </Link>
      <ul className="navbar-nav">
        <li className="nav-item mx-2">
          <Link className="nav-link" to="/dashboard">
            {t("navbar.dashboard")}
          </Link>
        </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/cars">
              {t("navbar.bookCars")}
            </Link>
          </li>
          <li className="nav-item mx-2">
            <Link className="nav-link" to="/service">
              {t("navbar.service")}
            </Link>
          </li>
      
      </ul>
    </div>
  );
};

export default NavbarLinks;
