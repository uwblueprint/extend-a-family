import React from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
// eslint-disable-next-line import/no-extraneous-dependencies
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import getTheme from "./theme/theme";

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={getTheme(false)}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
