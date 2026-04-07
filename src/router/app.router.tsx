import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import FinancialProfileModal from "@/shared/components/custom/FinancialProfileModal";
import ScrollToTop from "@/shared/components/custom/ScrollToTop";
import PageTransition from "@/shared/components/custom/PageTransition";
import Navigation from "@/shared/components/custom/Navigation";
import NotFound from "@/shared/components/custom/NotFound";

// Rutas críticas para LCP — carga síncrona
import HomePage from "@/home/pages/HomePage";
import BuyPage from "@/buy/pages/BuyPage";

// Rutas secundarias — lazy load para reducir bundle inicial
const PropertyDetailPage = lazy(() => import("@/buy/pages/PropertyDetailPage"));
const SellPage = lazy(() => import("@/sell/pages/SellPage"));
const CreditFlowPage = lazy(() => import("@/buy/pages/CreditFlowPage"));
const ServiciosPage = lazy(() => import("@/home/pages/ServiciosPage"));
const MiCuentaPage = lazy(() => import("@/myAccount/MiCuentaPage"));
const RegisterPage = lazy(() => import("@/auth/pages/RegisterPage"));
const VerifyOtpPage = lazy(() => import("@/auth/pages/VerifyOtpPage"));

const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--champagne-gold))]" />
  </div>
);

const AppRouter = () => (
  <>
    <ScrollToTop />
    <Navigation />
    <PageTransition>
      <Suspense fallback={<PageLoader />}>
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
      </Suspense>
    </PageTransition>

    {/* Global Financial Profile Modal */}
    <FinancialProfileModal />
  </>
);

export default AppRouter;
