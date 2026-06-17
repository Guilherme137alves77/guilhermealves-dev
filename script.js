const WHATSAPP_NUMBER = '5511992546456';

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initQuoteForm();
    initSmoothScroll();
});

function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    if (!hamburger || !navLinks) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function initScrollAnimations() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item');

    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), index * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const href = anchor.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            const offset = 64;
            window.scrollTo({
                top: target.offsetTop - offset,
                behavior: 'smooth'
            });
        });
    });
}

function initQuoteForm() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        clearErrors(form);

        const data = {
            nome: form.nome.value.trim(),
            whatsapp: form.whatsapp.value.trim(),
            empresa: form.empresa.value.trim(),
            servico: form.servico.value,
            investimento: form.investimento.value,
            prazo: form.prazo.value,
            descricao: form.descricao.value.trim()
        };

        const errors = validateForm(data);
        if (errors.length > 0) {
            errors.forEach(({ field }) => {
                const input = form.elements[field];
                if (input) input.classList.add('error');
            });
            showNotification(errors[0].message, 'error');
            return;
        }

        const message = buildWhatsAppMessage(data);
        const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        window.open(url, '_blank');
        showNotification('Redirecionando para o WhatsApp...', 'success');
        form.reset();
    });

    form.querySelectorAll('input, select, textarea').forEach(field => {
        const clear = () => field.classList.remove('error');
        field.addEventListener('input', clear);
        field.addEventListener('change', clear);
    });
}

function validateForm(data) {
    const errors = [];

    if (!data.nome) {
        errors.push({ field: 'nome', message: 'Informe seu nome completo.' });
    }

    if (!data.whatsapp) {
        errors.push({ field: 'whatsapp', message: 'Informe seu WhatsApp.' });
    } else if (!isValidPhone(data.whatsapp)) {
        errors.push({ field: 'whatsapp', message: 'Informe um número válido.' });
    }

    if (!data.servico) {
        errors.push({ field: 'servico', message: 'Selecione o tipo de serviço.' });
    }

    if (!data.investimento) {
        errors.push({ field: 'investimento', message: 'Selecione a faixa de investimento.' });
    }

    if (!data.prazo) {
        errors.push({ field: 'prazo', message: 'Selecione o prazo desejado.' });
    }

    if (!data.descricao || data.descricao.length < 10) {
        errors.push({ field: 'descricao', message: 'Descreva seu projeto com pelo menos 10 caracteres.' });
    }

    return errors;
}

function isValidPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 13;
}

function buildWhatsAppMessage(data) {
    const lines = [
        '*Nova Solicitação de Orçamento*',
        '',
        `Nome: ${data.nome}`,
        `WhatsApp: ${data.whatsapp}`,
    ];

    if (data.empresa) lines.push(`Empresa: ${data.empresa}`);

    lines.push(
        `Serviço: ${data.servico}`,
        `Investimento: ${data.investimento}`,
        `Prazo: ${data.prazo}`,
        '',
        'Descrição:',
        data.descricao
    );

    return lines.join('\n');
}

function clearErrors(form) {
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification ${type} show`;

    clearTimeout(notification._timer);
    notification._timer = setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}
