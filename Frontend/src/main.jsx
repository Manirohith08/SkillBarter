import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";
import { UserContextProvider } from "./util/UserContext.jsx";

console.log(
  import.meta.env.DEV 
    ? "Running in development mode" 
    : "Running in production mode"
);

// 🔥 Updated ENV Backend URL usage
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// 🔥 Required for JWT cookies in production
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <Router>
    <UserContextProvider>
      <App />
    </UserContextProvider>
  </Router>
);
