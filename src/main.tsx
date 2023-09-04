import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Fallback from "./views/404";
import "./index.css";
import * as Sentry from "@sentry/react";

if (process.env.NODE_ENV == "development") {
  console.log("Sentry disabled");
} else {
  Sentry.init({
    dsn: "https://a421464f844af1763721fc9697834926@o4504899889397760.ingest.sentry.io/4505793070563328",
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
          "localhost",
          "https://position.stephanschoepe.de",
        ],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

const router = createBrowserRouter([
  {
    path: "/:group/:tracker/iamold",
    element: <App blindmode={true} />,
  },
  {
    path: "/:group/:tracker/",
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
