import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "@/router/app.router";
import { FinancialModalProvider } from "@/shared/hooks/financial-modal.context";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <FinancialModalProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </FinancialModalProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
