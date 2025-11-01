import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Introduction from "./pages/Introduction";
import Parameters from "./pages/Parameters";
import LinearKernel from "./pages/LinearKernel";
import PolynomialKernel from "./pages/PolynomialKernel";
import RBFKernel from "./pages/RBFKernel";
import SigmoidKernel from "./pages/SigmoidKernel";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Introduction />} />
          <Route path="/parameters" element={<Parameters />} />
          <Route path="/linear-kernel" element={<LinearKernel />} />
          <Route path="/polynomial-kernel" element={<PolynomialKernel />} />
          <Route path="/rbf-kernel" element={<RBFKernel />} />
          <Route path="/sigmoid-kernel" element={<SigmoidKernel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
