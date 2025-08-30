import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
// Removed Canvas test/studio after refactor; keep TemplateEditorRoute only
import ProductDetailPage from "@/pages/product-detail-page";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import NotFound from "@/pages/not-found";
import ProductsBrowsePage from "@/pages/products-browse";
// Temporarily disabled design editor imports to fix Konva issues
// import EditorTestPage from "@/pages/editor-test";
// import TemplateTestPage from "@/pages/template-test";
// import BackgroundImageTestPage from "../../pages/background-image-test";
// import SimpleBackgroundTestPage from "../../pages/simple-background-test";
// import QuickSignEditor from "../../pages/quick-sign-editor";
// import SignBoardEditorDemo from "../../pages/sign-board-editor-demo";
// import EnhancedEditorDemo from "../../pages/enhanced-editor-demo";
// import { SignEditor } from "../../components/design-editor";
import DebugCategoriesPage from "@/pages/debug-categories";
import EnhancedEditorDemo from "../../pages/enhanced-editor-demo";
import { LoadingProvider, useLoading } from "@/contexts/LoadingContext";
import LoadingScreen from "@/components/LoadingScreen";
import { usePageTransition } from "@/hooks/usePageTransition";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={ProductsBrowsePage} />
      {/* Temporarily disabled design editor routes to fix Konva issues */}
      {/* <Route path="/editor-test" component={EditorTestPage} /> */}
      {/* <Route path="/template-test" component={TemplateTestPage} /> */}
      {/* <Route path="/background-image-test" component={BackgroundImageTestPage} /> */}
      {/* <Route path="/simple-background-test" component={SimpleBackgroundTestPage} /> */}
      {/* <Route path="/quick-sign-editor" component={QuickSignEditor} /> */}
      {/* <Route path="/sign-board-editor-demo" component={SignBoardEditorDemo} /> */}
      {/* <Route path="/enhanced-editor" component={EnhancedEditorDemo} /> */}
      {/* <Route path="/sign-editor" component={SignEditor} /> */}
      <Route path="/debug-categories" component={DebugCategoriesPage} />
      <Route path="/enhanced-editor" component={EnhancedEditorDemo} />
      {/* Editor routes removed */}
      {/* Studio / test routes removed */}
      <Route path="/product/:id" component={ProductDetailPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const { isLoading } = useLoading();
  usePageTransition(); // Handle page transitions

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <Router />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}

export default App;
