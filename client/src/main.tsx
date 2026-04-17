import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "@/store";
import { applyStoredTheme } from "@/store/features/themeSlice";
import App from "./App";
import "./index.css";

// Apply theme before first paint to prevent flash
applyStoredTheme();

const root = document.getElementById("root");
if (!root) throw new Error("Root element #root not found in index.html");

createRoot(root).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);
