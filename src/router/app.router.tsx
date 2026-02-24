import { Routes, Route } from "react-router-dom";
import HomePage from "@/home/pages/HomePage";
import BuyPage from "@/buy/pages/BuyPage";
import PropertyDetailPage from "@/buy/pages/PropertyDetailPage";
import SellPage from "@/sell/pages/SellPage";
import CreditFlow from "@/pages/CreditFlow";
import Servicios from "@/pages/Servicios";
import MiCuenta from "@/pages/MiCuenta";
import NotFound from "@/pages/NotFound";

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/comprar" element={<BuyPage />} />
    <Route path="/propiedad/:id" element={<PropertyDetailPage />} />
    <Route path="/vender" element={<SellPage />} />
    <Route path="/credito" element={<CreditFlow />} />
    <Route path="/servicios" element={<Servicios />} />
    <Route path="/mi-cuenta" element={<MiCuenta />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
