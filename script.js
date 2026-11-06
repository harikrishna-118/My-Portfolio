
"use strict";

// ========================================
// ELEMENTS
// ========================================

const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const navItems = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("main section[id]");
const progressBar = document.getElementById("scrollProgress");
const revealElements = document.querySelectorAll(".reveal");
const currentYear = document.getElementById("currentYear");

const timeline = document.getElementById("educationTimeline");
const timelineProgress = document.getElementById("timelineProgress");
const timelineItems = document.querySelectorAll(".timeline-item");

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
);

// ========================================
// CURRENT YEAR
// ========================================

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

// ========================================
// MOBILE NAVBAR
// ========================================

function closeMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.classList.remove("active");
  navLinks.classList.remove("show");

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute(
    "aria-label",
    "Open navigation menu"
  );

  document.body.classList.remove("menu-open");
}

function openMenu() {
  if (!menuToggle || !navLinks) return;

  menuToggle.classList.add("active");
  navLinks.classList.add("show");

  menuToggle.setAttribute("aria-expanded", "true");
  menuToggle.setAttribute(
    "aria-label",
    "Close navigation menu"
  );

  document.body.classList.add("menu-open");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.contains("show");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

// Close mobile menu when a link is clicked
navItems.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Close mobile menu when clicking outside
document.addEventListener("click", (event) => {
  if (!header || !navLinks) return;

  if (
    navLinks.classList.contains("show") &&
    !header.contains(event.target)
  ) {
    closeMenu();
  }
});

// Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMenu();
  }
});

// Desktop resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 900) {
    closeMenu();
  }
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

function updateNavbar() {
  if (!header) return;

  header.classList.toggle(
    "scrolled",
    window.scrollY > 30
  );
}

// ========================================
// SCROLL PROGRESS
// ========================================

function updateScrollProgress() {
  if (!progressBar) return;

  const scrollHeight =
    document.documentElement.scrollHeight -
    window.innerHeight;

  const progress =
    scrollHeight > 0
      ? (window.scrollY / scrollHeight) * 100
      : 0;

  progressBar.style.width =
    Math.max(0, Math.min(100, progress)) + "%";
}

// ========================================
// ACTIVE NAVIGATION
// ========================================

function updateActiveLink() {
  let currentSection = "Home";

  const scrollPosition =
    window.scrollY + window.innerHeight * 0.35;

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navItems.forEach((link) => {
    const isActive =
      link.getAttribute("href") === "#" + currentSection;

    link.classList.toggle("active", isActive);

    if (isActive) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

// ========================================
// SMOOTH SCROLL
// ========================================

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.getElementById(
      targetId.substring(1)
    );

    if (!target) return;

    event.preventDefault();
    closeMenu();

    target.scrollIntoView({
      behavior: prefersReducedMotion.matches
        ? "instant"
        : "smooth",
      block: "start"
    });

    if (window.location.hash !== targetId) {
      history.pushState(null, "", targetId);
    }
  });
});

// ========================================
// SCROLL REVEAL ANIMATION
// ========================================

if (
  "IntersectionObserver" in window &&
  !prefersReducedMotion.matches
) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -30px 0px"
    }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });

} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// ========================================
// EDUCATION ROADMAP REVEAL
// ========================================

if (timelineItems.length) {
  if (
    "IntersectionObserver" in window &&
    !prefersReducedMotion.matches
  ) {
    const educationObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15
      }
    );

    timelineItems.forEach((item) => {
      educationObserver.observe(item);
    });

  } else {
    timelineItems.forEach((item) => {
      item.classList.add("visible");
    });
  }
}

// ========================================
// EDUCATION ROADMAP PROGRESS LINE
// ========================================

function updateEducationProgress() {
  if (!timeline || !timelineProgress) return;

  const rect = timeline.getBoundingClientRect();
  const timelineHeight = rect.height;

  const scrollPoint = window.innerHeight * 0.65;

  const progress = Math.max(
    0,
    Math.min(
      timelineHeight,
      scrollPoint - rect.top
    )
  );

  timelineProgress.style.height = progress + "px";
}

// ========================================
// ALL SCROLL EFFECTS
// ========================================

let scrollScheduled = false;

function handleScroll() {
  if (scrollScheduled) return;

  scrollScheduled = true;

  requestAnimationFrame(() => {
    updateNavbar();
    updateScrollProgress();
    updateActiveLink();
    updateEducationProgress();

    scrollScheduled = false;
  });
}

window.addEventListener("scroll", handleScroll, {
  passive: true
});

// ========================================
// INITIALIZE
// ========================================

function initializePortfolio() {
  updateNavbar();
  updateScrollProgress();
  updateActiveLink();
  updateEducationProgress();
}

initializePortfolio();

window.addEventListener("load", initializePortfolio);

window.addEventListener("resize", () => {
  updateEducationProgress();
  updateActiveLink();
});
