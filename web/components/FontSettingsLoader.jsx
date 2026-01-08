"use client";

import { useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "http://localhost:3001";

export default function FontSettingsLoader() {
  useEffect(() => {
    const applyFontSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings`);
        const data = await response.json();

        if (data.success && data.data) {
          const settings = data.data;
          const root = document.documentElement;

          // Apply font family
          if (settings.fontFamily) {
            const fontFamily = `'${settings.fontFamily}', sans-serif`;
            root.style.setProperty("--font-primary", fontFamily);
            document.body.style.fontFamily = fontFamily;

            // Load Google Font if needed
            const fontName = settings.fontFamily.replace(/\s+/g, "+");
            const existingLink = document.querySelector(
              `link[href*="fonts.googleapis.com"][href*="${fontName}"]`
            );

            if (!existingLink) {
              // Remove old font links (except Baloo 2 which might be default)
              const oldLinks = document.querySelectorAll(
                'link[href*="fonts.googleapis.com"]'
              );
              oldLinks.forEach((link) => {
                if (!link.href.includes("font-awesome")) {
                  link.remove();
                }
              });

              // Add new font link
              const link = document.createElement("link");
              link.rel = "stylesheet";
              link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700;800&display=swap`;
              document.head.appendChild(link);
            }
          }

          // Apply font size
          if (settings.fontSize) {
            const fontSizeMap = {
              small: "14px",
              medium: "16px",
              large: "18px",
              "extra-large": "20px",
            };
            const fontSize = fontSizeMap[settings.fontSize] || "16px";
            root.style.setProperty("--base-font-size", fontSize);
            document.body.style.fontSize = fontSize;
          }

          // Apply primary color
          if (settings.primaryColor) {
            root.style.setProperty("--primary-green", settings.primaryColor);
            // You can add more color variables if needed
          }

          // Apply theme (if needed for website)
          if (settings.theme) {
            if (settings.theme === "dark") {
              document.documentElement.classList.add("dark-theme");
              document.documentElement.classList.remove("light-theme");
            } else if (settings.theme === "light") {
              document.documentElement.classList.add("light-theme");
              document.documentElement.classList.remove("dark-theme");
            } else if (settings.theme === "auto") {
              const prefersDark = window.matchMedia(
                "(prefers-color-scheme: dark)"
              ).matches;
              if (prefersDark) {
                document.documentElement.classList.add("dark-theme");
                document.documentElement.classList.remove("light-theme");
              } else {
                document.documentElement.classList.add("light-theme");
                document.documentElement.classList.remove("dark-theme");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error loading font settings:", error);
        // Fallback to default font
        const root = document.documentElement;
        root.style.setProperty("--font-primary", "'Baloo 2', sans-serif");
      }
    };

    applyFontSettings();
  }, []);

  return null; // This component doesn't render anything
}

