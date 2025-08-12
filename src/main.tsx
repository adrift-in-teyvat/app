import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./routes/Home/Home.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Game from "./routes/Game/Game.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="Game" element={<Game />}></Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
