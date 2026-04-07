import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GlobalErrorBoundary from "@/shared/components/custom/GlobalErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <GlobalErrorBoundary>
    <App />
  </GlobalErrorBoundary>
);
