/* ============================================================
   AnotherBOT — GSAP World-Class Animations
   Magnetic cursor · Neural canvas · Robot eye tracking
   ScrollTrigger reveals · 3D tilt · Magnetic buttons
   ============================================================ */

'use strict';

/* ============================================================
   0. GSAP INIT
   ============================================================ */
gsap.registerPlugin(ScrollTrigger, TextPlugin);

/* ============================================================
   1. PRELOADER
   ============================================================ */
(function initPreloader() {
  const preloader = document.getElementById('preloader');
  const bar = document.querySelector('.preloader-bar');
  const num = document.getElementById('loader-num');
  if (!preloader) return;

  const tl = gsap.timeline({
    onComplete: () => {
      gsap.to(preloader, {
        yPercent: -100,
        duration: 0.85,
        ease: 'power3.inOut',
        onComplete: () => {
          preloader.style.display = 'none';
          startHeroSequence();
        }
      });
    }
  });

  tl.to({}, {
    duration: 1.6,
    ease: 'power1.in',
    onUpdate() {
      const p = Math.round(this.progress() * 100);
      if (num) num.textContent = p;
      if (bar) bar.style.width = p + '%';
    }
  });
})();

/* ============================================================
   2. HERO ENTRANCE
   ============================================================ */
function startHeroSequence() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const sub     = document.querySelector('.hero-sub');
  const ctas    = document.querySelector('.hero-ctas');
  const stats   = document.querySelector('.hero-stats');
  const robWrap = document.getElementById('hero-robot-wrap');
  const scrollH = document.getElementById('scroll-hint');
  const hCards  = document.querySelectorAll('.holo-card');
  const lines   = document.querySelectorAll('.hero-title .split-line');

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  if (robWrap) {
    tl.fromTo(robWrap,
      { opacity: 0, scale: 0.82, y: 50 },
      { opacity: 1, scale: 1, y: 0, duration: 1.1 }
    );
  }

  tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.55 }, '-=0.5');

  lines.forEach((line) => {
    tl.fromTo(line,
      { y: 70, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65 },
      '-=0.4'
    );
  });
  tl.set('.hero-title', { opacity: 1 }, '<');

  tl.to(sub,   { opacity: 1, y: 0, duration: 0.55 }, '-=0.35');
  tl.to(ctas,  { opacity: 1, y: 0, duration: 0.5 },  '-=0.3');
  tl.to(stats, { opacity: 1, y: 0, duration: 0.5 },  '-=0.25');

  hCards.forEach((card) => {
    tl.fromTo(card,
      { opacity: 0, scale: 0.65, y: 24 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
      '-=0.32'
    );
  });

  if (scrollH) tl.to(scrollH, { opacity: 1, duration: 0.5 }, '-=0.2');

  tl.add(() => startRobotIdle(), '-=0.5');
  tl.add(() => startHoverCardFloats(), '<');
}

/* ============================================================
   3. NEURAL CANVAS
   ============================================================ */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const mouse = { x: -9999, y: -9999 };
  const COUNT = 70, MAX_DIST = 130;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.45;
      this.vy = (Math.random() - 0.5) * 0.45;
      this.r = Math.random() * 1.8 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.2;
    }
    update() {
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        const force = (100 - d) / 100 * 0.6;
        this.vx += (dx / d) * force;
        this.vy += (dy / d) * force;
      }
      this.vx *= 0.98;
      this.vy *= 0.98;
      const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
      if (sp > 1.5) { this.vx *= 1.5 / sp; this.vy *= 1.5 / sp; }
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,212,255,${this.alpha})`;
      ctx.fill();
    }
  }

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function spawn() {
    particles = [];
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < MAX_DIST) {
          const a = (1 - d / MAX_DIST) * 0.22;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,100,255,${a})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); spawn(); });
  document.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  resize();
  spawn();
  loop();
})();

/* ============================================================
   4. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  if (window.matchMedia('(hover:none)').matches) return;
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gsap.to(cursor, { x: mx, y: my, duration: 0.07, ease: 'none' });
  });

  (function lerp() {
    fx += (mx - fx) * 0.11;
    fy += (my - fy) * 0.11;
    gsap.set(follower, { x: fx, y: fy });
    requestAnimationFrame(lerp);
  })();

  const sel = 'a, button, .magnetic-btn, .tilt-card, .svc-card, .why-card, .mkt-card, .team-card, .tc-social, .fs-link, select, input, textarea, .diag-node, .node-item, .marquee-item, .ci-row, .value-chip, .about-presence-card, .footer-col a, .footer-legal a';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(sel)) document.body.classList.add('cursor-hover');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(sel)) document.body.classList.remove('cursor-hover');
  });
  document.addEventListener('mousedown', () => {
    gsap.to(cursor,   { scale: 0.65, duration: 0.1 });
    gsap.to(follower, { scale: 0.75, duration: 0.15 });
  });
  document.addEventListener('mouseup', () => {
    gsap.to(cursor,   { scale: 1, duration: 0.2 });
    gsap.to(follower, { scale: 1, duration: 0.3 });
  });
})();

/* ============================================================
   5. MAGNETIC BUTTONS
   ============================================================ */
(function initMagnetic() {
  if (window.matchMedia('(hover:none)').matches) return;

  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) * 0.36;
      const dy = (e.clientY - (r.top  + r.height / 2)) * 0.36;
      gsap.to(btn, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1.1, 0.5)' });
    });
  });
})();

/* ============================================================
   6. 3D CARD TILT
   ============================================================ */
(function initTilt() {
  if (window.matchMedia('(hover:none)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      gsap.to(card, {
        rotationX: -ny * 8,
        rotationY:  nx * 8,
        scale: 1.02,
        duration: 0.35,
        ease: 'power2.out',
        transformPerspective: 900
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotationX: 0, rotationY: 0, scale: 1,
        duration: 0.65, ease: 'elastic.out(1, 0.6)'
      });
    });
  });
})();

/* ============================================================
   7. ROBOT IDLE ANIMATIONS
   ============================================================ */
function startRobotIdle() {
  const robot = document.getElementById('hero-robot');
  if (!robot) return;

  // Main float
  gsap.to('#hero-robot-wrap', {
    y: -20, repeat: -1, yoyo: true, duration: 3.2, ease: 'power1.inOut'
  });

  // Slight sway
  gsap.to('#hero-robot', {
    rotation: 1.5, repeat: -1, yoyo: true, duration: 4.2, ease: 'power1.inOut'
  });

  // Core outer ring spin
  gsap.to('#core-ring-outer', {
    rotation: 360, repeat: -1, duration: 9, ease: 'none',
    svgOrigin: '190 278'
  });
  gsap.to('#core-ring-mid', {
    rotation: -360, repeat: -1, duration: 14, ease: 'none',
    svgOrigin: '190 278'
  });

  // Core dot pulse
  gsap.to('#core-dot', {
    scale: 1.5, opacity: 0.7, repeat: -1, yoyo: true, duration: 1.3,
    ease: 'power2.inOut', svgOrigin: '190 278'
  });

  // Outer glow breathe
  gsap.to('#core-glow', {
    opacity: 0.5, scale: 1.25, repeat: -1, yoyo: true, duration: 1.9,
    ease: 'power2.inOut', svgOrigin: '190 278'
  });

  // Antenna blink
  gsap.to('#antenna-ball', {
    opacity: 0.15, repeat: -1, yoyo: true, duration: 0.8, ease: 'power1.inOut'
  });

  // Arms
  gsap.to('#arm-left', {
    rotation: -4, svgOrigin: '67 218',
    repeat: -1, yoyo: true, duration: 3.2, ease: 'power1.inOut', delay: 0.5
  });
  gsap.to('#arm-right', {
    rotation: 4, svgOrigin: '313 218',
    repeat: -1, yoyo: true, duration: 3.2, ease: 'power1.inOut'
  });

  // Hands
  gsap.to('.hand-glow', {
    opacity: 0.2, repeat: -1, yoyo: true, duration: 2, stagger: 0.6, ease: 'power1.inOut'
  });

  // Eye blink
  const eyeFills = robot.querySelectorAll('.robot-eye-fill');
  function blink() {
    gsap.to(eyeFills, {
      scaleY: 0.1, duration: 0.07, ease: 'power1.in', svgOrigin: '190 113',
      onComplete: () => {
        gsap.to(eyeFills, { scaleY: 1, duration: 0.1, ease: 'power2.out' });
      }
    });
    setTimeout(blink, 3200 + Math.random() * 2800);
  }
  setTimeout(blink, 1800);
}

/* ============================================================
   8. ROBOT EYE TRACKING
   ============================================================ */
(function initEyeTracking() {
  if (window.matchMedia('(hover:none)').matches) return;

  const leftGroup  = document.getElementById('left-pupil-group');
  const rightGroup = document.getElementById('right-pupil-group');
  const robot      = document.getElementById('hero-robot');
  if (!leftGroup || !rightGroup || !robot) return;

  const MAX_OFFSET = 9;

  document.addEventListener('mousemove', e => {
    const rect = robot.getBoundingClientRect();
    const scaleX = rect.width  / 380;
    const scaleY = rect.height / 500;

    function trackEye(eyeX, eyeY, group) {
      const screenEyeX = rect.left + eyeX * scaleX;
      const screenEyeY = rect.top  + eyeY * scaleY;
      const dx = e.clientX - screenEyeX;
      const dy = e.clientY - screenEyeY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return;
      const fac = Math.min(dist, 300) / 300;
      gsap.to(group, {
        x: (dx / dist) * fac * MAX_OFFSET,
        y: (dy / dist) * fac * MAX_OFFSET * 0.65,
        duration: 0.28,
        ease: 'power2.out'
      });
    }

    trackEye(156, 113, leftGroup);
    trackEye(224, 113, rightGroup);
  });
})();

/* ============================================================
   9. HOLOGRAPHIC CARD FLOATS
   ============================================================ */
function startHoverCardFloats() {
  [
    { el: '#hcard-1', y: 13, dur: 3.6, delay: 0 },
    { el: '#hcard-2', y: 16, dur: 4.4, delay: 0.9 },
    { el: '#hcard-3', y: 11, dur: 4.0, delay: 1.5 },
    { el: '#hcard-4', y: 14, dur: 4.7, delay: 0.45 },
  ].forEach(({ el, y, dur, delay }) => {
    const elem = document.querySelector(el);
    if (!elem) return;
    gsap.to(elem, { y: -y, repeat: -1, yoyo: true, duration: dur, ease: 'power1.inOut', delay });
  });
}

/* ============================================================
   10. SCROLL TRIGGER REVEALS
   ============================================================ */
(function initScrollAnimations() {

  // Generic reveals
  document.querySelectorAll('.gsap-reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none'
      }
    });
  });

  // Stagger grids
  [
    { wrap: '.why-grid',      items: '.why-card' },
    { wrap: '.services-grid', items: '.svc-card' },
    { wrap: '.markets-grid',  items: '.mkt-card' },
    { wrap: '.team-grid',     items: '.team-card' },
    { wrap: '.values-grid',   items: '.value-chip' },
    { wrap: '.svc-diagram',   items: '.diag-node' },
    { wrap: '.process-steps', items: '.proc-step' },
    { wrap: '.contact-items', items: '.ci-row' },
    { wrap: '.footer-grid',   items: '.footer-col' },
  ].forEach(({ wrap, items }) => {
    const parent = document.querySelector(wrap);
    if (!parent) return;
    const children = parent.querySelectorAll(items);
    if (!children.length) return;
    gsap.set(children, { opacity: 0, y: 38 });
    gsap.to(children, {
      opacity: 1, y: 0, duration: 0.65, stagger: 0.09, ease: 'power3.out',
      scrollTrigger: { trigger: parent, start: 'top 85%', toggleActions: 'play none none none' }
    });
  });

  // Counters — stats strip
  ScrollTrigger.create({
    trigger: '.stats-strip', start: 'top 85%', once: true,
    onEnter: () => animateCounters(document.querySelectorAll('.sp-num'))
  });

  // Hero stats
  ScrollTrigger.create({
    trigger: '.hero-stats', start: 'top 95%', once: true,
    onEnter: () => animateCounters(document.querySelectorAll('.stat-val'))
  });

  // Process line draw
  const pLine = document.getElementById('process-line');
  if (pLine) {
    ScrollTrigger.create({
      trigger: '.process-track', start: 'top 80%', once: true,
      onEnter: () => gsap.to(pLine, { attr: { x2: 900 }, duration: 1.4, ease: 'power2.inOut' })
    });
  }

  // CTA
  ScrollTrigger.create({
    trigger: '.cta-strip', start: 'top 85%', once: true,
    onEnter: () => {
      gsap.from('.cta-strip h2', { y: 40, opacity: 0, duration: 0.85, ease: 'power3.out' });
      gsap.from('.cta-strip p',  { y: 30, opacity: 0, duration: 0.8,  ease: 'power3.out', delay: 0.15 });
      gsap.from('.cta-btns .btn', { y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out', delay: 0.28 });
    }
  });

  // Parallax hero grid
  gsap.to('.hero-grid-overlay', {
    yPercent: -22, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  // Parallax robot halo
  gsap.to('.robot-halo', {
    yPercent: -15, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
  });

  // Section headers reveal
  document.querySelectorAll('.section-header').forEach(header => {
    gsap.from(header.querySelector('h2'), {
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: header, start: 'top 88%', toggleActions: 'play none none none' }
    });
  });

})();

/* ============================================================
   11. COUNTER ANIMATION
   ============================================================ */
function animateCounters(elements) {
  elements.forEach(el => {
    const target = parseInt(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    let current = 0;
    const inc = target / 55;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current) + suffix;
    }, 22);
  });
}

/* ============================================================
   12. NAVBAR
   ============================================================ */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 60) navbar.classList.add('scrolled');
    else        navbar.classList.remove('scrolled');
    lastScroll = y;
  }, { passive: true });

  // Active links
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 200) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  }, { passive: true });
})();

/* ============================================================
   13. MOBILE NAV
   ============================================================ */
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    if (open) {
      gsap.from('.nav-links li', {
        y: 28, opacity: 0, stagger: 0.07, duration: 0.4, ease: 'power3.out'
      });
    }
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ============================================================
   14. MARQUEE (GSAP)
   ============================================================ */
(function initMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  // Using CSS animation as fallback (GSAP scroll + modifiers can conflict)
  track.style.animation = 'marquee-run 30s linear infinite';
})();

/* ============================================================
   15. SMOOTH ANCHOR SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   16. CONTACT FORM
   ============================================================ */
(function initForm() {
  const form = document.querySelector('.c-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btnSpan = form.querySelector('.form-submit span');
    const originalText = btnSpan ? btnSpan.textContent : '';
    if (btnSpan) btnSpan.textContent = 'Message envoyé ✓';
    gsap.fromTo('.form-submit',
      { scale: 0.94 },
      { scale: 1, duration: 0.5, ease: 'elastic.out(1.3, 0.5)' }
    );
    setTimeout(() => { if (btnSpan) btnSpan.textContent = originalText; }, 3500);
  });
})();

/* ============================================================
   17. DIAGRAM NODES CYCLING
   ============================================================ */
(function initDiagCycle() {
  const nodes = document.querySelectorAll('.diag-node');
  if (!nodes.length) return;
  let cur = 0;
  setInterval(() => {
    nodes.forEach(n => n.classList.remove('active'));
    nodes[cur].classList.add('active');
    cur = (cur + 1) % nodes.length;
  }, 600);
})();

/* ============================================================
   18. ABOUT NODE GRID ENTRANCE
   ============================================================ */
(function initNodeGrid() {
  const items = document.querySelectorAll('.node-item');
  gsap.set(items, { opacity: 0, scale: 0.65 });
  ScrollTrigger.create({
    trigger: '.node-grid', start: 'top 85%', once: true,
    onEnter: () => {
      gsap.to(items, {
        opacity: 1, scale: 1, duration: 0.5,
        stagger: { each: 0.07, from: 'center' },
        ease: 'back.out(1.6)'
      });
    }
  });
})();

/* ============================================================
   19. CURSOR TRAIL
   ============================================================ */
(function initTrail() {
  if (window.matchMedia('(hover:none)').matches) return;

  const NUM = 8;
  const dots = [];

  for (let i = 0; i < NUM; i++) {
    const d = document.createElement('div');
    d.style.cssText = `
      position:fixed;width:4px;height:4px;border-radius:50%;
      background:rgba(0,212,255,${(0.35 - i * 0.04).toFixed(2)});
      pointer-events:none;z-index:9996;
      transform:translate(-50%,-50%);
    `;
    document.body.appendChild(d);
    dots.push({ el: d, x: -100, y: -100 });
  }

  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    let ox = mx, oy = my;
    dots.forEach((dot, i) => {
      dot.x += (ox - dot.x) * (0.34 - i * 0.03);
      dot.y += (oy - dot.y) * (0.34 - i * 0.03);
      gsap.set(dot.el, { x: dot.x, y: dot.y });
      ox = dot.x; oy = dot.y;
    });
    requestAnimationFrame(loop);
  })();
})();
