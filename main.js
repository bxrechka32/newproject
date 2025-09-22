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
