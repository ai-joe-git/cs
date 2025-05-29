// Main JavaScript functionality
(function() {
    'use strict';

    // DOM elements
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const contactForm = document.querySelector('.contact-form');
    const ctaButtons = document.querySelectorAll('.cta-button, .price-cta');

    // Navigation functionality - No background change on scroll
    function initNavigation() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const body = document.body;

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
                
                navToggle.setAttribute('aria-expanded', !isExpanded);
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (!isExpanded) {
                    body.style.overflow = 'hidden';
                    body.style.position = 'fixed';
                    body.style.width = '100%';
                    body.style.top = `-${window.scrollY}px`;
                } else {
                    const scrollY = body.style.top;
                    body.style.overflow = '';
                    body.style.position = '';
                    body.style.width = '';
                    body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            });

            // Close menu when clicking on links
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    const scrollY = body.style.top;
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                    body.style.position = '';
                    body.style.width = '';
                    body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                });
            });

            // Close menu when clicking outside (only on menu area)
            navMenu.addEventListener('click', (e) => {
                if (e.target === navMenu) {
                    const scrollY = body.style.top;
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                    body.style.position = '';
                    body.style.width = '';
                    body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && navMenu.classList.contains('active')) {
                    const scrollY = body.style.top;
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.style.overflow = '';
                    body.style.position = '';
                    body.style.width = '';
                    body.style.top = '';
                    window.scrollTo(0, parseInt(scrollY || '0') * -1);
                }
            });
        }

        // Navigation stays the same color - no scroll color change
    }

    // Smooth scrolling for anchor links
    function initSmoothScrolling() {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        
        anchorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerOffset = 80; // Account for fixed nav
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    const navToggle = document.querySelector('.nav-toggle');
                    const navMenu = document.querySelector('.nav-menu');
                    const body = document.body;
                    
                    if (navMenu && navMenu.classList.contains('active')) {
                        const scrollY = body.style.top;
                        navToggle.setAttribute('aria-expanded', 'false');
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        body.style.overflow = '';
                        body.style.position = '';
                        body.style.width = '';
                        body.style.top = '';
                    }
                }
            });
        });
    }

    // Form handling
    function initFormHandling() {
        if (contactForm) {
            contactForm.addEventListener('submit', handleFormSubmission);
            
            // Real-time validation
            const inputs = contactForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
        }
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        // Validate all fields
        const isValid = validateForm();
        
        if (isValid) {
            // Show loading state
            const submitButton = contactForm.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'SECURING TRANSMISSION...';
            submitButton.disabled = true;

            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                showSuccessMessage();
                contactForm.reset();
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 2000);
        }
    }

    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        const fieldType = field.type;
        let isValid = true;
        let errorMessage = '';

        // Clear previous errors
        clearFieldError({ target: field });

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Please enter a valid email address';
                isValid = false;
            }
        }
        // Phone validation
        else if (fieldType === 'tel' && value) {
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                errorMessage = 'Please enter a valid phone number';
                isValid = false;
            }
        }

        if (!isValid) {
            showFieldError(field, errorMessage);
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        // Create or update error message
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.setAttribute('role', 'alert');
            field.parentNode.appendChild(errorElement);
        }
        errorElement.textContent = message;
    }

    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
    }

    function showSuccessMessage() {
        // Create success overlay
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-message">
                <h3>SECURE TRANSMISSION COMPLETE</h3>
                <p>Your audit request has been encrypted and transmitted securely. Our team will contact you within 24 hours using your preferred secure communication method.</p>
                <button class="success-close">CLOSE</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Close success message
        overlay.querySelector('.success-close').addEventListener('click', () => {
            overlay.remove();
        });
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 5000);
    }

    // Intersection Observer for animations
    function initScrollAnimations() {
        // Different settings for mobile and desktop
        const isMobile = window.innerWidth <= 768;
        
        const observerOptions = {
            threshold: isMobile ? 0.1 : 0.2, // Lower threshold for mobile
            rootMargin: isMobile ? '0px 0px 50px 0px' : '0px 0px -20px 0px' // Earlier trigger on mobile
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Longer delay for mobile to see animations better
                    const delay = isMobile ? index * 300 : index * 150;
                    setTimeout(() => {
                        entry.target.classList.add('revealed');
                    }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.problem-block, .process-step, .threat-card, .stat-block'
        );
        
        animateElements.forEach(el => {
            el.classList.add('reveal-element');
            observer.observe(el);
        });

        // Re-initialize on resize
        window.addEventListener('resize', () => {
            // Reinitialize with new settings if screen size changes
            if ((window.innerWidth <= 768) !== isMobile) {
                location.reload(); // Simple solution for responsive changes
            }
        });
    }

    // Performance monitoring
    function initPerformanceMonitoring() {
        // Monitor Core Web Vitals
        if ('web-vital' in window) {
            // This would integrate with a real performance monitoring service
            console.log('Performance monitoring initialized');
        }

        // Monitor form interactions
        if (contactForm) {
            const startTime = Date.now();
            contactForm.addEventListener('submit', () => {
                const completionTime = Date.now() - startTime;
                // Log form completion time for UX analysis
                console.log(`Form completion time: ${completionTime}ms`);
            });
        }
    }

    // Security features
    function initSecurityFeatures() {
        // Disable right-click context menu (basic protection)
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });

        // Disable text selection on sensitive elements
        const sensitiveElements = document.querySelectorAll('.price, .stat-number');
        sensitiveElements.forEach(el => {
            el.style.userSelect = 'none';
            el.style.webkitUserSelect = 'none';
        });

        // Basic bot detection
        let mouseMovements = 0;
        document.addEventListener('mousemove', () => {
            mouseMovements++;
        });

                // Check for human-like behavior before form submission
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                if (mouseMovements < 10) {
                    console.warn('Potential bot detected');
                    // In production, this would trigger additional verification
                }
            });
        }
    }

    // Accessibility enhancements
    function initAccessibilityFeatures() {
        // Manage focus for keyboard users
        const focusableElements = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const firstFocusableElement = document.querySelector(focusableElements);
        const lastFocusableElement = document.querySelectorAll(focusableElements)[document.querySelectorAll(focusableElements).length - 1];

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstFocusableElement) {
                        e.preventDefault();
                        lastFocusableElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastFocusableElement) {
                        e.preventDefault();
                        firstFocusableElement.focus();
                    }
                }
            }
        });

        // ARIA live region for dynamic content updates
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        document.body.appendChild(liveRegion);

        // Announce form submission success
        if (contactForm) {
            contactForm.addEventListener('submit', () => {
                liveRegion.textContent = 'Form submitted successfully. We will contact you shortly.';
            });
        }

        // High contrast mode toggle
        const highContrastToggle = document.createElement('button');
        highContrastToggle.textContent = 'Toggle High Contrast';
        highContrastToggle.className = 'high-contrast-toggle sr-only';
        highContrastToggle.addEventListener('focus', () => {
            highContrastToggle.classList.remove('sr-only');
        });
        highContrastToggle.addEventListener('blur', () => {
            highContrastToggle.classList.add('sr-only');
        });
        highContrastToggle.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
        });
        document.body.appendChild(highContrastToggle);
    }

    // Initialize all features
    function init() {
        initNavigation();
        initSmoothScrolling();
        initFormHandling();
        initScrollAnimations();
        initPerformanceMonitoring();
        initSecurityFeatures();
        initAccessibilityFeatures();
    }

    // Run init on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', init);

    // Handle page visibility changes for performance
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Pause animations when page is hidden
            document.body.classList.add('paused');
        } else {
            // Resume animations when page is visible
            document.body.classList.remove('paused');
        }
    });

})();
