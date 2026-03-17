import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { NovaLoader } from "./components/NovaLoader";
import { RevealProvider, RevealItem } from "./components/RevealSystem";

import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Products } from "./pages/Products";
import { ProductDetails } from "./pages/ProductDetails";
import { OrderPage } from "./pages/Order";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Admin } from "./pages/Admin";
import { Notifications } from "./pages/Notifications";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { Returns } from "./pages/Returns";
import { Shipping } from "./pages/Shipping";
import { FAQ } from "./pages/FAQ";
import { Terms } from "./pages/Terms";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/products/:id" component={ProductDetails} />
      <Route path="/order/:id" component={OrderPage} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/admin" component={Admin} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/returns" component={Returns} />
      <Route path="/shipping" component={Shipping} />
      <Route path="/faq" component={FAQ} />
      <Route path="/terms" component={Terms} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [revealed, setRevealed] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {/* اللودر — يُشغَّل دائماً عند البداية */}
        {!revealed && <NovaLoader onDone={() => setRevealed(true)} />}

        {/* الموقع — يظهر عنصراً عنصراً بعد انتهاء اللودر */}
        <RevealProvider revealed={revealed}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <div className="flex flex-col min-h-screen bg-background text-foreground">

              {/* الـ Navbar يظهر أولاً */}
              <RevealItem delay={0} dir="down">
                <Navbar />
              </RevealItem>

              {/* المحتوى الرئيسي يظهر بعده */}
              <RevealItem delay={0.18} dir="up" className="flex-grow">
                <main>
                  <Router />
                </main>
              </RevealItem>

              {/* الفوتر آخراً */}
              <RevealItem delay={0.32} dir="up">
                <Footer />
              </RevealItem>

            </div>
          </WouterRouter>
        </RevealProvider>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
