import React, { useState } from "react";
import { BrowserRouter } from "react-router-dom"; // Ungaloda router wrapper package import
import LoginPage from "./Pages/Login/Login"; 
import Layout from "./Pages/Layout/Layout";       
import PrivateRouter from "./routes/PrivateRouter";
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter basename="/ERP-Project">
     
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
      ) : (
        <>
          <Layout />
          <PrivateRouter />
        </>
      )}
    </BrowserRouter>
  );
}
