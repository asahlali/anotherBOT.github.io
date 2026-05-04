/* ============================================================
   AnotherBOT — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* === NAVBAR === */
  const navbar = document.querySelector('.navbar');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  navToggle?.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach(s => s.classList.toggle('open'));
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  /* === PARTICLES === */
  const particleContainer = document.querySelector('.hero-particles');
  if (particleContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = (Math.random() * 3 + 1) + 'px';
      p.style.height = p.style.width;
      p.style.animationDelay = Math.random() * 15 + 's';
      p.style.animationDuration = (Math.random() * 20 + 15) + 's';
      p.style.opacity = Math.random() * 0.6;
      particleContainer.appendChild(p);
    }
  }

  /* === SCROLL REVEAL === */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, entry.target.dataset.delay || 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 80;
    revealObserver.observe(el);
  });

  /* === COUNTER ANIMATION === */
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const start = performance.now();
    const isDecimal = String(target).includes('.');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const value = target * ease;
      el.textContent = (isDecimal ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* === ACTIVE NAV LINK === */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navAnchors.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  /* === CONTACT FORM === */
  const form = document.querySelector('.contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✓ Message envoyé !';
    btn.style.background = 'linear-gradient(135deg, #00aa44, #00dd66)';
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.background = '';
      form.reset();
    }, 3500);
  });

  /* === SMOOTH SCROLL FOR ANCHOR LINKS === */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* === DIAGRAM NODE ANIMATION === */
  const diagNodes = document.querySelectorAll('.diagram-node:not(.active)');
  if (diagNodes.length) {
    let idx = 0;
    setInterval(() => {
      diagNodes.forEach(n => n.classList.remove('active'));
      if (diagNodes[idx]) diagNodes[idx].classList.add('active');
      idx = (idx + 1) % diagNodes.length;
    }, 1200);
  }

});
