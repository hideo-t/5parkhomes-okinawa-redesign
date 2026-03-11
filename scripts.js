const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.dataset.state === 'open';
    navLinks.dataset.state = isOpen ? 'closed' : 'open';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
  });
}

document.querySelectorAll("a[href^='#']").forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.dataset.state = 'closed';
    navToggle?.setAttribute('aria-expanded', 'false');
  });
});

const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = new FormData(form).get('name') || 'お客様';
    alert(`${name}、お問い合わせありがとうございます。担当より折り返しご連絡いたします。`);
    form.reset();
  });
}
