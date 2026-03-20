import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AppRouter from "@/router/app.router";
import { FinancialModalProvider } from "@/shared/hooks/financial-modal.context";
import { AuthProvider, useAuth } from "@/shared/hooks/auth.context";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoggingOut } = useAuth();

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-4 bg-background/80 backdrop-blur-sm">
          <Loader2 className="w-8 h-8 animate-spin text-[hsl(var(--champagne-gold))]" />
          <p className="text-base font-medium text-midnight">Cerrando sesión...</p>
        </div>
      )}
      <FinancialModalProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </FinancialModalProvider>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
