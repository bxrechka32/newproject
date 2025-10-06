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
        card.style.animation = 'bounce 0.
