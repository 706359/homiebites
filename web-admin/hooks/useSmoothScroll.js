import { useEffect } from "react";
import { usePathname } from "next/navigation";

export const useSmoothScroll = () => {
  const pathname = usePathname();

  useEffect(() => {
    
    const handleHashScroll = () => {
      if (pathname === "/") {
        const hash = window.location.hash;
        if (hash && hash !== "#") {
          
          setTimeout(() => {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
              const headerOffset = 70;
              const elementPosition = targetElement.getBoundingClientRect().top;
              const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;

              window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
              });
            }
          }, 200);
        }
      }
    };

    
    handleHashScroll();

    
    const handleHashChange = () => {
      handleHashScroll();
    };
    window.addEventListener("hashchange", handleHashChange);

    
    const handleClick = (e) => {
      
      if (
        e.target.tagName === "BUTTON" ||
        e.target.tagName === "INPUT" ||
        e.target.closest("button") ||
        e.target.closest(".faq-question") ||
        e.target.closest(".order-modal") ||
        e.target.closest(".gallery-modal")
      ) {
        return;
      }

      
      const link = e.target.closest('a[href*="#"]');
      if (link) {
        const href = link.getAttribute("href");
        if (href && href.startsWith("/#")) {
          
          const hash = href.split("#")[1];
          if (hash) {
            
            setTimeout(() => {
              const targetElement = document.querySelector(`#${hash}`);
              if (targetElement) {
                const headerOffset = 70;
                const elementPosition =
                  targetElement.getBoundingClientRect().top;
                const offsetPosition =
                  elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
            }, 300);
          }
          return;
        }
      }

      
      const anchor = e.target.closest('a[href^="#"]');
      if (!anchor) return;

      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      
      if (pathname === "/") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          e.stopPropagation();
          const headerOffset = 70;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition =
            elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [pathname]);
};
