import { Routes, Route } from "react-router-dom";
import FinancialProfileModal from "@/shared/components/custom/FinancialProfileModal";
import ScrollToTop from "@/shared/components/custom/ScrollToTop";
import PageTransition from "@/shared/components/custom/PageTransition";
import Navigation from "@/shared/components/custom/Navigation";
import NotFound from "@/shared/components/custom/NotFound";
import HomePage from "@/home/pages/HomePage";
import BuyPage from "@/buy/pages/BuyPage";
import PropertyDetailPage from "@/buy/pages/PropertyDetailPage";
import SellPage from "@/sell/pages/SellPage";
import CreditFlowPage from "@/buy/pages/CreditFlowPage";
import ServiciosPage from "@/home/pages/ServiciosPage";
import MiCuentaPage from "@/myAccount/MiCuentaPage";
import RegisterPage from "@/auth/pages/RegisterPage";
import VerifyOtpPage from "@/auth/pages/VerifyOtpPage";

const AppRouter = () => (
  <>
    <ScrollToTop />
    <Navigation />
    <PageTransition>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/comprar" element={<BuyPage />} />
        <Route path="/propiedad/:id" element={<PropertyDetailPage />} />
        <Route path="/vender" element={<SellPage />} />
        <Route path="/credito" element={<CreditFlowPage />} />
        <Route path="/servicios" element={<ServiciosPage />} />
        <Route path="/mi-cuenta" element={<MiCuentaPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/verify" element={<VerifyOtpPage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>

    {/* Global Financial Profile Modal */}
    <FinancialProfileModal />
  </>
);

export default AppRouter;
