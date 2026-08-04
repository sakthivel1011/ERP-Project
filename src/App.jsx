import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
import Layout from "./Pages/Layout/Layout";
import PrivateRouter from "./Routes/privaterouter";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Layout />
      <PrivateRouter />
    </>
  );
}

export default App;
