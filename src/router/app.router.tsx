import { lazy, Suspense } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import ScrollToTop from "@/shared/components/custom/ScrollToTop";
import Navigation from "@/shared/components/custom/Navigation";
import PageTransition from "@/shared/components/custom/PageTransition";
import FinancialProfileModal from "@/shared/components/custom/FinancialProfileModal";
import NotFound from "@/shared/components/custom/NotFound";
import AuthModal from "@/auth/components/AuthModal";
import { useFinancialModal } from "@/shared/hooks/financial-modal.context";

// ── Pages (todas lazy) ────────────────────────────────────────────────────────
const HomePage = lazy(() =>
  import("@/home/pages/HomePage").then((m) => ({ default: m.default }))
);
const BuyPage = lazy(() =>
  import("@/buy/pages/BuyPage").then((m) => ({ default: m.default }))
);
const PropertyDetailPage = lazy(() =>
  import("@/buy/pages/PropertyDetailPage").then((m) => ({ default: m.default }))
);
const SellPage = lazy(() =>
  import("@/sell/pages/SellPage").then((m) => ({ default: m.default }))
);
const CreditFlowPage = lazy(() =>
  import("@/buy/pages/CreditFlowPage").then((m) => ({ default: m.default }))
);
const ServiciosPage = lazy(() =>
  import("@/home/pages/ServiciosPage").then((m) => ({ default: m.default }))
);
const MiCuentaPage = lazy(() =>
  import("@/myAccount/MiCuentaPage").then((m) => ({ default: m.default }))
);
const RegisterPage = lazy(() =>
  import("@/auth/pages/RegisterPage").then((m) => ({ default: m.default }))
);
const VerifyOtpPage = lazy(() =>
  import("@/auth/pages/VerifyOtpPage").then((m) => ({ default: m.default }))
);

// ── PageLoader ────────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--champagne-gold))]" />
  </div>
);

// ── RootLayout ────────────────────────────────────────────────────────────────
const RootLayout = () => {
  const { showAuthFirst, closeAuthModal, onAuthSuccess } = useFinancialModal();

  return (
    <>
      <ScrollToTop />
      <Navigation />
      <PageTransition>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </PageTransition>
      <FinancialProfileModal />
      <AuthModal
        isOpen={showAuthFirst}
        onClose={closeAuthModal}
        onLoginSuccess={onAuthSuccess}
      />
    </>
  );
};

// ── Router ────────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/comprar", element: <BuyPage /> },
      { path: "/propiedad/:id", element: <PropertyDetailPage /> },
      { path: "/vender", element: <SellPage /> },
      { path: "/credito", element: <CreditFlowPage /> },
      { path: "/servicios", element: <ServiciosPage /> },
      { path: "/mi-cuenta", element: <MiCuentaPage /> },
      { path: "/auth/register", element: <RegisterPage /> },
      { path: "/auth/verify", element: <VerifyOtpPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
