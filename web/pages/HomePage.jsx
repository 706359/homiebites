import { useEffect, useState } from "react";
import About from "../components/About";
import Chatbot from "../components/Chatbot";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import Features from "../components/Features";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import Header from "../components/Header";
import Hero from "../components/Hero";
import OrderModal from "../components/OrderModal";
import SpecialOffer from "../components/SpecialOffer";
import Testimonials from "../components/Testimonials";
import { useLanguage } from "../contexts/LanguageContext";
import { useNotification } from "../contexts/NotificationContext";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import "../styles/chatbot.css";

export default function HomePage() {
  const { t } = useLanguage();
  const { info } = useNotification();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useSmoothScroll();
  useRevealAnimation();

  useEffect(() => {
    // Show welcome notification on first visit
    const hasVisited = sessionStorage.getItem("homiebites_visited");
    if (!hasVisited) {
      setTimeout(() => {
        info(
          t("header.announcement") || "Free delivery on orders ₹100 and above",
        );
      }, 1000);
      sessionStorage.setItem("homiebites_visited", "true");
    }
  }, [info, t]);

  const openOrderModal = () => setIsOrderModalOpen(true);
  const closeOrderModal = () => setIsOrderModalOpen(false);

  return (
    <>
      <Header onOrderClick={openOrderModal} />
      <Hero onOrderClick={openOrderModal} />
      <Features />
      <SpecialOffer />
      <Gallery />
      <Testimonials />
      <FAQ />
      <About />
      <Contact />
      <Footer onOrderClick={openOrderModal} />
      <OrderModal isOpen={isOrderModalOpen} onClose={closeOrderModal} />
      <Chatbot />
    </>
  );
}
