"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import SpecialOffer from "../components/SpecialOffer";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import "../styles/chatbot.css";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useNotification } from "../contexts/NotificationContext";
import { useLanguage } from "../contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();
  const { info } = useNotification();

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

  const handleContact = () => {
    window.open('https://wa.me/919958983578', '_blank', 'noopener');
  };

  return (
    <>
      <Header onOrderClick={handleContact} />
      <Hero onOrderClick={handleContact} />
      <Features />
      <SpecialOffer />
      <Gallery />
      <Testimonials />
      <FAQ />
      <About />
      <Contact />
      <Footer onOrderClick={handleContact} />
      <Chatbot />
    </>
  );
}
