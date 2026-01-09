"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLanguage } from "../contexts/LanguageContext";
import { getOffersDataSync } from "../lib/offersData";
import "./Header.css";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = ({ onOrderClick }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location, setLocation] = useState("Panchsheel Greens");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [hasActiveOffers, setHasActiveOffers] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleNavClick = () => {
    closeMenu();
  };

  const handleHashLink = (e, hash) => {
    e.preventDefault();
    closeMenu();
    if (pathname === "/") {
      // Already on home page, just scroll
      setTimeout(() => {
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
        }
      }, 50);
    } else {
      // Navigate to home first, then scroll after navigation
      router.push("/");
      setTimeout(() => {
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
        }
      }, 300);
    }
  };

  useEffect(() => {
    // Check if there are active offers
    const checkOffers = () => {
      const offers = getOffersDataSync();
      setHasActiveOffers(offers.length > 0);
    };

    checkOffers();

    // Listen for offers updates
    const handleOffersUpdate = () => {
      checkOffers();
    };

    window.addEventListener("offersDataUpdated", handleOffersUpdate);
    return () => {
      window.removeEventListener("offersDataUpdated", handleOffersUpdate);
    };
  }, []);

  useEffect(() => {
    // Check for saved location first
    const savedLocation = localStorage.getItem("homiebites_location");
    if (savedLocation) {
      setLocation(savedLocation);
    }

    // Auto-detect location on mount
    detectLocation();
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      return;
    }

    setIsDetectingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // Use reverse geocoding to get location name
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
          );

          if (response.ok) {
            const data = await response.json();
            const locality =
              data.locality ||
              data.city ||
              data.principalSubdivision ||
              "Your Location";
            setLocation(locality);

            // Save to localStorage
            localStorage.setItem("homiebites_location", locality);
          } else {
            // Fallback: Check if location is near Panchsheel Greens
            const distance = calculateDistance(
              latitude,
              longitude,
              28.5431,
              77.25,
            ); // Approximate Panchsheel Greens coordinates
            if (distance < 5) {
              // Within 5km
              setLocation("Panchsheel Greens");
            } else {
              setLocation("Your Location");
            }
          }
        } catch (error) {
          console.error("Error detecting location:", error);
          // Check saved location
          const savedLocation = localStorage.getItem("homiebites_location");
          if (savedLocation) {
            setLocation(savedLocation);
          }
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        // Handle different geolocation error types
        let errorMessage = "Location detection failed";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            // User denied location permission - this is expected, don't log as error
            errorMessage = "Location permission denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
          default:
            errorMessage = "Unknown location error";
            break;
        }
        
        // Only log non-permission errors to console
        if (error.code !== error.PERMISSION_DENIED) {
          console.warn("Geolocation error:", errorMessage, error);
        }
        
        // Check saved location
        const savedLocation = localStorage.getItem("homiebites_location");
        if (savedLocation) {
          setLocation(savedLocation);
        }
        setIsDetectingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 300000, // Cache for 5 minutes
      },
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <header>
      {/* Top Announcement Bar */}
      <div className="header-top-bar">
        <div className="top-bar-content">
          <span className="announcement">{t("header.announcement")}</span>
          <div className="top-bar-right">
            <LanguageSwitcher />
            <div
              className="region-selector"
              onClick={detectLocation}
              title="Click to update location"
            >
              {isDetectingLocation ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-location-dot"></i>
                  <span>{location}</span>
                  <i className="fa-solid fa-chevron-down"></i>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <Link href="/" className="brand-logo" onClick={handleNavClick}>
            <img
              src="/logo.png"
              alt="HomieBites"
              className="logo-img"
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "block";
              }}
            />
            <span className="brand-name-fallback" style={{ display: "none" }}>
              HOMIEBITES
            </span>
          </Link>
        </div>

        <div className="nav-right">
          <Link href="/" onClick={handleNavClick}>
            {t("common.home")}
          </Link>
          <a href="/#about" onClick={(e) => handleHashLink(e, "#about")}>
            {t("common.about")}
          </a>
          <a href="/#gallery" onClick={(e) => handleHashLink(e, "#gallery")}>
            {t("header.gallery") || "Gallery"}
          </a>
          <Link href="/faq" onClick={handleNavClick}>
            {t("header.faq")}
          </Link>
          <a
            href="https://wa.me/919958983578"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-icon cart-icon"
            aria-label="Contact us on WhatsApp"
            title="Contact us on WhatsApp"
          ></a>
          <button
            className={`menu-btn ${isMenuOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <i className="fa-solid fa-bars menu-icon"></i>
            <i className="fa-solid fa-xmark close-icon"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
        <a href="/#gallery" onClick={(e) => handleHashLink(e, "#gallery")}>
          {t("header.menu")}
        </a>
        <Link href="/" onClick={handleNavClick}>
          {t("common.home")}
        </Link>
        <a href="/#about" onClick={(e) => handleHashLink(e, "#about")}>
          {t("common.about")}
        </a>
        <a href="/#gallery" onClick={(e) => handleHashLink(e, "#gallery")}>
          {t("header.gallery") || "Gallery"}
        </a>
        <Link href="/search" onClick={handleNavClick}>
          {t("header.search")}
        </Link>
        {hasActiveOffers && (
          <Link href="/offers" onClick={handleNavClick}>
            {t("header.offers") || "Offers"}
          </Link>
        )}
        <Link href="/faq" onClick={handleNavClick}>
          {t("header.faq")}
        </Link>
        <a
          href="https://wa.me/919958983578"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-small"
          onClick={handleNavClick}
        >
          {t("header.subscribe")}
        </a>
      </div>
    </header>
  );
};

export default Header;
