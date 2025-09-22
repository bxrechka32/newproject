const dlg = document.getElementById('contactDialog');
const openBtn = document.getElementById('openDialog');
const closeBtn = document.getElementById('closeDialog');
const form = document.getElementById('contactForm');
const phoneInput = document.getElementById('phone');
let lastActive = null;

function applyPhoneMask(input) {
    let digits = input.value.replace(/\D/g, '').slice(0, 11);

    if (digits.startsWith('8') && digits.length === 11) {
        digits = '7' + digits.slice(1);
    }

    let formattedValue = '';
    if (digits.length > 0) {
        formattedValue = '+7';
        if (digits.length > 1) {
            formattedValue += ' (' + digits.slice(1, 4);
        }
        if (digits.length >= 4) {
            formattedValue += ') ' + digits.slice(4, 7);
        }
        if (digits.length >= 7) {
            formattedValue += '-' + digits.slice(7, 9);
        }
        if (digits.length >= 9) {
            formattedValue += '-' + digits.slice(9, 11);
        }
    }

    input.value = formattedValue;
}

phoneInput?.addEventListener('input', () => {
    applyPhoneMask(phoneInput);
});

openBtn?.addEventListener('click', () => {
    lastActive = document.activeElement;
    dlg.showModal();
    dlg.querySelector('input, select, textarea, button')?.focus();
});

closeBtn?.addEventListener('click', () => {
    dlg.close('cancel');
});

form?.addEventListener('submit', (e) => {
    [...form.elements].forEach(el => {
        el.setCustomValidity?.('');
        el.removeAttribute('aria-invalid');
    });

    if (!form.checkValidity()) {
        e.preventDefault();

        const email = form.elements.email;
        if (email && email.validity.typeMismatch) {
            email.setCustomValidity('Введите корректный e-mail, например name@example.com');
        }

        const phone = form.elements.phone;
        if (phone && phone.validity.patternMismatch) {
            phone.setCustomValidity('Введите номер в формате: +7 (900) 123-45-67');
        }

        form.reportValidity();

        [...form.elements].forEach(el => {
            if (el.willValidate && !el.checkValidity()) {
                el.setAttribute('aria-invalid', 'true');
            }
        });
        return;
    }

    e.preventDefault();
    alert('Форма успешно отправлена! Спасибо за ваш отзыв.');
    dlg.close('success');
    form.reset();
});

dlg?.addEventListener('close', () => {
    lastActive?.focus();
});

const themeToggle = document.getElementById('themeToggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

const currentTheme = localStorage.getItem('theme') || 
                    (prefersDarkScheme.matches ? 'dark' : 'light');

if (currentTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    themeToggle.textContent = '☀️';
} else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.textContent = '🌙';
}

themeToggle?.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    }
});


prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        if (e.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.textContent = '☀️';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeToggle.textContent = '🌙';
        }
    }
});