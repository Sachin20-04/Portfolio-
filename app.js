// Portfolio JavaScript - Sachin Bharti
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather Icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    // Theme Management
    class ThemeManager {
        constructor() {
            this.themeToggle = document.getElementById('theme-toggle');
            this.currentTheme = localStorage.getItem('theme') || 'light';
            this.init();
        }

        init() {
            this.setTheme(this.currentTheme);
            this.themeToggle?.addEventListener('click', () => this.toggleTheme());
        }

        setTheme(theme) {
            document.documentElement.setAttribute('data-color-scheme', theme);
            localStorage.setItem('theme', theme);
            this.currentTheme = theme;
        }

        toggleTheme() {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
        }
    }

    // Navigation Management
    class NavigationManager {
        constructor() {
            this.header = document.getElementById('header');
            this.navToggle = document.getElementById('nav-toggle');
            this.navMenu = document.getElementById('nav-menu');
            this.navLinks = document.querySelectorAll('.nav__link');
            this.sections = document.querySelectorAll('section[id]');
            this.init();
        }

        init() {
            this.setupScrollHeader();
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.setupActiveNavigation();
        }

        setupScrollHeader() {
            let lastScrollY = window.scrollY;

            window.addEventListener('scroll', () => {
                const currentScrollY = window.scrollY;
                
                if (currentScrollY > 100) {
                    this.header?.classList.add('scrolled');
                } else {
                    this.header?.classList.remove('scrolled');
                }
                
                lastScrollY = currentScrollY;
            });
        }

        setupMobileMenu() {
            this.navToggle?.addEventListener('click', () => {
                this.navMenu?.classList.toggle('active');
                const isOpen = this.navMenu?.classList.contains('active');
                this.navToggle.setAttribute('aria-expanded', isOpen);
            });

            // Close mobile menu when clicking on a link
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    this.navMenu?.classList.remove('active');
                    this.navToggle?.setAttribute('aria-expanded', 'false');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!this.navMenu?.contains(e.target) && !this.navToggle?.contains(e.target)) {
                    this.navMenu?.classList.remove('active');
                    this.navToggle?.setAttribute('aria-expanded', 'false');
                }
            });
        }

        setupSmoothScrolling() {
            this.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href?.startsWith('#')) {
                        e.preventDefault();
                        const targetId = href.substring(1);
                        const targetSection = document.getElementById(targetId);
                        
                        if (targetSection) {
                            const headerHeight = this.header?.offsetHeight || 0;
                            const targetPosition = targetSection.offsetTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        }

        setupActiveNavigation() {
            const observerOptions = {
                root: null,
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        this.updateActiveNavLink(sectionId);
                    }
                });
            }, observerOptions);

            this.sections.forEach(section => {
                observer.observe(section);
            });
        }

        updateActiveNavLink(activeSectionId) {
            this.navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${activeSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    }

    // Animation Manager
    class AnimationManager {
        constructor() {
            this.animatedElements = document.querySelectorAll('.animate-on-scroll');
            this.init();
        }

        init() {
            this.setupScrollAnimations();
            this.setupSkillHoverEffects();
        }

        setupScrollAnimations() {
            const observerOptions = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                    }
                });
            }, observerOptions);

            // Add animation class to elements that should animate
            const elementsToAnimate = [
                '.hero__content',
                '.about__content',
                '.skill__category',
                '.project__card',
                '.achievement__item',
                '.contact__content'
            ];

            elementsToAnimate.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    element.classList.add('animate-on-scroll');
                    element.style.transitionDelay = `${index * 0.1}s`;
                    observer.observe(element);
                });
            });
        }

        setupSkillHoverEffects() {
            const skillItems = document.querySelectorAll('.skill__item');
            
            skillItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-4px) scale(1.02)';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(0) scale(1)';
                });
            });
        }
    }

    // Contact Form Manager
    class ContactFormManager {
        constructor() {
            this.form = document.getElementById('contact-form');
            this.init();
        }

        init() {
            this.form?.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        handleSubmit(e) {
            e.preventDefault();
            
            const formData = new FormData(this.form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                message: formData.get('message')
            };

            // Basic validation
            if (!this.validateForm(data)) {
                return;
            }

            // Simulate form submission
            this.showSubmissionFeedback();
        }

        validateForm(data) {
            const errors = [];

            if (!data.name?.trim()) {
                errors.push('Name is required');
            }

            if (!data.email?.trim()) {
                errors.push('Email is required');
            } else if (!this.isValidEmail(data.email)) {
                errors.push('Please enter a valid email address');
            }

            if (!data.message?.trim()) {
                errors.push('Message is required');
            }

            if (errors.length > 0) {
                this.showErrors(errors);
                return false;
            }

            return true;
        }

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        showErrors(errors) {
            // Remove existing error messages
            this.clearErrorMessages();

            // Create error container
            const errorContainer = document.createElement('div');
            errorContainer.className = 'form-errors';
            errorContainer.style.cssText = `
                background: rgba(var(--color-error-rgb), 0.1);
                border: 1px solid rgba(var(--color-error-rgb), 0.2);
                color: var(--color-error);
                padding: var(--space-12);
                border-radius: var(--radius-base);
                margin-bottom: var(--space-16);
                font-size: var(--font-size-sm);
            `;

            const errorList = document.createElement('ul');
            errorList.style.cssText = 'margin: 0; padding-left: var(--space-16);';
            
            errors.forEach(error => {
                const li = document.createElement('li');
                li.textContent = error;
                errorList.appendChild(li);
            });

            errorContainer.appendChild(errorList);
            this.form.insertBefore(errorContainer, this.form.firstChild);

            // Auto-remove after 5 seconds
            setTimeout(() => {
                this.clearErrorMessages();
            }, 5000);
        }

        showSubmissionFeedback() {
            this.clearErrorMessages();
            
            const successContainer = document.createElement('div');
            successContainer.className = 'form-success';
            successContainer.style.cssText = `
                background: rgba(var(--color-success-rgb), 0.1);
                border: 1px solid rgba(var(--color-success-rgb), 0.2);
                color: var(--color-success);
                padding: var(--space-16);
                border-radius: var(--radius-base);
                margin-bottom: var(--space-16);
                text-align: center;
                font-weight: var(--font-weight-medium);
            `;
            
            successContainer.innerHTML = `
                <p style="margin: 0;">
                    <i data-feather="check-circle" style="width: 20px; height: 20px; margin-right: var(--space-8);"></i>
                    Thank you for your message! I'll get back to you soon.
                </p>
            `;

            this.form.insertBefore(successContainer, this.form.firstChild);
            
            // Re-initialize feather icons for the new icon
            if (typeof feather !== 'undefined') {
                feather.replace();
            }

            // Reset form
            this.form.reset();

            // Auto-remove success message after 5 seconds
            setTimeout(() => {
                successContainer.remove();
            }, 5000);
        }

        clearErrorMessages() {
            const existingErrors = this.form.querySelectorAll('.form-errors, .form-success');
            existingErrors.forEach(error => error.remove());
        }
    }

    // Utility Functions
    class Utils {
        static debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }

        static throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    }

    // Performance Optimizations
    class PerformanceManager {
        constructor() {
            this.init();
        }

        init() {
            this.optimizeScrollEvents();
            this.setupLazyLoading();
        }

        optimizeScrollEvents() {
            // Throttle scroll events for better performance
            const throttledScrollHandler = Utils.throttle(() => {
                // Any additional scroll handling can go here
            }, 16); // ~60fps

            window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        }

        setupLazyLoading() {
            // Setup lazy loading for images if needed in the future
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            if (img.dataset.src) {
                                img.src = img.dataset.src;
                                img.classList.remove('lazy');
                                imageObserver.unobserve(img);
                            }
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        }
    }

    // Accessibility Enhancements
    class AccessibilityManager {
        constructor() {
            this.init();
        }

        init() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupAriaLabels();
        }

        setupKeyboardNavigation() {
            // Enhanced keyboard navigation
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    // Close mobile menu on escape
                    const navMenu = document.getElementById('nav-menu');
                    const navToggle = document.getElementById('nav-toggle');
                    if (navMenu?.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle?.setAttribute('aria-expanded', 'false');
                        navToggle?.focus();
                    }
                }
            });
        }

        setupFocusManagement() {
            // Trap focus in mobile menu when open
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            
            navToggle?.addEventListener('click', () => {
                setTimeout(() => {
                    if (navMenu?.classList.contains('active')) {
                        const firstLink = navMenu.querySelector('.nav__link');
                        firstLink?.focus();
                    }
                }, 100);
            });
        }

        setupAriaLabels() {
            // Ensure proper ARIA labels are set
            const themeToggle = document.getElementById('theme-toggle');
            const navToggle = document.getElementById('nav-toggle');
            
            if (themeToggle) {
                themeToggle.setAttribute('aria-label', 'Toggle dark/light theme');
            }
            
            if (navToggle) {
                navToggle.setAttribute('aria-label', 'Toggle navigation menu');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        }
    }

    // Initialize all managers
    const themeManager = new ThemeManager();
    const navigationManager = new NavigationManager();
    const animationManager = new AnimationManager();
    const contactFormManager = new ContactFormManager();
    const performanceManager = new PerformanceManager();
    const accessibilityManager = new AccessibilityManager();

    // Add some initial animations
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        heroContent.classList.add('fade-in-up');
    }

    // Smooth reveal of sections on load
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);

    // Add loading state management
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Re-initialize feather icons after everything is loaded
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
    });

    // Handle reduced motion preferences
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--duration-fast', '0ms');
        document.documentElement.style.setProperty('--duration-normal', '0ms');
    }

    // Console greeting for developers
    console.log(`
    🚀 Sachin Bharti's Portfolio
    ━━━━━━━━━━━━━━━━━━━━━━━━━━
    Built with modern web technologies
    Email: bhartisachin743@gmail.com
    GitHub: https://github.com/Sachin20-04
    ━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});