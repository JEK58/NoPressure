import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Fallback from "./views/404";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/:group/:tracker",
    element: <App />,
  },
  {
    path: "*",
    element: <Fallback />, // You can create a NotFoundComponent for a custom 404 page
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
