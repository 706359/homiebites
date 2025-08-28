(function () {
    // Create DOM-ready wrapper that works in iframes and standalone
    function createDOMContentLoadedWrapper() {
        const originalAddEventListener = document.addEventListener;
        document.addEventListener = function (event, handler, options) {
            if (event === 'DOMContentLoaded' && document.readyState !== 'loading') {
                // DOM already loaded, execute immediately
                setTimeout(handler, 0);
                return;
            }
            return originalAddEventListener.call(this, event, handler, options);
        };
    }

    // Set up wrapper if DOM is already loaded
    if (document.readyState !== 'loading') {
        createDOMContentLoadedWrapper();
    }

    // Execute custom JavaScript
    try {

        // Mobile menu toggle
        const menuBtn = document.getElementById('menuBtn');
        if (menuBtn) {
            menuBtn.addEventListener('click', () => {
                document.body.classList.toggle('menu-open');
            });
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('menu-open') &&
                !e.target.closest('.menu-btn') &&
                !e.target.closest('.nav ul')) {
                document.body.classList.remove('menu-open');
            }
        });

        // Reveal animation on scroll
        requestAnimationFrame(() => {
            document.querySelectorAll('[data-animate]').forEach(el => el.classList.add('reveal'));

            const io = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in');
                        io.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

            document.querySelectorAll('.reveal').forEach(el => io.observe(el));
        });

        // Smooth scroll for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    window.scrollTo({
                        top: targetElement.offsetTop - 70,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (document.body.classList.contains('menu-open')) {
                        document.body.classList.remove('menu-open');
                    }
                }
            });
        });

        // Testimonial slider
        const testimonialTrack = document.querySelector('.testimonial-track');
        const testimonials = document.querySelectorAll('.testimonial');
        const dots = document.querySelectorAll('.slider-dot');
        const prevArrow = document.querySelector('.prev-arrow');
        const nextArrow = document.querySelector('.next-arrow');

        if (testimonialTrack && testimonials.length > 0) {
            let currentIndex = 0;
            const slideWidth = 100; // 100%

            // Function to update slider position
            function updateSlider() {
                testimonialTrack.style.transform = `translateX(-${currentIndex * slideWidth}%)`;

                // Update active dot
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }

            // Event listeners for arrows
            if (prevArrow) {
                prevArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
                    updateSlider();
                });
            }

            if (nextArrow) {
                nextArrow.addEventListener('click', () => {
                    currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
                    updateSlider();
                });
            }

            // Event listeners for dots
            dots.forEach((dot, index) => {
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateSlider();
                });
            });

            // Auto slide (optional)
            let autoSlideInterval;

            function startAutoSlide() {
                autoSlideInterval = setInterval(() => {
                    currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
                    updateSlider();
                }, 5000);
            }

            function stopAutoSlide() {
                clearInterval(autoSlideInterval);
            }

            // Start auto slide
            startAutoSlide();

            // Pause auto slide on hover
            testimonialTrack.addEventListener('mouseenter', stopAutoSlide);
            testimonialTrack.addEventListener('mouseleave', startAutoSlide);
        }

        // FAQ Accordion
        const faqItems = document.querySelectorAll('.faq-item');

        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');

            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        });

        // Gallery image modal (lightweight)
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const imgSrc = item.querySelector('img').src;
                const caption = item.querySelector('.gallery-caption').textContent;

                // Create modal elements
                const modal = document.createElement('div');
                modal.className = 'gallery-modal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.9)';
                modal.style.display = 'flex';
                modal.style.alignItems = 'center';
                modal.style.justifyContent = 'center';
                modal.style.zIndex = '1000';
                modal.style.padding = '20px';
                modal.style.opacity = '0';
                modal.style.transition = 'opacity 0.3s ease';

                const modalContent = document.createElement('div');
                modalContent.style.maxWidth = '90%';
                modalContent.style.maxHeight = '90%';
                modalContent.style.position = 'relative';

                const modalImg = document.createElement('img');
                modalImg.src = imgSrc;
                modalImg.style.maxWidth = '100%';
                modalImg.style.maxHeight = '80vh';
                modalImg.style.borderRadius = '10px';
                modalImg.style.boxShadow = '0 5px 30px rgba(0,0,0,0.3)';

                const modalCaption = document.createElement('div');
                modalCaption.textContent = caption;
                modalCaption.style.color = 'white';
                modalCaption.style.textAlign = 'center';
                modalCaption.style.marginTop = '15px';
                modalCaption.style.fontSize = '18px';

                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '&times;';
                closeBtn.style.position = 'absolute';
                closeBtn.style.top = '-40px';
                closeBtn.style.right = '0';
                closeBtn.style.backgroundColor = 'transparent';
                closeBtn.style.border = 'none';
                closeBtn.style.color = 'white';
                closeBtn.style.fontSize = '30px';
                closeBtn.style.cursor = 'pointer';

                // Append elements
                modalContent.appendChild(modalImg);
                modalContent.appendChild(closeBtn);
                modalContent.appendChild(modalCaption);
                modal.appendChild(modalContent);
                document.body.appendChild(modal);
                document.body.style.overflow = 'hidden';

                // Fade in modal
                setTimeout(() => {
                    modal.style.opacity = '1';
                }, 10);

                // Close modal on button click
                closeBtn.addEventListener('click', closeModal);

                // Close modal on outside click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        closeModal();
                    }
                });

                // Close modal on ESC key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape') {
                        closeModal();
                    }
                });

                function closeModal() {
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        document.body.removeChild(modal);
                        document.body.style.overflow = '';
                    }, 300);
                }
            });
        });

        // Current day menu highlight
        const today = new Date().getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayName = dayNames[today];

        // Add pulse animation to primary CTA buttons after 3 seconds
        setTimeout(() => {
            const primaryButtons = document.querySelectorAll('.btn-primary');
            primaryButtons.forEach(btn => {
                if (!btn.classList.contains('pulse')) {
                    btn.classList.add('pulse');
                }
            });
        }, 3000);

        // Re-initialize Lucide icons after custom JS
        function reinitLucideAfterJS() {
            if (typeof lucide !== 'undefined' && lucide && lucide.createIcons) {
                try {
                    lucide.createIcons();
                    console.log('✅ Lucide icons initialized after custom JS');
                } catch (error) {
                    console.warn('⚠️ Failed to initialize Lucide after JS:', error);
                }
            }
        }

        if (document.readyState === 'complete') {
            setTimeout(reinitLucideAfterJS, 100);
        } else {
            document.addEventListener('DOMContentLoaded', reinitLucideAfterJS);
        }
    } catch (error) {
        console.error('Error executing custom JavaScript:', error);
    }
})();
