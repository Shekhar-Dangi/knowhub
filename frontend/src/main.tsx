import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { FilesProvider } from "./context/FilesProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FilesProvider>
      <App />
    </FilesProvider>
  </StrictMode>
);
