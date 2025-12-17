import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import NotificationWrapper from './components/NotificationWrapper';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import AccountPage from './pages/AccountPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPage from './pages/AdminPage';
import ErrorPage from './pages/ErrorPage';
import FAQPage from './pages/FAQPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import MenuPage from './pages/MenuPage';
import NotFoundPage from './pages/NotFoundPage';
import SearchPage from './pages/SearchPage';
import SupportPage from './pages/SupportPage';

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
            const headerOffset = 70;
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
    <NotificationProvider>
      <LanguageHandler />
      <HashScrollHandler />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/menu' element={<MenuPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/account' element={<AccountPage />} />
        <Route path='/search' element={<SearchPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/faq' element={<FAQPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/admin/dashboard' element={<AdminDashboardPage />} />
        <Route path='/error' element={<ErrorPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      <NotificationWrapper />
    </NotificationProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
