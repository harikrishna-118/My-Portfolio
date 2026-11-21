
document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     ELEMENTS
  ========================================= */

  const header = document.getElementById("header");

  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  const links = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("main section[id]");

  const currentYear = document.getElementById("currentYear");

  const timeline = document.getElementById(
    "educationTimeline"
  );

  const timelineProgress = document.getElementById(
    "timelineProgress"
  );

  const timelineItems = document.querySelectorAll(
    ".timeline-item"
  );

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* =========================================
     CURRENT YEAR
  ========================================= */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* =========================================
     MOBILE NAVBAR
  ========================================= */

  function closeMenu() {
    if (!menuToggle || !navLinks) return;

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
    if (!menuToggle || !navLinks) return;

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

    document.body.classList.toggle(
      "menu-open",
      isOpen
    );
  }

  menuToggle?.addEventListener("click", toggleMenu);

  links.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!menuToggle || !navLinks) return;

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

  /* =========================================
     HEADER SCROLL
  ========================================= */

  function updateHeader() {
    header?.classList.toggle(
      "scrolled",
      window.scrollY > 20
    );
  }

  /* =========================================
     ACTIVE NAV LINKS
     CONTACT FIX INCLUDED
  ========================================= */

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
        link.getAttribute("href") ===
        `#${activeSection}`;

      link.classList.toggle("active", isActive);

      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  /* =========================================
     SCROLL REVEAL
  ========================================= */

  const revealElements = document.querySelectorAll(
    ".reveal"
  );

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

  /* =========================================
     EDUCATION TIMELINE
  ========================================= */

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

    if (rect.height <= 0) return;

    const progress =
      (window.innerHeight * 0.65 - rect.top) /
      rect.height;

    const percentage = Math.min(
      100,
      Math.max(0, progress * 100)
    );

    timelineProgress.style.height =
      `${percentage}%`;
  }

  /* =========================================
     HOME TEXT ANIMATIONS
  ========================================= */

  const nameElements = document.querySelectorAll(
    ".animated-name"
  );

  const role = document.querySelector(".puzzle-role");

  const roleParts = role
    ? role.querySelectorAll("[data-final]")
    : [];

  const description = document.getElementById(
    "typingDescription"
  );

  /* ANIMATION SETTINGS */

  const NAME_DURATION = 2000;
  const NAME_LETTER_ANIMATION = 400;

  const PUZZLE_DURATION = 3000;
  const PUZZLE_START = 2100;

  const TYPING_START = 5200;
  const TYPING_SPEED = 18;

  const alphabet =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  /* =========================================
     NAME - 2 SECONDS
  ========================================= */

  function animateName() {
    const allLetters = [];

    nameElements.forEach((element) => {
      const text = element.dataset.text || "";

      element.textContent = "";

      for (const character of text) {
        const span = document.createElement("span");

        span.className = "name-letter";

        if (character === " ") {
          span.classList.add("space");
          span.textContent = "\u00A0";
        } else {
          span.textContent = character;
        }

        element.appendChild(span);
        allLetters.push(span);
      }
    });

    const totalLetters = allLetters.length;

    const step = totalLetters > 1
      ? (NAME_DURATION - NAME_LETTER_ANIMATION) /
        (totalLetters - 1)
      : 0;

    allLetters.forEach((letter, index) => {
      letter.style.setProperty(
        "--letter-delay",
        `${Math.round(index * step)}ms`
      );
    });
  }

  /* =========================================
     FRONTEND DEVELOPER - 3 SEC PUZZLE
  ========================================= */

  function animatePuzzle() {
    if (!role || !roleParts.length) return;

    const finalTexts = Array.from(roleParts).map(
      (element) => element.dataset.final || ""
    );

    role.classList.add("is-animating");

    const startTime = performance.now();
    let lastFrame = 0;

    function scramble(now) {
      const elapsed = now - startTime;

      const progress = Math.min(
        elapsed / PUZZLE_DURATION,
        1
      );

      if (now - lastFrame >= 45 || progress === 1) {
        lastFrame = now;

        roleParts.forEach((element, partIndex) => {
          const finalText = finalTexts[partIndex];

          const revealedCount = Math.floor(
            finalText.length * progress
          );

          let output = "";

          for (let i = 0; i < finalText.length; i++) {
            if (i < revealedCount || progress === 1) {
              output += finalText[i];
            } else {
              const randomIndex = Math.floor(
                Math.random() * alphabet.length
              );

              output += alphabet[randomIndex];
            }
          }

          element.textContent = output;
        });
      }

      if (progress < 1) {
        requestAnimationFrame(scramble);
      } else {
        roleParts.forEach((element, index) => {
          element.textContent = finalTexts[index];
        });

        role.classList.remove("is-animating");
      }
    }

    requestAnimationFrame(scramble);
  }

  /* =========================================
     PARAGRAPH TYPING
  ========================================= */

  function animateTyping() {
    if (!description) return;

    const fullText = description.dataset.text || "";

    description.textContent = "";
    description.classList.add("is-typing");

    let index = 0;

    const typingInterval = setInterval(() => {
      index++;

      description.textContent =
        fullText.slice(0, index);

      if (index >= fullText.length) {
        clearInterval(typingInterval);

        description.classList.remove("is-typing");
      }
    }, TYPING_SPEED);
  }

  /* =========================================
     START ANIMATIONS
  ========================================= */

  function startHomeAnimations() {
    if (reducedMotion) {
      nameElements.forEach((element) => {
        element.textContent =
          element.dataset.text || "";
      });

      roleParts.forEach((element) => {
        element.textContent =
          element.dataset.final || "";
      });

      if (description) {
        description.textContent =
          description.dataset.text || "";
      }

      return;
    }

    // First: full name including Prasad
    animateName();

    // Hide role until puzzle starts
    roleParts.forEach((element) => {
      element.textContent = "";
    });

    // Hide paragraph until typing starts
    if (description) {
      description.textContent = "";
    }

    setTimeout(() => {
      animatePuzzle();
    }, PUZZLE_START);

    setTimeout(() => {
      animateTyping();
    }, TYPING_START);
  }

  startHomeAnimations();

  /* =========================================
     OPTIMIZED SCROLL HANDLER
  ========================================= */

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

  /* INITIAL STATE */

  updateOnScroll();

  window.addEventListener("load", updateOnScroll);

});
