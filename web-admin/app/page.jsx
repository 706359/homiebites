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
import { useLanguage } from "../contexts/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  useSmoothScroll();
  useRevealAnimation();

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
