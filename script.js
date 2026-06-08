// Theme & UI interactions for BSIS Portfolio

// ------- Smoke Particles Background -------
(function () {
  const canvas = document.getElementById("particleCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height, particles;
  const PARTICLE_COUNT = 70;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const isLight = document.body.classList.contains("light-theme");
    const baseAlpha = isLight ? 0.35 : 0.45;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.35 - 0.08, // slight upward drift
      radius: 40 + Math.random() * 70,
      life: 0,
      maxLife: 600 + Math.random() * 500,
      baseAlpha,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function getSmokeGradient(p) {
    const isLight = document.body.classList.contains("light-theme");
    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
    if (isLight) {
      g.addColorStop(0, "rgba(148, 163, 184, " + p.baseAlpha + ")");
      g.addColorStop(0.35, "rgba(148, 163, 184, " + p.baseAlpha * 0.6 + ")");
      g.addColorStop(1, "rgba(148, 163, 184, 0)");
    } else {
      g.addColorStop(0, "rgba(15, 23, 42, " + p.baseAlpha + ")");
      g.addColorStop(0.3, "rgba(15, 23, 42, " + p.baseAlpha * 0.6 + ")");
      g.addColorStop(1, "rgba(15, 23, 42, 0)");
    }
    return g;
  }

  function animate() {
    // Very soft fade to create trailing smoke effect
    ctx.fillStyle = document.body.classList.contains("light-theme")
      ? "rgba(244, 245, 251, 0.18)"
      : "rgba(11, 15, 30, 0.25)";
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      // wrap horizontally for seamless effect
      if (p.x < -p.radius) p.x = width + p.radius;
      if (p.x > width + p.radius) p.x = -p.radius;
      if (p.y < -p.radius) p.y = height + p.radius; // if it drifts too high, wrap to bottom

      if (p.life > p.maxLife) {
        particles[i] = createParticle();
        continue;
      }

      const lifeRatio = p.life / p.maxLife;
      const alphaScale = lifeRatio < 0.5 ? lifeRatio * 2 : (1 - lifeRatio) * 2;

      ctx.save();
      ctx.globalAlpha = alphaScale;
      ctx.fillStyle = getSmokeGradient(p);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", resize);

  init();
  animate();
})();

// ------- Preloader -------
window.addEventListener("load", () => {
  const preloader = document.getElementById("preloader");
  setTimeout(() => {
    if (preloader) {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";
      setTimeout(() => preloader.remove(), 400);
    }
  }, 600);
});


// ------- Mobile Navigation -------
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("open")) {
        navLinks.classList.remove("open");
        hamburger.classList.remove("open");
      }
    });
  });
}

// ------- Smooth Scrolling & Active Link Highlight -------
const navLinkEls = document.querySelectorAll(".nav-link");
const sections = Array.from(document.querySelectorAll("main section"));

navLinkEls.forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#")) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const y = target.getBoundingClientRect().top + window.pageYOffset - 16;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  });
});

function updateActiveNav() {
  const scrollPos = window.scrollY;
  const offset = (document.getElementById("navbar")?.offsetHeight || 0) + 96;

  let currentId = "home";
  sections.forEach((section) => {
    const top = section.offsetTop;
    if (scrollPos + offset >= top) {
      currentId = section.id;
    }
  });

  navLinkEls.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const id = href.replace("#", "");
    link.classList.toggle("active", id === currentId);
  });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("resize", updateActiveNav);
updateActiveNav();

// ------- Back to Top Button -------
const backToTop = document.getElementById("backToTop");

function handleScrollUI() {
  const scrollTop = window.scrollY;

  if (backToTop) {
    if (scrollTop > 400) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  }
}

if (backToTop) {
  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

window.addEventListener("scroll", handleScrollUI);
window.addEventListener("resize", handleScrollUI);
handleScrollUI();
// ------- Scroll Reveal Animations -------
const revealEls = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealEls.forEach((el) => observer.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("visible"));
}

// ------- Typing Animation -------
const typingEl = document.getElementById("typing");

const roles = [
  "Aspiring Systems Analyst",
  "Prototype Developer",
  "Information Systems Student",
  "Junior Web Developer",
  "Tech Support Enthusiast",
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;
let typingInterval;

function type() {
  if (!typingEl) return;

  const current = roles[roleIndex];

  if (!deleting) {
    typingEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      clearInterval(typingInterval);
      setTimeout(() => {
        typingInterval = setInterval(type, 80);
      }, 1100);
    }
  } else {
    typingEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }
}

if (typingEl) {
  typingInterval = setInterval(type, 110);
}

// ------- Contact Form Validation -------
const form = document.getElementById("contactForm");

if (form) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const formSuccess = document.getElementById("formSuccess");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate() {
    let valid = true;
    formSuccess.textContent = "";

    if (!nameInput.value.trim()) {
      nameError.textContent = "Please enter your full name.";
      valid = false;
    } else {
      nameError.textContent = "";
    }

    if (!emailInput.value.trim()) {
      emailError.textContent = "Please enter your email address.";
      valid = false;
    } else if (!emailPattern.test(emailInput.value.trim())) {
      emailError.textContent = "Please enter a valid email address.";
      valid = false;
    } else {
      emailError.textContent = "";
    }

    if (!messageInput.value.trim()) {
      messageError.textContent = "Please enter a message.";
      valid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = "Message should be at least 10 characters.";
      valid = false;
    } else {
      messageError.textContent = "";
    }

    return valid;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (validate()) {
      formSuccess.textContent = "Thank you! Your message has been validated.";
      form.reset();
    }
  });

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => {
      validate();
    });
  });
}

// ------- Certificate Preview Modal -------
const certModal = document.getElementById("certModal");
const certModalImg = document.getElementById("certModalImg");

function openPreview(src) {
  if (certModal && certModalImg) {
    certModalImg.src = src;
    certModal.classList.add("active");
    document.body.style.overflow = "hidden"; // prevent scrolling behind modal
  }
}

function closePreview() {
  if (certModal) {
    certModal.classList.remove("active");
    document.body.style.overflow = "";
  }
}

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closePreview();
});

// ------- Footer Year -------
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
