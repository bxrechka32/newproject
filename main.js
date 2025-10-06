// === СИСТЕМА ТЕМ ===
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.init();
    }
    
    init() {
        document.documentElement.setAttribute('data-theme', this.theme);
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
    
    toggle() {
        this.theme = this.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.theme);
        localStorage.setItem('theme', this.theme);
    }
}

// === МОДАЛЬНЫЕ ОКНА ===
class ModalManager {
    constructor() {
        this.modals = new Map();
        this.init();
    }
    
    init() {
        document.querySelectorAll('dialog').forEach(dialog => {
            const id = dialog.id;
            const openBtns = document.querySelectorAll(`[data-modal-open="${id}"]`);
            const closeBtn = dialog.querySelector('[data-modal-close]');
            
            if (openBtns.length > 0 && closeBtn) {
                this.modals.set(id, { dialog, openBtns, closeBtn });
                this.bindModalEvents(id);
            }
        });
    }
    
    bindModalEvents(modalId) {
        const { dialog, openBtns, closeBtn } = this.modals.get(modalId);
        
        openBtns.forEach(btn => {
            btn.addEventListener('click', () => this.open(modalId));
        });
        
        closeBtn.addEventListener('click', () => this.close(modalId));
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) this.close(modalId);
        });
        
        dialog.addEventListener('close', () => {
            this.handleClose(modalId);
        });
    }
    
    open(modalId) {
        const { dialog } = this.modals.get(modalId);
        dialog.showModal();
    }
    
    close(modalId) {
        const { dialog } = this.modals.get(modalId);
        dialog.close();
    }
    
    handleClose(modalId) {
        const { dialog } = this.modals.get(modalId);
        const form = dialog.querySelector('form');
        if (form) form.reset();
    }
}

// === ВАЛИДАЦИЯ ФОРМ ===
class FormValidator {
    constructor() {
        this.forms = new Map();
        this.init();
    }
    
    init() {
        document.querySelectorAll('form[data-validate]').forEach(form => {
            this.forms.set(form.id, form);
            this.bindFormEvents(form);
        });
    }
    
    bindFormEvents(form) {
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Валидация в реальном времени
        form.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => this.clearFieldError(field));
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
        
        // Валидация всех полей
        form.querySelectorAll('input, select, textarea').forEach(field => {
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
        
        // Здесь будет отправка на сервер
        console.log('Форма отправлена:', data);
        
        // Показываем уведомление
        this.showSuccessMessage();
        
        // Закрываем модалку если она есть
        const dialog = form.closest('dialog');
        if (dialog) {
            dialog.close();
        }
        
        form.reset();
    }
    
    showSuccessMessage() {
        alert('✅ Сообщение успешно отправлено! Мы свяжемся с вами в ближайшее время.');
    }
}

// === АНИМАЦИИ ПРИ СКРОЛЛЕ ===
class ScrollAnimator {
    constructor() {
        this.observer = null;
        this.init();
    }
    
    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate--in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        this.bindAnimations();
    }
    
    bindAnimations() {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            this.observer.observe(el);
        });
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
            input.addEventListener('keydown', (e) => this.restrictInput(e));
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
            if (value.length >= 4) formatted += ')';
            if (value.length >= 5) formatted += ` ${value.slice(4, 7)}`;
            if (value.length >= 8) formatted += `-${value.slice(7, 9)}`;
            if (value.length >= 10) formatted += `-${value.slice(9, 11)}`;
            
            e.target.value = formatted;
        }
    }
    
    restrictInput(e) {
        if (!/[0-9\b]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    }
}

// === ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ ===
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new ModalManager();
    new FormValidator();
    new ScrollAnimator();
    new PhoneMask();
    
    // Добавляем классы для анимаций при скролле
    document.querySelectorAll('.feature-card, .value-card, .contact-card, .project-card').forEach(card => {
        card.classList.add('animate-on-scroll');
    });
});

// === ПОЛИФИЛЛ ДЛЯ DIALOG (для старых браузеров) ===
if (typeof HTMLDialogElement !== 'function') {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.esm.js';
    document.head.appendChild(script);
}
