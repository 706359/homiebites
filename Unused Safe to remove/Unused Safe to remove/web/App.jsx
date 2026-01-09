import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import NotificationWrapper from "./components/NotificationWrapper";
import { LanguageProvider, useLanguage } from "./contexts/LanguageContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminForgotPasswordPage from "./pages/AdminForgotPasswordPage";
import AdminPage from "./pages/AdminPage";
import ErrorPage from "./pages/ErrorPage";
import FAQPage from "./pages/FAQPage";
import HomePage from "./pages/HomePage";
import LegalDisclaimerPage from "./pages/LegalDisclaimerPage";
import MenuPage from "./pages/MenuPage";
import NotFoundPage from "./pages/NotFoundPage";
import OffersPage from "./pages/OffersPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SearchPage from "./pages/SearchPage";
import TermsOfServicePage from "./pages/TermsOfServicePage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change, unless there's a hash
    const hash = window.location.hash;
    if (!hash || hash === "#") {
      window.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, [location.pathname]);

  return null;
}

function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when route changes to home page
    if (location.pathname === "/") {
      const hash = window.location.hash;
      if (hash && hash !== "#") {
        // Wait for DOM to be ready
        const scrollToHash = () => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            const headerOffset = 60;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
            return true;
          }
          return false;
        };

        // Try immediately, then retry with delays if needed
        if (!scrollToHash()) {
          setTimeout(() => {
            if (!scrollToHash()) {
              setTimeout(scrollToHash, 300);
            }
          }, 100);
        }
      }
    }
  }, [location]);

  return null;
}

function LanguageHandler() {
  const { language } = useLanguage();

  useEffect(() => {
    // Update HTML lang attribute based on selected language
    document.documentElement.lang = language === "hi" ? "hi" : "en";
  }, [language]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LanguageHandler />
        <ScrollToTop />
        <HashScrollHandler />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/disclaimer" element={<LegalDisclaimerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/admin/forgot-password"
            element={<AdminForgotPasswordPage />}
          />
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <NotificationWrapper />
        {/* Site Footer - Hidden on admin routes */}
        {!isAdminRoute && (
          <footer className="app-footer">
            This website made by Oscillate Infotech
          </footer>
        )}
      </NotificationProvider>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    // Enhanced global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);

      // Prevent the default browser error handling and window crash
      event.preventDefault();
      event.stopPropagation();

      // Log error details safely
      try {
        if (event.reason) {
          console.error("Error details:", event.reason);
          if (event.reason.stack) {
            console.error("Stack trace:", event.reason.stack);
          }
        }
      } catch (logError) {
        console.error("Error logging failed:", logError);
      }

      // Return false to prevent further error propagation
      return false;
    };

    // Enhanced global error handler for uncaught errors
    const handleError = (event) => {
      console.error("Uncaught error:", event.error);

      // Prevent default error handling and window crash
      event.preventDefault();
      event.stopPropagation();

      // Log error details safely
      try {
        if (event.error) {
          console.error("Error object:", event.error);
          if (event.error.stack) {
            console.error("Stack trace:", event.error.stack);
          }
        }
        if (event.message) {
          console.error("Error message:", event.message);
        }
        if (event.filename) {
          console.error(
            "Error in file:",
            event.filename,
            "at line",
            event.lineno,
          );
        }
      } catch (logError) {
        console.error("Error logging failed:", logError);
      }

      // Return false to prevent further error propagation
      return false;
    };

    // Handle console errors (for additional safety)
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      // Don't crash on console errors
    };

    // Add all error listeners with capture phase for maximum coverage
    window.addEventListener(
      "unhandledrejection",
      handleUnhandledRejection,
      true,
    );
    window.addEventListener("error", handleError, true);

    // Also handle React error boundaries at window level
    window.addEventListener("react-error", handleError, true);

    return () => {
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection,
        true,
      );
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("react-error", handleError, true);
      console.error = originalConsoleError;
    };
  }, []);

  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
