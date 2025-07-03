import React from "react";
import ReactDOM from "react-dom/client";
import { Example } from "./examples/transition-3/Example"; // 경로 확인!

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>
);
