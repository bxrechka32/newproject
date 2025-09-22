// Переключение темы
document.querySelector('.theme-toggle').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Загрузка сохраненной темы
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);

// Плавное появление элементов при скролле
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Модальное окно
const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');

let lastActive = null;

openBtn?.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input')?.focus();
});

closeBtn?.addEventListener('click', () => dlg.close('cancel'));

// Маска телефона
const phone = document.getElementById('phone');
phone?.addEventListener('input', () => {
    const digits = phone.value.replace(/\D/g,'').slice(0,11);
    const d = digits.replace(/^8/, '7');
    const parts = [];
    
    if (d.length > 0) parts.push('+7');
    if (d.length > 1) parts.push(' (' + d.slice(1,4));
    if (d.length >= 4) parts[parts.length - 1] += ')';
    if (d.length >= 5) parts.push(' ' + d.slice(4,7));
    if (d.length >= 8) parts.push('-' + d.slice(7,9));
    if (d.length >= 10) parts.push('-' + d.slice(9,11));
    
    phone.value = parts.join('');
});

// Валидация формы
form?.addEventListener('submit', (e) => {
    // Сброс кастомных сообщений
    [...form.elements].forEach(el => el.setCustomValidity?.(''));
    
    if (!form.checkValidity()) {
        e.preventDefault();
        
        // Кастомные сообщения
        const email = form.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail');
        }
        
        form.reportValidity();
        
        // Подсветка ошибок
        [...form.elements].forEach(el => {
            if (el.willValidate) {
                el.toggleAttribute('aria-invalid', !el.checkValidity());
            }
        });
        return;
    }
    
    // Успешная отправка
    e.preventDefault();
    alert('Сообщение отправлено!');
    dlg.close('success');
    form.reset();
});

dlg?.addEventListener('close', () => {
    lastActive?.focus();
});




// Модальное окно NeoDesign
const contactDialog = document.getElementById('contactDialog');
const openDialogBtn = document.getElementById('openDialog');
const openDialogBtn2 = document.getElementById('openDialog2');
const closeDialogBtn = document.getElementById('closeDialog');
const cancelDialogBtn = document.getElementById('cancelDialog');
const contactForm = document.getElementById('contactForm');

let lastActiveElement = null;

// Функции для управления модалкой
function openModal() {
    lastActiveElement = document.activeElement;
    contactDialog.showModal();
    // Фокус на первое поле после анимации
    setTimeout(() => {
        contactDialog.querySelector('input')?.focus();
    }, 300);
}

function closeModal() {
    contactDialog.close();
}

// Открытие модалки
openDialogBtn?.addEventListener('click', openModal);
openDialogBtn2?.addEventListener('click', openModal);

// Закрытие модалки
closeDialogBtn?.addEventListener('click', closeModal);
cancelDialogBtn?.addEventListener('click', closeModal);

// Закрытие по клику на бэкдроп
contactDialog?.addEventListener('click', (e) => {
    if (e.target === contactDialog) {
        closeModal();
    }
});

// Маска телефона
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', (e) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    const normalized = digits.replace(/^8/, '7');
    
    if (normalized.length === 0) {
        e.target.value = '';
        return;
    }
    
    let formatted = '+7';
    if (normalized.length > 1) formatted += ` (${normalized.slice(1, 4)}`;
    if (normalized.length >= 4) formatted += ')';
    if (normalized.length >= 5) formatted += ` ${normalized.slice(4, 7)}`;
    if (normalized.length >= 8) formatted += `-${normalized.slice(7, 9)}`;
    if (normalized.length >= 10) formatted += `-${normalized.slice(9, 11)}`;
    
    e.target.value = formatted;
});

// Валидация формы
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Сброс предыдущих ошибок
    Array.from(contactForm.elements).forEach(element => {
        element.setCustomValidity?.('');
        element.removeAttribute('aria-invalid');
    });
    
    if (!contactForm.checkValidity()) {
        // Кастомные сообщения об ошибках
        const email = contactForm.elements.email;
        if (email?.validity.typeMismatch) {
            email.setCustomValidity('Пожалуйста, введите корректный email адрес');
        }
        
        const phone = contactForm.elements.phone;
        if (phone?.value && phone.validity.patternMismatch) {
            phone.setCustomValidity('Телефон должен быть в формате +7 (900) 000-00-00');
        }
        
        // Подсветка невалидных полей
        Array.from(contactForm.elements).forEach(element => {
            if (element.willValidate && !element.checkValidity()) {
                element.setAttribute('aria-invalid', 'true');
            }
        });
        
        contactForm.reportValidity();
        return;
    }
    
    // Успешная отправка
    setTimeout(() => {
        alert('✅ Сообщение успешно отправлено! Мы свяжемся с вами в течение 2 часов.');
        closeModal();
        contactForm.reset();
    }, 500);
});

// Восстановление фокуса после закрытия модалки
contactDialog?.addEventListener('close', () => {
    lastActiveElement?.focus();
});

// Плавное появление элементов
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
