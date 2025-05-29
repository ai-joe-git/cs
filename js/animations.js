// Advanced animations and interactions
(function() {
    'use strict';

    // Threat matrix animation
    function initThreatMatrixAnimation() {
        const matrixItems = document.querySelectorAll('.grid-item');
        
        if (matrixItems.length > 0) {
            // Staggered animation for matrix items
            matrixItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.2}s`;
                
                // Add hover effects
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'scale(1.05)';
                    item.style.zIndex = '10';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'scale(1)';
                    item.style.zIndex = '1';
                });
            });
        }
    }

    // Typing animation for hero title with much faster red part
    function initTypingAnimation() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        const lines = text.split('\n').filter(line => line.trim());
        
        heroTitle.innerHTML = '';
        
        lines.forEach((line, lineIndex) => {
            const lineElement = document.createElement('div');
            lineElement.className = lineIndex === 1 ? 'hero-accent' : '';
            heroTitle.appendChild(lineElement);
            
            // Type each character with different speeds
            let charIndex = 0;
            const baseDelay = 80; // Normal speed for first line
            const redLineDelay = 15; // Much faster for red part
            
            const startDelay = lineIndex === 1 ? 2000 : 0; // Start red line after 2 seconds
            
            setTimeout(() => {
                const typeInterval = setInterval(() => {
                    if (charIndex < line.length) {
                        lineElement.textContent += line[charIndex];
                        charIndex++;
                    } else {
                        clearInterval(typeInterval);
                    }
                }, lineIndex === 1 ? redLineDelay : baseDelay);
            }, startDelay);
        });
    }

    // Parallax scrolling effects
    function initParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.threat-matrix, .hero-visual');
        
        if (parallaxElements.length > 0) {
            window.addEventListener('scroll', () => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                parallaxElements.forEach(element => {
                    element.style.transform = `translateY(${rate}px)`;
                });
            });
        }
    }

    // Counter animation for statistics
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
            const increment = target / 100;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Format the number based on original format
                const originalText = counter.dataset.original || counter.textContent;
                if (originalText.includes('€')) {
                    counter.textContent = `€${Math.floor(current)}${originalText.includes('M') ? 'M' : 'K'}`;
                } else if (originalText.includes('%')) {
                    counter.textContent = `${Math.floor(current)}%`;
                } else if (originalText.includes('H')) {
                    counter.textContent = `${Math.floor(current)}H`;
                } else {
                    counter.textContent = Math.floor(current);
                }
            }, 20);
        };

        // Store original values
        counters.forEach(counter => {
            counter.dataset.original = counter.textContent;
        });

        // Intersection observer for counter animation
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // Glitch effect for critical elements
    function initGlitchEffects() {
        const criticalElements = document.querySelectorAll('.threat-critical, .problem-block.critical');
        
        criticalElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.classList.add('glitch-active');
                
                setTimeout(() => {
                    element.classList.remove('glitch-active');
                }, 500);
            });
        });
    }

    // Form field focus animations
    function initFormAnimations() {
        const formFields = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
        
        formFields.forEach(field => {
            field.addEventListener('focus', () => {
                field.parentNode.classList.add('field-focused');
            });
            
            field.addEventListener('blur', () => {
                if (!field.value) {
                    field.parentNode.classList.remove('field-focused');
                }
            });
            
            // Check if field has value on load
            if (field.value) {
                field.parentNode.classList.add('field-focused');
            }
        });
    }

    // Button hover effects
    function initButtonEffects() {
        const buttons = document.querySelectorAll('.cta-button, .form-submit, .price-cta');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'button-ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                
                button.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    // Loading states
    function initLoadingStates() {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('.form-submit');
            const originalText = submitButton.textContent;
            
            // Create loading animation
            let dots = '';
            const loadingInterval = setInterval(() => {
                dots = dots.length >= 3 ? '' : dots + '.';
                submitButton.textContent = `SECURING TRANSMISSION${dots}`;
            }, 500);
            
            // Stop loading animation after form processing
            setTimeout(() => {
                clearInterval(loadingInterval);
                submitButton.textContent = originalText;
            }, 3000);
        });
    }

    // Performance optimized scroll handler
    function initOptimizedScrollEffects() {
        let ticking = false;
        
        function updateScrollEffects() {
            const scrolled = window.pageYOffset;
            
            // Update threat matrix rotation
            const threatMatrix = document.querySelector('.threat-matrix');
            if (threatMatrix) {
                const rotation = scrolled * 0.1;
                threatMatrix.style.transform = `rotate(${rotation}deg)`;
            }
            
            ticking = false;
        }
        
        function requestScrollUpdate() {
            if (!ticking) {
                requestAnimationFrame(updateScrollEffects);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    }

    // Initialize all animations
    function initAnimations() {
        // Check for reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (!prefersReducedMotion) {
            initThreatMatrixAnimation();
            initTypingAnimation();
            initParallaxEffects();
            initCounterAnimation();
            initGlitchEffects();
            initOptimizedScrollEffects();
        } else {
            // Even with reduced motion, ensure text is visible
            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'none';
            }
        }
        
        // Always initialize these (they're essential for UX)
        initFormAnimations();
        initButtonEffects();
        initLoadingStates();
    }

    // Run animations after DOM is loaded
    document.addEventListener('DOMContentLoaded', initAnimations);

    // Handle resize events
    window.addEventListener('resize', () => {
        // Recalculate positions for responsive animations
        const threatMatrix = document.querySelector('.threat-matrix');
        if (threatMatrix) {
            threatMatrix.style.transform = 'none';
        }
    });

})();
