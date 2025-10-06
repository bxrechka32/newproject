// === СИСТЕМА ТЕМ ===
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        this.applyTheme(this.theme);
        this.bindEvents();
    }
    
    bindEvents() {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggle();
            });
        }
    }
    
    applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateToggleIcon(theme);
    }
    
    updateToggleIcon(theme) {
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            if (theme === 'dark') {
                themeToggle.innerHTML = '☀️';
            } else {
                themeToggle.innerHTML = '🌓';
            }
        }
    }
    
    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.theme);
    }
}

// === МОДАЛЬНЫЕ ОКНА ===
class ModalManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindModalEvents();
    }
    
    bindModalEvents() {
        // Обработка открытия модальных окон
        document.querySelectorAll('[data-modal-open]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modalId = button.getAttribute('data-modal-open');
                this.openModal(modalId);
            });
        });
        
        // Обработка закрытия модальных окон
        document.querySelectorAll('[data-modal-close]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const modal = button.closest('dialog');
                this.closeModal(modal);
            });
        });
        
        // Закрытие по клику на backdrop
        document.querySelectorAll('dialog').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }
    
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.showModal();
            document.body.style.overflow = 'hidden';
        }
    }
    
    closeModal(modal) {
        if (modal) {
            modal.close();
            document.body.style.overflow = '';
        }
    }
}

// === ПРОГРЕСС БАРЫ ===
class ProgressBars {
    constructor() {
        this.init();
    }
    
    init() {
        this.animateProgressBars();
    }
    
    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress__bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width') || '0';
                    setTimeout(() => {
                        progressBar.style.width = width + '%';
                    }, 300);
                }
            });
        }, { threshold: 0.5 });
        
        progressBars.forEach(bar => {
            bar.style.width = '0%'; // Начальное состояние
            observer.observe(bar);
        });
    }
}

// === ВАЛИДАЦИЯ ФОРМ ===
class FormValidator {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindFormEvents();
    }
    
    bindFormEvents() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('blur', () => this.validateField(field));
                field.addEventListener('input', () => this.clearFieldError(field));
            });
        });
    }
    
    validateField(field) {
        this.clearFieldError(field);
        
        if (!field.checkValidity()) {
            this.showFieldError(field);
            return false;
        }
        
        return true;
    }
    
    showFieldError(field) {
        field.classList.add('field--error');
        const errorMsg = field.validationMessage || 'Пожалуйста, заполните это поле правильно';
        
        let errorElement = field.parentNode.querySelector('.field__error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field__error';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = errorMsg;
    }
    
    clearFieldError(field) {
        field.classList.remove('field--error');
        const errorElement = field.parentNode.querySelector('.field__error');
        if (errorElement) errorElement.remove();
    }
    
    handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        let isValid = true;
        
        form.querySelectorAll('input, textarea, select').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.submitForm(form);
        }
    }
    
    submitForm(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        console.log('Форма отправлена:', data);
        this.showSuccessMessage();
        
        const modal = form.closest('dialog');
        if (modal) {
            modal.close();
        }
        
        form.reset();
    }
    
    showSuccessMessage() {
        alert('✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
    }
}

// === МАСКА ТЕЛЕФОНА ===
class PhoneMask {
    constructor() {
        this.init();
    }
    
    init() {
        document.querySelectorAll('input[type="tel"]').forEach(input => {
            input.addEventListener('input', (e) => this.formatPhone(e));
            input.placeholder = '+7 (___) ___-__-__';
        });
    }
    
    formatPhone(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }
        
        if (value.startsWith('7')) {
            value = value.slice(0, 11);
            let formatted = '+7';
            
            if (value.length > 1) formatted += ` (${value.slice(1, 4)}`;
            if (value.length >= 4) formatted += `) ${value.slice(4, 7)}`;
            if (value.length >= 7) formatted += `-${value.slice(7, 9)}`;
            if (value.length >= 9) formatted += `-${value.slice(9, 11)}`;
            
            e.target.value = formatted;
        }
    }
}

// === АНИМАЦИИ ПРИ СКРОЛЛЕ ===
class ScrollAnimator {
    constructor() {
        this.init();
    }
    
    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate--in');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// === ИНИЦИАЛИЗАЦИЯ ВСЕГО ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('Инициализация приложения...');
    
    // Инициализация всех систем
    new ThemeManager();
    new ModalManager();
    new ProgressBars();
    new FormValidator();
    new PhoneMask();
    new ScrollAnimator();
    
    // Добавляем классы для анимаций
    document.querySelectorAll('.feature-card, .project-card, .product-card, .value-card').forEach(card => {
        card.classList.add('animate-on-scroll');
    });
    
    console.log('Приложение инициализировано!');
});

// Полифилл для старых браузеров
if (typeof HTMLDialogElement !== 'function') {
    console.log('Загрузка полифилла для dialog...');
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.esm.js';
    document.head.appendChild(script);
}
