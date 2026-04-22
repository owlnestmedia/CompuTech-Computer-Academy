/* ===================================
   COMPUTECH ACADEMY - SCRIPT.JS
   GSAP + Particle Canvas + Animations
   =================================== */

"use strict";

/* ========================
   LOADER
   ======================== */
window.addEventListener("load", () => {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) {
      loader.classList.add("hidden");
      setTimeout(() => loader.remove(), 600);
    }
    // Trigger hero animations after load
    animateHeroEntry();
  }, 2000);
});

/* ========================
   CUSTOM CURSOR
   ======================== */
const cursor = document.querySelector(".cursor");
const trail = document.querySelector(".cursor-trail");

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  }
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.14;
  trailY += (mouseY - trailY) * 0.14;
  if (trail) {
    trail.style.left = trailX + "px";
    trail.style.top  = trailY + "px";
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll("a, button, .course-card, .why-card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    if (cursor) { cursor.style.width = "20px"; cursor.style.height = "20px"; }
    if (trail) { trail.style.width = "50px"; trail.style.height = "50px"; }
  });
  el.addEventListener("mouseleave", () => {
    if (cursor) { cursor.style.width = "12px"; cursor.style.height = "12px"; }
    if (trail) { trail.style.width = "32px"; trail.style.height = "32px"; }
  });
});

/* ========================
   NAVBAR SCROLL
   ======================== */
const navbar = document.getElementById("navbar");
const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {
  if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 60);
  if (backTop) backTop.classList.toggle("show", window.scrollY > 400);
});

backTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ========================
   HAMBURGER MENU
   ======================== */
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

hamburger?.addEventListener("click", () => {
  mobileMenu?.classList.toggle("open");
});

function closeMobile() {
  mobileMenu?.classList.remove("open");
}

/* ========================
   PARTICLE CANVAS (HERO)
   ======================== */
(function initParticles() {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, particles = [];
  const PARTICLE_COUNT = 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener("resize", () => { resize(); spawnParticles(); });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 2 + 0.5;
      this.a  = Math.random() * 0.6 + 0.1;
      this.type = Math.random() < 0.3 ? "square" : "circle";
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.a;
      ctx.fillStyle = `hsl(${185 + Math.random() * 30}, 100%, 60%)`;
      if (this.type === "square") {
        ctx.fillRect(this.x - this.r, this.y - this.r, this.r * 2, this.r * 2);
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function spawnParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  }
  spawnParticles();

  function drawConnections() {
    const dist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < dist) {
          ctx.save();
          ctx.globalAlpha = (1 - d / dist) * 0.15;
          ctx.strokeStyle = "#00d4ff";
          ctx.lineWidth   = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(loop);
  }
  loop();

  // Mouse interaction
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    particles.forEach(p => {
      const dx = p.x - mx;
      const dy = p.y - my;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 100) {
        p.vx += (dx / d) * 0.05;
        p.vy += (dy / d) * 0.05;
      }
    });
  });
})();

/* ========================
   HERO ENTRY ANIMATIONS
   ======================== */
function animateHeroEntry() {
  if (typeof gsap === "undefined") return;
  gsap.from(".hero-badge", { y: 20, opacity: 0, duration: 0.6, delay: 0.1 });
  gsap.from(".hero-title", { y: 30, opacity: 0, duration: 0.7, delay: 0.3 });
  gsap.from(".hero-desc",  { y: 20, opacity: 0, duration: 0.6, delay: 0.5 });
  gsap.from(".hero-btns",  { y: 20, opacity: 0, duration: 0.6, delay: 0.7 });
  gsap.from(".hero-stats", { y: 20, opacity: 0, duration: 0.6, delay: 0.9 });
  gsap.from(".hero-3d-element", { scale: 0.7, opacity: 0, duration: 1, delay: 0.4, ease: "back.out(1.7)" });
  gsap.from(".scroll-hint", { opacity: 0, duration: 0.6, delay: 1.4 });
}

/* ========================
   SCROLL REVEAL
   ======================== */
const revealEls = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

function revealOnScroll() {
  revealEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 60) {
      el.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", revealOnScroll, { passive: true });
// Run once on load too
setTimeout(revealOnScroll, 100);

/* ========================
   COUNTER ANIMATIONS
   ======================== */
function animateCounters(selector) {
  document.querySelectorAll(selector).forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const step = target / (duration / 16);
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(interval); }
      el.textContent = Math.floor(current).toLocaleString();
    }, 16);
  });
}

// Hero counters (run after short delay)
setTimeout(() => animateCounters(".stat-n"), 2200);

// Section counters via IntersectionObserver
const counterSection = document.querySelector(".counters-grid");
if (counterSection) {
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateCounters(".count-n");
      obs.disconnect();
    }
  }, { threshold: 0.3 });
  obs.observe(counterSection);
}

/* ========================
   TESTIMONIAL SLIDER
   ======================== */
(function initSlider() {
  const track   = document.getElementById("testiTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const dotsEl  = document.getElementById("testiDots");
  if (!track) return;

  const cards   = track.querySelectorAll(".testi-card");
  let current   = 0;
  const total   = cards.length;

  // Build dots
  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.classList.add("testi-dot");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goTo(i));
    dotsEl?.appendChild(dot);
  });

  function updateDots() {
    dotsEl?.querySelectorAll(".testi-dot").forEach((d, i) => {
      d.classList.toggle("active", i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));

  // Auto-advance
  let autoSlide = setInterval(() => goTo(current + 1), 5000);
  track.addEventListener("mouseenter", () => clearInterval(autoSlide));
  track.addEventListener("mouseleave", () => { autoSlide = setInterval(() => goTo(current + 1), 5000); });

  // Touch swipe
  let startX = 0;
  track.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener("touchend",   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) goTo(current + (diff > 0 ? 1 : -1));
  });
})();

/* ========================
   GSAP SCROLLTRIGGER
   ======================== */
(function initGSAP() {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);

  // Section titles
  gsap.utils.toArray(".section-title").forEach(el => {
    gsap.from(el, {
      scrollTrigger: { trigger: el, start: "top 85%" },
      y: 30, opacity: 0, duration: 0.7
    });
  });

  // Course cards stagger
  gsap.from(".course-card", {
    scrollTrigger: { trigger: ".courses-grid", start: "top 80%" },
    y: 50, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out"
  });

  // Why cards stagger
  gsap.from(".why-card", {
    scrollTrigger: { trigger: ".why-grid", start: "top 80%" },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out"
  });

  // Counter cards stagger
  gsap.from(".counter-card", {
    scrollTrigger: { trigger: ".counters-grid", start: "top 85%" },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out"
  });

  // Gallery items
  gsap.from(".gallery-item", {
    scrollTrigger: { trigger: ".gallery-grid", start: "top 80%" },
    scale: 0.92, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out"
  });

  // About section
  gsap.from(".about-left", {
    scrollTrigger: { trigger: "#about", start: "top 75%" },
    x: -60, opacity: 0, duration: 0.8, ease: "power2.out"
  });
  gsap.from(".about-right", {
    scrollTrigger: { trigger: "#about", start: "top 75%" },
    x: 60, opacity: 0, duration: 0.8, ease: "power2.out", delay: 0.1
  });

  // Contact
  gsap.from(".contact-info", {
    scrollTrigger: { trigger: "#contact", start: "top 75%" },
    x: -50, opacity: 0, duration: 0.7, ease: "power2.out"
  });
  gsap.from(".contact-form", {
    scrollTrigger: { trigger: "#contact", start: "top 75%" },
    x: 50, opacity: 0, duration: 0.7, ease: "power2.out"
  });

  // Neon pulse on section entry
  gsap.utils.toArray(".accent-text").forEach(el => {
    gsap.to(el, {
      scrollTrigger: { trigger: el, start: "top 90%" },
      textShadow: "0 0 20px rgba(0,212,255,0.5)",
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
})();

/* ========================
   GLITCH HOVER (COURSES)
   ======================== */
document.querySelectorAll(".course-card").forEach(card => {
  card.addEventListener("mouseenter", () => {
    const title = card.querySelector(".course-title");
    if (!title) return;
    title.setAttribute("data-text", title.textContent);
    title.classList.add("glitch");
    setTimeout(() => title.classList.remove("glitch"), 700);
  });
});

/* ========================
   SMOOTH ACTIVE NAV
   ======================== */
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

function updateActiveNav() {
  let current = "";
  sections.forEach(sec => {
    const top = sec.offsetTop - 100;
    if (window.scrollY >= top) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = "";
    if (a.getAttribute("href") === `#${current}`) {
      a.style.color = "var(--cyan)";
    }
  });
}
window.addEventListener("scroll", updateActiveNav, { passive: true });

/* ========================
   CONTACT FORM SUBMIT
   ======================== */
function handleSubmit(e) {
  e.preventDefault();
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const btn = form.querySelector("button[type='submit']");

  btn.disabled = true;
  btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';

  setTimeout(() => {
    if (success) {
      success.style.display = "block";
      gsap.from(success, { y: 10, opacity: 0, duration: 0.4 });
    }
    form.reset();
    btn.disabled = false;
    btn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
    setTimeout(() => { if (success) success.style.display = "none"; }, 4000);
  }, 1500);
}

/* ========================
   DIGITAL SCAN LINE ANIM
   ======================== */
(function scanHero() {
  const hero = document.getElementById("hero");
  if (!hero) return;
  const line = document.createElement("div");
  line.style.cssText = `
    position:absolute;
    left:0;width:100%;height:2px;
    background:linear-gradient(90deg,transparent,rgba(0,212,255,0.4),transparent);
    top:-2px;z-index:9;pointer-events:none;
  `;
  hero.appendChild(line);

  let y = 0;
  function animLine() {
    y += 1.5;
    if (y > hero.offsetHeight + 2) y = -2;
    line.style.top = y + "px";
    requestAnimationFrame(animLine);
  }
  animLine();
})();

/* ========================
   NEON MOUSE DISTORTION
   ======================== */
(function neonDistort() {
  const cards = document.querySelectorAll(".course-card, .why-card, .counter-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 16;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 16;
      card.style.transform = `translateY(-6px) perspective(600px) rotateX(${-y * 0.5}deg) rotateY(${x * 0.5}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ========================
   TYPING EFFECT (HERO BADGE)
   ======================== */
(function typeEffect() {
  const badge = document.querySelector(".hero-badge");
  if (!badge) return;
  const lines = [
    "FUTURISTIC TECH EDUCATION",
    "CODING · AI · CYBER SECURITY",
    "BUILD THE FUTURE — NOW"
  ];
  let lineIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const currentLine = lines[lineIdx];
    const textNode = badge.childNodes[badge.childNodes.length - 1];
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
      badge.appendChild(document.createTextNode(""));
      type(); return;
    }

    if (!deleting) {
      textNode.textContent = currentLine.slice(0, ++charIdx);
      if (charIdx === currentLine.length) { deleting = true; setTimeout(type, 2200); return; }
    } else {
      textNode.textContent = currentLine.slice(0, --charIdx);
      if (charIdx === 0) { deleting = false; lineIdx = (lineIdx + 1) % lines.length; }
    }
    setTimeout(type, deleting ? 40 : 70);
  }

  setTimeout(() => {
    const dot = badge.querySelector(".pulse-dot");
    badge.innerHTML = "";
    if (dot) badge.appendChild(dot);
    badge.appendChild(document.createTextNode(""));
    type();
  }, 2400);
})();

/* ========================
   PARALLAX HERO ELEMENTS
   ======================== */
window.addEventListener("scroll", () => {
  const scrolled = window.scrollY;
  const orb = document.querySelector(".hero-3d-element");
  if (orb) orb.style.transform = `translateY(calc(-50% + ${scrolled * 0.12}px))`;
  const grid = document.querySelector(".hero-grid-overlay");
  if (grid) grid.style.transform = `translateY(${scrolled * 0.05}px)`;
}, { passive: true });

/* ========================
   ACTIVE SECTION GLOW NAV
   ======================== */
const navCta = document.querySelector(".nav-cta");
setInterval(() => {
  if (navCta) {
    navCta.style.boxShadow = `0 0 ${16 + Math.sin(Date.now()/600) * 8}px rgba(0,212,255,0.4)`;
  }
}, 50);

/* ========================
   GALLERY ITEM LABEL ICONS
   ======================== */
(function addGalleryIcons() {
  const data = [
    { el: ".gi-1", icon: "fa-robot",     label: "AI Lab Sessions" },
    { el: ".gi-2", icon: "fa-code",       label: "Coding Workshops" },
    { el: ".gi-3", icon: "fa-trophy",     label: "Hackathon 2024" },
    { el: ".gi-4", icon: "fa-folder-open",label: "Student Projects" },
    { el: ".gi-5", icon: "fa-flask",      label: "Modern Labs" },
    { el: ".gi-6", icon: "fa-graduation-cap", label: "Graduation Ceremony" },
  ];
  data.forEach(({ el, icon }) => {
    const item = document.querySelector(el);
    if (!item) return;
    const img = item.querySelector(".gallery-img");
    if (!img) return;
    const iconEl = document.createElement("div");
    iconEl.style.cssText = `
      position:absolute;inset:0;display:flex;align-items:center;
      justify-content:center;z-index:1;color:rgba(0,212,255,0.2);font-size:4rem;
    `;
    iconEl.innerHTML = `<i class="fa-solid ${icon}"></i>`;
    img.appendChild(iconEl);
  });
})();

/* ========================
   KEYBOARD NAVIGATION
   ======================== */
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeMobile();
});

console.log(
  "%c🚀 COMPUTECH ACADEMY",
  "color:#00d4ff;font-family:monospace;font-size:18px;font-weight:bold;letter-spacing:2px;"
);
console.log("%cBuild Your Future in Technology", "color:#0051ff;font-size:12px;");
