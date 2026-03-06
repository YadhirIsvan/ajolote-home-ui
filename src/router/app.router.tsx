import { Routes, Route } from "react-router-dom";
import FinancialProfileModal from "@/components/FinancialProfileModal";
import HomePage from "@/home/pages/HomePage";
import BuyPage from "@/buy/pages/BuyPage";
import PropertyDetailPage from "@/buy/pages/PropertyDetailPage";
import SellPage from "@/sell/pages/SellPage";
import CreditFlow from "@/pages/CreditFlow";
import Servicios from "@/pages/Servicios";
import MiCuenta from "@/pages/MiCuenta";
import NotFound from "@/pages/NotFound";
import RegisterPage from "@/auth/pages/RegisterPage";
import VerifyOtpPage from "@/auth/pages/VerifyOtpPage";

const AppRouter = () => (
  <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/comprar" element={<BuyPage />} />
      <Route path="/propiedad/:id" element={<PropertyDetailPage />} />
      <Route path="/vender" element={<SellPage />} />
      <Route path="/credito" element={<CreditFlow />} />
      <Route path="/servicios" element={<Servicios />} />
      <Route path="/mi-cuenta" element={<MiCuenta />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/verify" element={<VerifyOtpPage />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    
    {/* Global Financial Profile Modal */}
    <FinancialProfileModal />
  </>
);

export default AppRouter;
