import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Comprar from "./pages/Comprar";
import PropertyDetail from "./pages/PropertyDetail";
import SellerFlow from "./pages/SellerFlow";
import CreditFlow from "./pages/CreditFlow";
import Servicios from "./pages/Servicios";
import MiCuenta from "./pages/MiCuenta";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/comprar" element={<Comprar />} />
            <Route path="/propiedad/:id" element={<PropertyDetail />} />
            <Route path="/vender" element={<SellerFlow />} />
            <Route path="/credito" element={<CreditFlow />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/mi-cuenta" element={<MiCuenta />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
