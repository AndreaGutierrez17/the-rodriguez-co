const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll(".section-target")];
const animatedSections = [
  ...document.querySelectorAll(
    ".about-preview, .trust-strip, .services-preview, .quote-strip, .stories-strip, .faq-section, .site-footer, .service-page-hero, .service-detail, .gallery-hero, .gallery-section, .booking-hero, .booking-flow, .about-page-hero, .about-story, .policy-hero, .policy-content, .emergency-hero, .emergency-strip"
  ),
];
const carousel = document.querySelector("[data-carousel]");
const faqItems = [...document.querySelectorAll(".faq-item")];
const mobileNavQuery = window.matchMedia("(max-width: 820px)");
const megaItems = [...document.querySelectorAll(".has-mega")];
const beforeAfterSliders = [...document.querySelectorAll(".ba-slider")];
const bookingFlow = document.querySelector(".booking-flow");

function setHeaderState() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    const url = new URL(href, window.location.href);
    const linkTarget = url.hash ? url.hash.slice(1) : url.pathname.split("/").pop()?.replace(".html", "") || "home";
    link.classList.toggle("active", linkTarget === id);
  });
}

function getCurrentNavTarget() {
  const page = window.location.pathname.split("/").pop() || "index.html";

  if (window.location.hash) {
    return window.location.hash.slice(1);
  }

  if (page === "index.html") {
    return "home";
  }

  if (page === "gallery.html") {
    return "gallery";
  }

  if (page === "about.html") {
    return "about";
  }

  if (["roofing.html", "kitchen-bath.html", "handyman.html", "exterior-work.html"].includes(page)) {
    return "services";
  }

  if (page === "book-online.html") {
    return "book-online";
  }

  return "";
}

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

    if (visibleEntry) {
      setActiveLink(visibleEntry.target.id);
    }
  },
  {
    rootMargin: "-35% 0px -50% 0px",
    threshold: [0.15, 0.35, 0.65],
  }
);

sections.forEach((section) => observer.observe(section));

const animationObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        animationObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.25,
  }
);

animatedSections.forEach((section) => animationObserver.observe(section));

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    header.classList.remove("nav-open");
    megaItems.forEach((item) => item.classList.remove("mega-open"));
    megaItems.forEach((item) => item.querySelector(".mega-toggle")?.setAttribute("aria-expanded", "false"));
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

megaItems.forEach((item) => {
  const toggle = item.querySelector(".mega-toggle");

  toggle?.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const isOpen = item.classList.toggle("mega-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  item.querySelectorAll(".mega-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      header.classList.remove("nav-open");
      item.classList.remove("mega-open");
      item.querySelector(".mega-toggle")?.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
});

document.addEventListener("click", (event) => {
  if (!header.classList.contains("nav-open")) {
    return;
  }

  if (!header.contains(event.target)) {
    header.classList.remove("nav-open");
    megaItems.forEach((item) => item.classList.remove("mega-open"));
    megaItems.forEach((item) => item.querySelector(".mega-toggle")?.setAttribute("aria-expanded", "false"));
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();
setActiveLink(getCurrentNavTarget());

if (carousel) {
  const track = carousel.querySelector("[data-carousel-track]");
  const previousButton = carousel.querySelector("[data-carousel-prev]");
  const nextButton = carousel.querySelector("[data-carousel-next]");

  function scrollStories(direction) {
    const card = track.querySelector(".story-card");
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const scrollAmount = card.offsetWidth + gap;

    track.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth",
    });
  }

  previousButton.addEventListener("click", () => scrollStories(-1));
  nextButton.addEventListener("click", () => scrollStories(1));
}

faqItems.forEach((item) => {
  const button = item.querySelector(".faq-question");

  button.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");

    faqItems.forEach((faqItem) => {
      faqItem.classList.remove("open");
      faqItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      button.setAttribute("aria-expanded", "true");
    }
  });
});

beforeAfterSliders.forEach((slider) => {
  const beforeWrap = slider.querySelector(".ba-before-wrap");
  const handle = slider.querySelector(".ba-handle");

  function syncBeforeWidth() {
    slider.style.setProperty("--ba-slider-width", `${slider.getBoundingClientRect().width}px`);
  }

  function move(clientX) {
    syncBeforeWidth();
    const rect = slider.getBoundingClientRect();
    const position = Math.max(6, Math.min(94, ((clientX - rect.left) / rect.width) * 100));

    beforeWrap.style.width = `${position}%`;
    handle.style.left = `${position}%`;
  }

  syncBeforeWidth();
  window.addEventListener("resize", syncBeforeWidth);
  slider.addEventListener("mousemove", (event) => move(event.clientX));
  slider.addEventListener("click", (event) => move(event.clientX));
  slider.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches[0]) {
        move(event.touches[0].clientX);
      }
    },
    { passive: true }
  );
});

if (bookingFlow) {
  const bookingState = {
    day: "9",
    time: "9:00 AM",
    service: "Roofing",
  };
  const stepButtons = [...bookingFlow.querySelectorAll("[data-booking-step-button]")];
  const panels = [...bookingFlow.querySelectorAll("[data-booking-panel]")];
  const dayButtons = [...bookingFlow.querySelectorAll("[data-booking-day]")];
  const timeButtons = [...bookingFlow.querySelectorAll("[data-booking-time]")];
  const serviceSelect = bookingFlow.querySelector("[data-booking-service]");
  const fileInput = bookingFlow.querySelector("[data-booking-file]");
  const fileName = bookingFlow.querySelector("[data-booking-file-name]");
  const selectedText = bookingFlow.querySelector("[data-booking-selected]");
  const summaryService = bookingFlow.querySelector("[data-booking-summary-service]");
  const summaryDate = bookingFlow.querySelector("[data-booking-summary-date]");
  const successBox = bookingFlow.querySelector("[data-booking-success]");

  function getAppointmentText() {
    return `Aug ${bookingState.day}, 2026 - ${bookingState.time}`;
  }

  function updateBookingSummary() {
    bookingState.service = serviceSelect?.value || bookingState.service;
    selectedText.textContent = getAppointmentText();
    summaryService.textContent = bookingState.service;
    summaryDate.textContent = getAppointmentText();
  }

  function showBookingStep(step) {
    panels.forEach((panel) => {
      panel.classList.toggle("active", panel.dataset.bookingPanel === String(step));
    });

    stepButtons.forEach((button) => {
      const buttonStep = Number(button.dataset.bookingStepButton);
      button.classList.toggle("active", buttonStep === step);
      button.classList.toggle("done", buttonStep < step);
    });

    bookingFlow.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  dayButtons.forEach((button) => {
    button.addEventListener("click", () => {
      dayButtons.forEach((dayButton) => dayButton.classList.remove("selected"));
      button.classList.add("selected");
      bookingState.day = button.dataset.bookingDay;
      updateBookingSummary();
    });
  });

  timeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      timeButtons.forEach((timeButton) => timeButton.classList.remove("selected"));
      button.classList.add("selected");
      bookingState.time = button.dataset.bookingTime;
      updateBookingSummary();
    });
  });

  serviceSelect?.addEventListener("change", updateBookingSummary);

  fileInput?.addEventListener("change", () => {
    const fileCount = fileInput.files.length;
    fileName.textContent = fileCount === 0 ? "No files selected" : `${fileCount} file${fileCount === 1 ? "" : "s"} selected`;
  });

  bookingFlow.querySelectorAll("[data-booking-next]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentPanel = bookingFlow.querySelector(".booking-panel.active");
      showBookingStep(Math.min(Number(currentPanel.dataset.bookingPanel) + 1, 3));
    });
  });

  bookingFlow.querySelectorAll("[data-booking-prev]").forEach((button) => {
    button.addEventListener("click", () => {
      const currentPanel = bookingFlow.querySelector(".booking-panel.active");
      showBookingStep(Math.max(Number(currentPanel.dataset.bookingPanel) - 1, 1));
    });
  });

  stepButtons.forEach((button) => {
    button.addEventListener("click", () => showBookingStep(Number(button.dataset.bookingStepButton)));
  });

  bookingFlow.querySelector("[data-booking-confirm]")?.addEventListener("click", () => {
    successBox.classList.add("active");
  });

  updateBookingSummary();
}
