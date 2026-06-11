import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index.tsx";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute.tsx";

// Lazy-load non-critical routes to shrink initial JS bundle
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Carrinho = lazy(() => import("./pages/Carrinho.tsx"));
const PaymentStatus = lazy(() => import("./pages/PaymentStatus.tsx"));
const AdminProdutos = lazy(() => import("./pages/AdminProdutos.tsx"));
const AdminBanners = lazy(() => import("./pages/AdminBanners.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Produto = lazy(() => import("./pages/Produto.tsx"));
const Contato = lazy(() => import("./pages/Contato.tsx"));
const Termos = lazy(() => import("./pages/Termos.tsx"));
const Privacidade = lazy(() => import("./pages/Privacidade.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/carrinho" element={<Carrinho />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/admin-produtos"
              element={
                <ProtectedAdminRoute>
                  <AdminProdutos />
                </ProtectedAdminRoute>
              }
            />
            <Route
              path="/admin-banners"
              element={
                <ProtectedAdminRoute>
                  <AdminBanners />
                </ProtectedAdminRoute>
              }
            />
            <Route path="/produto/:slug" element={<Produto />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/termos" element={<Termos />} />
            <Route path="/privacidade" element={<Privacidade />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
