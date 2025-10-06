// Theme Management
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.setTheme(this.currentTheme);
        this.bindEvents();
    }

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon(theme);
    }

    updateToggleIcon(theme) {
        const icon = this.themeToggle.querySelector('.theme-toggle__icon');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun theme-toggle__icon';
        } else {
            icon.className = 'fas fa-moon theme-toggle__icon';
        }
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(this.currentTheme);
    }

    bindEvents() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
}

// Progress Bar Animation
class ProgressAnimator {
    constructor() {
        this.progressBars = document.querySelectorAll('.progress__bar');
        this.init();
    }

    init() {
        this.animateOnScroll();
    }

    animateOnScroll() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width') || progressBar.style.width;
                    progressBar.style.width = `${width}%`;
                }
            });
        }, { threshold: 0.5 });

        this.progressBars.forEach(bar => observer.observe(bar));
    }
}

// Product Card Interactions
class ProductCardManager {
    constructor() {
        this.productCards = document.querySelectorAll('.product-card');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.productCards.forEach(card => {
            // Hover effects
            card.addEventListener('mouseenter', this.handleCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleCardLeave.bind(this));
            
            // Click selection
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.btn')) {
                    this.toggleCardSelection(card);
                }
            });

            // Button interactions
            const buttons = card.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.addEventListener('click', this.handleButtonClick.bind(this));
            });
        });
    }

    handleCardHover(e) {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-8px) scale(1.02)';
    }

    handleCardLeave(e) {
        const card = e.currentTarget;
        if (!card.classList.contains('product-card--selected')) {
            card.style.transform = 'translateY(0) scale(1)';
        }
    }

    toggleCardSelection(card) {
        // Remove selection from all cards
        this.productCards.forEach(c => {
            c.classList.remove('product-card--selected');
            c.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add selection to clicked card
        card.classList.add('product-card--selected');
        card.style.transform = 'translateY(-5px) scale(1.02)';
    }

    handleButtonClick(e) {
        e.stopPropagation();
        const button = e.currentTarget;
        const card = button.closest('.product-card');
        const productId = card.getAttribute('data-product-id');
        
        if (button.classList.contains('btn--primary')) {
            this.addToCart(productId, card);
        } else {
            this.showProductDetails(productId);
        }
    }

    addToCart(productId, card) {
        // Add bounce animation
        card.style.animation = 'bounce 0.5s ease';
        setTimeout(() => {
            card.style.animation = '';
        }, 500);

        // Simulate API call
        console.log(`Product ${productId} added to cart`);
        
        // Show success feedback
        this.showFeedback('Товар добавлен в корзину!', 'success');
    }

    showProductDetails(productId) {
        console.log(`Showing details for product ${productId}`);
        // In a real app, this would open a modal or navigate to product page
    }

    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback--${type}`;
        feedback.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('feedback--show');
        }, 100);
        
        setTimeout(() => {
            feedback.classList.remove('feedback--show');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 3000);
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav__link');
        this.currentSection = 'home';
        this.init();
    }

    init() {
        this.bindEvents();
        this.highlightActiveNav();
        window.addEventListener('scroll', this.throttle(this.highlightActiveNav.bind(this), 100));
    }

    bindEvents() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
            link.addEventListener('focus', this.handleNavFocus.bind(this));
            link.addEventListener('blur', this.handleNavBlur.bind(this));
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const target = e.currentTarget.getAttribute('href');
        this.navigateToSection(target);
    }

    handleNavFocus(e) {
        e.currentTarget.parentElement.classList.add('nav__item--focused');
    }

    handleNavBlur(e) {
        e.currentTarget.parentElement.classList.remove('nav__item--focused');
    }

    navigateToSection(sectionId) {
        // Smooth scroll to section
        const targetElement = document.querySelector(sectionId);
        if (targetElement) {
            targetElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    highlightActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.parentElement.classList.remove('nav__item--active');
            if (link.getAttribute('href').includes(current)) {
                link.parentElement.classList.add('nav__item--active');
            }
        });
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Form Handler
class FormHandler {
    constructor() {
        this.forms = document.querySelectorAll('.form');
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        this.forms.forEach(form => {
            form.addEventListener('submit', this.handleSubmit.bind(this));
            
            const inputs = form.querySelectorAll('.form__input, .form__textarea');
            inputs.forEach(input => {
                input.addEventListener('focus', this.handleInputFocus.bind(this));
                input.addEventListener('blur', this.handleInputBlur.bind(this));
                input.addEventListener('input', this.handleInputChange.bind(this));
            });
        });
    }

    handleSubmit(e) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        
        // Simulate form submission
        this.showLoadingState(form, true);
        
        setTimeout(() => {
            this.showLoadingState(form, false);
            this.showFeedback('Сообщение отправлено успешно!', 'success');
            form.reset();
        }, 2000);
    }

    handleInputFocus(e) {
        const input = e.currentTarget;
        input.parentElement.classList.add('form__group--focused');
    }

    handleInputBlur(e) {
        const input = e.currentTarget;
        if (!input.value) {
            input.parentElement.classList.remove('form__group--focused');
        }
        this.validateInput(input);
    }

    handleInputChange(e) {
        const input = e.currentTarget;
        this.validateInput(input);
    }

    validateInput(input) {
        const value = input.value.trim();
        const parent = input.parentElement;
        
        parent.classList.remove('form__group--valid', 'form__group--invalid');
        
        if (value === '') return;
        
        let isValid = true;
        
        if (input.type === 'email') {
            isValid = this.validateEmail(value);
        } else if (input.name === 'phone') {
            isValid = this.validatePhone(value);
        } else if (input.required) {
            isValid = value.length > 0;
        }
        
        if (isValid) {
            parent.classList.add('form__group--valid');
        } else {
            parent.classList.add('form__group--invalid');
        }
    }

    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^[\+]?[0-9\s\-\(\)]+$/;
        return re.test(phone);
    }

    showLoadingState(form, isLoading) {
        const button = form.querySelector('button[type="submit"]');
        const originalText = button.innerHTML;
        
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Отправка...
            `;
            button.classList.add('btn--loading');
        } else {
            button.disabled = false;
            button.innerHTML = originalText;
            button.classList.remove('btn--loading');
        }
    }

    showFeedback(message, type) {
        // Reuse the feedback system from ProductCardManager
        const feedback = document.createElement('div');
        feedback.className = `feedback feedback--${type}`;
        feedback.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.classList.add('feedback--show');
        }, 100);
        
        setTimeout(() => {
            feedback.classList.remove('feedback--show');
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 3000);
    }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize managers
    new ThemeManager();
    new ProgressAnimator();
    new ProductCardManager();
    new NavigationManager();
    new FormHandler();

    // Add CSS for feedback messages
    const feedbackStyles = `
        .feedback {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: var(--space-4) var(--space-5);
            border-radius: var(--radius-lg);
            color: var(--color-white);
            font-weight: var(--font-weight-medium);
            z-index: var(--z-tooltip);
            transform: translateX(400px);
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: var(--space-2);
            box-shadow: var(--shadow-xl);
        }
        
        .feedback--success {
            background: var(--color-success);
        }
        
        .feedback--error {
            background: var(--color-danger);
        }
        
        .feedback--show {
            transform: translateX(0);
        }
        
        .btn--loading {
            pointer-events: none;
            opacity: 0.8;
        }
        
        @keyframes bounce {
            0%, 20%, 60%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            80% {
                transform: translateY(-5px);
            }
        }
        
        .form__group--focused .form__label {
            color: var(--color-primary);
        }
        
        .form__group--valid .form__input,
        .form__group--valid .form__textarea {
            border-color: var(--color-success);
        }
        
        .form__group--invalid .form__input,
        .form__group--invalid .form__textarea {
            border-color: var(--color-danger);
        }
        
        .nav__item--focused .nav__link {
            outline: 2px solid var(--color-primary);
            outline-offset: 2px;
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = feedbackStyles;
    document.head.appendChild(styleSheet);

    // Add focus-visible polyfill for better accessibility
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
});

// Service Worker for PWA functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful');
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}
