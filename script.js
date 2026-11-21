
document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const currentYear = document.getElementById("currentYear");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // MOBILE NAVIGATION

  function closeMenu() {
    navLinks.classList.remove("show");
    menuToggle.classList.remove("active");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute(
      "aria-label",
      "Open navigation menu"
    );

    document.body.classList.remove("menu-open");
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle("show");

    menuToggle.classList.toggle("active", isOpen);

    menuToggle.setAttribute(
      "aria-expanded",
      String(isOpen)
    );

    menuToggle.setAttribute(
      "aria-label",
      isOpen
        ? "Close navigation menu"
        : "Open navigation menu"
    );

    document.body.classList.toggle("menu-open", isOpen);
  }

  menuToggle.addEventListener("click", toggleMenu);

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navLinks.classList.contains("show") &&
      !navLinks.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 850) {
      closeMenu();
    }
  });

  // HEADER SCROLL EFFECT

  function updateHeader() {
    header.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );
  }

  // ACTIVE NAVIGATION SECTION
  // Includes Contact section at bottom of page.

  function updateActiveLink() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    const documentHeight =
      document.documentElement.scrollHeight;

    const atBottom =
      scrollY + viewportHeight >= documentHeight - 5;

    let activeSection = "Home";

    if (atBottom) {
      activeSection = "Contact";
    } else {
      const activationPoint = Math.min(
        viewportHeight * 0.35,
        250
      );

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();

        if (rect.top <= activationPoint) {
          activeSection = section.id;
        }
      });

      const contact = document.getElementById("Contact");

      if (contact) {
        const rect = contact.getBoundingClientRect();

        const visibleHeight = Math.max(
          0,
          Math.min(rect.bottom, viewportHeight) -
          Math.max(rect.top, 0)
        );

        if (
          visibleHeight > viewportHeight * 0.45 &&
          rect.top < viewportHeight * 0.6
        ) {
          activeSection = "Contact";
        }
      }
    }

    links.forEach((link) => {
      const isActive =
        link.getAttribute("href") === `#${activeSection}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  // SCROLL REVEAL ANIMATIONS

  const revealElements = document.querySelectorAll(".reveal");

  if (
    !reducedMotion &&
    "IntersectionObserver" in window
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
        rootMargin: "0px 0px -25px 0px"
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

  // EDUCATION TIMELINE

  const timeline = document.getElementById(
    "educationTimeline"
  );

  const timelineProgress = document.getElementById(
    "timelineProgress"
  );

  const timelineItems = document.querySelectorAll(
    ".timeline-item"
  );

  if (
    !reducedMotion &&
    "IntersectionObserver" in window
  ) {
    const timelineObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1
      }
    );

    timelineItems.forEach((item) => {
      timelineObserver.observe(item);
    });
  } else {
    timelineItems.forEach((item) => {
      item.classList.add("visible");
    });
  }

  function updateTimelineProgress() {
    if (!timeline || !timelineProgress) return;

    if (reducedMotion) {
      timelineProgress.style.height = "100%";
      return;
    }

    const rect = timeline.getBoundingClientRect();

    const progress =
      (window.innerHeight * 0.65 - rect.top) /
      rect.height;

    const percentage = Math.min(
      100,
      Math.max(0, progress * 100)
    );

    timelineProgress.style.height = `${percentage}%`;
  }

  // OPTIMIZED SCROLL HANDLER

  let ticking = false;

  function updateOnScroll() {
    updateHeader();
    updateActiveLink();
    updateTimelineProgress();
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateOnScroll);
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateOnScroll);

  // INITIAL STATE

  updateOnScroll();
  window.addEventListener("load", updateOnScroll);
});
