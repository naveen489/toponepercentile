'use strict';

/* ─── Mobile Nav Toggle ─── */
const mobileToggle = document.getElementById('mobile-toggle');
const mobileMenu   = document.getElementById('mobile-menu');
if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    mobileMenu.style.display = isOpen ? 'block' : 'none';
    // Toggle icon
    mobileToggle.querySelector('.icon-open').style.display = isOpen ? 'none' : 'block';
    mobileToggle.querySelector('.icon-close').style.display = isOpen ? 'block' : 'none';
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      mobileMenu.style.display = 'none';
      mobileToggle.querySelector('.icon-open').style.display = 'block';
      mobileToggle.querySelector('.icon-close').style.display = 'none';
    });
  });
}

/* ─── Active Nav Link ─── */
const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-link').forEach(link => {
  const href = link.getAttribute('href').replace(/\/$/, '') || '/';
  if (href === currentPath || (href !== '' && href !== 'index.html' && currentPath.endsWith(href))) {
    link.classList.add('nav-link-active');
  }
});

/* ─── Navbar scroll shadow ─── */
const navbar = document.getElementById('main-nav');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─── Back to Top ─── */
const backToTop = document.getElementById('back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ─── Scroll Reveal ─── */
document.addEventListener('DOMContentLoaded', () => {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('revealed'); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.feature-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 60}ms`;
    el.classList.add('reveal');
    revealObs.observe(el);
  });
  document.querySelectorAll('.stat-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 80}ms`;
    el.classList.add('reveal');
    revealObs.observe(el);
  });
  document.querySelectorAll('.testimonial-card').forEach((el, i) => {
    el.style.transitionDelay = `${i * 50}ms`;
    el.classList.add('reveal');
    revealObs.observe(el);
  });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));
});

/* ─── Smooth Anchor Scrolling ─── */
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const target = document.querySelector(link.getAttribute('href'));
  if (!target) return;
  e.preventDefault();
  const top = target.getBoundingClientRect().top + window.scrollY - 100;
  window.scrollTo({ top, behavior: 'smooth' });
});

/* ─── Animated Counter ─── */
function animateCounter(el, target, duration = 1800) {
  let start = 0;
  const step = Math.ceil(target / (duration / 30));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = start.toLocaleString();
    if (start >= target) clearInterval(timer);
  }, 30);
}
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target.querySelector('.counter-num');
      if (el && !el.dataset.counted) {
        el.dataset.counted = '1';
        animateCounter(el, parseInt(el.dataset.target, 10));
      }
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-card').forEach(el => counterObs.observe(el));

/* ─── Testimonial Carousel ─── */
function initCarousel(id) {
  const track = document.querySelector(`#${id} .carousel-track`);
  if (!track) return;
  const slides = track.querySelectorAll('.carousel-slide');
  let current = 0;
  const total = slides.length;
  if (total <= 1) return;
  const dots = document.querySelectorAll(`#${id} .carousel-dot`);

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
      d.style.width = i === current ? '1.5rem' : '0.5rem';
      d.style.background = i === current ? '#1a3a6b' : '#d1d5db';
    });
  }

  document.querySelector(`#${id} .carousel-prev`)?.addEventListener('click', () => goTo(current - 1));
  document.querySelector(`#${id} .carousel-next`)?.addEventListener('click', () => goTo(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  setInterval(() => goTo(current + 1), 5000);
  goTo(0);
}
initCarousel('testimonials-carousel');

/* ─── FAQ Accordion ─── */
document.querySelectorAll('.faq-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const body = item.querySelector('.faq-body');
    const isOpen = item.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-body').classList.remove('open');
    });
    if (!isOpen) {
      item.classList.add('open');
      body.classList.add('open');
    }
  });
});

/* ─── Gallery Filter ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      const show = filter === 'All' || item.dataset.category === filter;
      item.style.display = show ? 'block' : 'none';
    });
  });
});

/* ─── Gallery Lightbox ─── */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
if (lightbox && lightboxImg) {
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('open');
    });
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.id === 'lightbox-close') {
      lightbox.classList.remove('open');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('open');
  });
}

/* ─── Contact Form WhatsApp redirect ─── */
const contactForm = document.getElementById('enquiry-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name    = contactForm.querySelector('[name="name"]')?.value || '';
    const phone   = contactForm.querySelector('[name="phone"]')?.value || '';
    const program = contactForm.querySelector('[name="program"]')?.value || '';
    const message = contactForm.querySelector('[name="message"]')?.value || '';

    // Build WhatsApp message
    const text = `Hi! I'd like to enquire about TOP Institute.\n\nName: ${name}\nPhone: ${phone}\nProgram: ${program}\nMessage: ${message}`;
    const waNumber = '917550022197'; // Update this!
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, '_blank');

    // Show success toast
    showToast('Your enquiry has been sent! We will contact you shortly.', 'success');
    contactForm.reset();
  });
}

/* ─── Toast helper ─── */
function showToast(msg, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${msg}</span><button onclick="this.parentNode.remove()" style="margin-left:1rem;background:none;border:none;color:rgba(255,255,255,0.7);cursor:pointer;font-size:1.1rem">✕</button>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 5000);
}

/* ─── Phone input filter ─── */
document.querySelectorAll('input[type="tel"]').forEach(input => {
  input.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^\d+\-\s]/g, '');
  });
});
