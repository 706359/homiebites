import { useEffect } from "react";

export const useRevealAnimation = () => {
  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const revealElements = document.querySelectorAll("[data-animate]");

      revealElements.forEach((el) => {
        // Only add reveal class if not already present
        if (!el.classList.contains("reveal")) {
          el.classList.add("reveal");
        }
        // If element already has 'in' class, keep it visible
        if (el.classList.contains("in")) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0)";
          el.style.visibility = "visible";
        }
      });

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in");
              entry.target.style.opacity = "1";
              entry.target.style.transform = "translateY(0)";
              entry.target.style.visibility = "visible";
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -10% 0px",
          threshold: 0.1,
        },
      );

      revealElements.forEach((el) => {
        // Only observe if not already visible
        if (!el.classList.contains("in")) {
          observer.observe(el);
        }
      });

      return () => {
        revealElements.forEach((el) => observer.unobserve(el));
      };
    }, 100);

    return () => clearTimeout(timer);
  }, []);
};
