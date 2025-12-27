import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationWrapper from './components/NotificationWrapper';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage';
import AdminPage from './pages/AdminPage';
import ErrorPage from './pages/ErrorPage';
import FAQPage from './pages/FAQPage';
import HomePage from './pages/HomePage';
import LegalDisclaimerPage from './pages/LegalDisclaimerPage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import NotFoundPage from './pages/NotFoundPage';
import OffersPage from './pages/OffersPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import SearchPage from './pages/SearchPage';
import SupportPage from './pages/SupportPage';
import TermsOfServicePage from './pages/TermsOfServicePage';

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change, unless there's a hash
    const hash = window.location.hash;
    if (!hash || hash === '#') {
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      });
    }
  }, [location.pathname]);

  return null;
}

function HashScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation when route changes to home page
    if (location.pathname === '/') {
      const hash = window.location.hash;
      if (hash && hash !== '#') {
        // Wait for DOM to be ready
        const scrollToHash = () => {
          const targetElement = document.querySelector(hash);
          if (targetElement) {
            const headerOffset = 60;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
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
    document.documentElement.lang = language === 'hi' ? 'hi' : 'en';
  }, [language]);

  return null;
}

function AppContent() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <LanguageHandler />
        <ScrollToTop />
        <HashScrollHandler />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/menu' element={<MenuPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/account' element={<AccountPage />} />
          <Route path='/search' element={<SearchPage />} />
          <Route path='/support' element={<SupportPage />} />
          <Route path='/faq' element={<FAQPage />} />
          <Route path='/offers' element={<OffersPage />} />
          <Route path='/privacy' element={<PrivacyPolicyPage />} />
          <Route path='/terms' element={<TermsOfServicePage />} />
          <Route path='/disclaimer' element={<LegalDisclaimerPage />} />
          <Route path='/admin' element={<AdminPage />} />
          <Route path='/admin/forgot-password' element={<AdminForgotPasswordPage />} />
          <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
          <Route path='/error' element={<ErrorPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
        <NotificationWrapper />
      </NotificationProvider>
    </ErrorBoundary>
  );
}

function App() {
  useEffect(() => {
    // Global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // Prevent the default browser error handling
      event.preventDefault();
      // Log error but don't crash the app
      if (event.reason) {
        console.error('Error details:', event.reason);
      }
    };

    // Global error handler for uncaught errors
    const handleError = (event) => {
      console.error('Uncaught error:', event.error);
      // Prevent default error handling
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
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
