import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom"; // ✅ 추가

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ 여기서 감싸줘야 Routes가 제대로 작동함 */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();