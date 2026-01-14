import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import App from "./App";
import "@mantine/core/styles.css";
import "./index.css";

const theme = createTheme({
  fontFamily: "Source Sans 3, sans-serif",
  headings: { fontFamily: "Fraunces, serif" },
  primaryColor: "dark"
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <App />
    </MantineProvider>
  </React.StrictMode>
);
