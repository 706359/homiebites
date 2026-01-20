"use client";

import { useState, useEffect, Suspense, lazy } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import "../styles/chatbot.css";
import { useSmoothScroll } from "../hooks/useSmoothScroll";
import { useRevealAnimation } from "../hooks/useRevealAnimation";
import { useLanguage } from "../contexts/LanguageContext";
import PremiumLoader from "../components/PremiumLoader";

// Lazy load heavy components for better performance
const Features = lazy(() => import("../components/Features"));
const SpecialOffer = lazy(() => import("../components/SpecialOffer"));
const Gallery = lazy(() => import("../components/Gallery"));
const Testimonials = lazy(() => import("../components/Testimonials"));
const FAQ = lazy(() => import("../components/FAQ"));
const About = lazy(() => import("../components/About"));
const Contact = lazy(() => import("../components/Contact"));
const Chatbot = lazy(() => import("../components/Chatbot"));

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
      <Suspense fallback={<PremiumLoader message="Loading features..." size="small" />}>
        <Features />
      </Suspense>
      <Suspense fallback={<PremiumLoader message="Loading offers..." size="small" />}>
        <SpecialOffer />
      </Suspense>
      <Suspense fallback={<PremiumLoader message="Loading gallery..." size="small" />}>
        <Gallery />
      </Suspense>
      <Suspense fallback={<PremiumLoader message="Loading testimonials..." size="small" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<PremiumLoader message="Loading FAQ..." size="small" />}>
        <FAQ />
      </Suspense>
      <Suspense fallback={<PremiumLoader message="Loading about..." size="small" />}>
        <About />
      </Suspense>
      <Suspense fallback={<PremiumLoader message="Loading contact..." size="small" />}>
        <Contact />
      </Suspense>
      <Footer onOrderClick={handleContact} />
      <Suspense fallback={null}>
        <Chatbot />
      </Suspense>
    </>
  );
}
