import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css"; // 스타일 경로 맞게 조정

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
