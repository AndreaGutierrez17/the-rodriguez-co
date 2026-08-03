const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll(".section-target")];
const animatedSections = [
  ...document.querySelectorAll(
    ".about-preview, .trust-strip, .integrity-grid-section, .services-preview, .quote-strip, .stories-strip, .faq-section, .social-section, .site-footer, .service-page-hero, .service-detail, .gallery-hero, .gallery-section, .booking-hero, .booking-flow, .about-page-hero, .about-story, .policy-hero, .policy-content, .emergency-hero, .emergency-strip"
  ),
];
const carousel = document.querySelector("[data-carousel]");
const heroCarousel = document.querySelector("[data-hero-carousel]");
const faqItems = [...document.querySelectorAll(".faq-item")];
const mobileNavQuery = window.matchMedia("(max-width: 820px)");
const megaItems = [...document.querySelectorAll(".has-mega")];
const galleryGrid = document.querySelector("[data-gallery-grid]");
const galleryFilters = [...document.querySelectorAll("[data-gallery-filter]")];
const bookingFlow = document.querySelector(".booking-flow");
const customSelects = [...document.querySelectorAll("[data-custom-select]")];

const galleryImagePairs = [
  {
    before: "img/Bano 4.png",
    after: "img/BANO 1.1.png",
    beforeAlt: "Project before work",
    afterAlt: "Project completed work",
  },
  {
    before: "img/Bano 3.png",
    after: "img/BANO 2.1.png",
    beforeAlt: "Bathroom before remodel",
    afterAlt: "Bathroom completed remodel",
  },
  {
    before: "img/WhatsApp Image 2026-07-30 at 14.21.46.jpeg",
    after: "img/hero-2.jpeg",
    beforeAlt: "Kitchen before remodel",
    afterAlt: "Kitchen completed remodel",
  },
  {
    before: "img/WhatsApp Image 2026-07-30 at 14.22.43 (1).jpeg",
    after: "img/Cocina 2.png",
    beforeAlt: "Interior before finish work",
    afterAlt: "Interior completed finish work",
  },
  {
    before: "img/Entry columns made out of stone 3.jpeg",
    after: "img/Gate entry.png",
    beforeAlt: "Exterior before upgrade",
    afterAlt: "Exterior completed upgrade",
  },
  {
    before: "img/WhatsApp Image 2026-07-30 at 14.22.43.jpeg",
    after: "img/Cocina 1.jpeg",
    beforeAlt: "Residential work before",
    afterAlt: "Residential work completed",
  },
];

const galleryCategories = [
  { id: "roofing", label: "Roofing", copy: "Roof repairs, replacements, storm support, and exterior protection." },
  { id: "plumbing", label: "Plumbing", copy: "Fixture swaps, leak support, bathroom plumbing, and utility improvements." },
  { id: "electrical", label: "Electrical", copy: "Lighting updates, fixture installs, and practical electrical improvements." },
  { id: "painting", label: "Painting", copy: "Interior and exterior paint updates with clean prep and finish work." },
  { id: "flooring", label: "Flooring", copy: "Durable flooring updates, transitions, trim, and clean room finishes." },
  { id: "fencing", label: "Fencing", copy: "Fence repairs, replacements, gate work, and exterior boundary upgrades." },
  { id: "kitchen-bath", label: "Kitchen & Bath", copy: "Kitchen and bathroom remodel details with clean modern finishes." },
  { id: "deck-patio", label: "Deck & Patio", copy: "Deck, patio, and outdoor living updates built for everyday use." },
  { id: "doors-windows", label: "Doors & Windows", copy: "Door and window repairs, replacements, trim, and exterior finishing." },
  { id: "concrete", label: "Concrete", copy: "Concrete repairs, patios, walkways, slabs, and exterior improvements." },
  { id: "siding", label: "Siding", copy: "Siding repairs, replacements, weather protection, and curb appeal upgrades." },
  { id: "carpentry", label: "Carpentry", copy: "Custom carpentry repairs, trim details, framing, and finish improvements." },
  { id: "insurance-claims", label: "Insurance Claims", copy: "Storm-related repairs and organized project documentation support." },
  { id: "handyman", label: "Handyman", copy: "Reliable repairs, punch lists, carpentry, doors, windows, and general fixes." },
];

const galleryProjects = galleryCategories.flatMap((category, categoryIndex) =>
  Array.from({ length: 10 }, (_, itemIndex) => {
    const imagePair = galleryImagePairs[(categoryIndex + itemIndex) % galleryImagePairs.length];

    return {
      ...imagePair,
      category: category.id,
      title: `${category.label} Project ${String(itemIndex + 1).padStart(2, "0")}`,
      description: category.copy,
    };
  })
);

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

function getGalleryCard(project) {
  return `
    <article class="ba-card" data-gallery-card="${project.category}">
      <div class="ba-slider">
        <img class="ba-img ba-after" src="${project.after}" alt="${project.afterAlt}" />
        <div class="ba-before-wrap">
          <img class="ba-img ba-before" src="${project.before}" alt="${project.beforeAlt}" />
        </div>
        <span class="ba-label ba-label-left">Before</span>
        <span class="ba-label ba-label-right">Completed</span>
        <img class="ba-watermark" src="img/logo-the-rodriguez-co.png" alt="" aria-hidden="true" />
        <div class="ba-handle"><div class="ba-knob">&harr;</div></div>
      </div>
      <div class="ba-content">
        <h2>${project.title}</h2>
        <p>${project.description}</p>
      </div>
    </article>
  `;
}

function renderGallery(category = "all") {
  if (!galleryGrid) {
    return;
  }

  const gallerySection = galleryGrid.closest("[data-gallery-section]");
  const visibleProjects =
    category === "all" ? galleryProjects : galleryProjects.filter((project) => project.category === category);

  galleryGrid.innerHTML = visibleProjects.map(getGalleryCard).join("");
  gallerySection?.classList.add("in-view");
  initBeforeAfterSliders(galleryGrid);
}

function setActiveGalleryFilter(category) {
  galleryFilters.forEach((button) => {
    button.classList.toggle("active", button.dataset.galleryFilter === category);
  });
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

if ("IntersectionObserver" in window) {
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
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08,
    }
  );

  animatedSections.forEach((section) => animationObserver.observe(section));
} else {
  animatedSections.forEach((section) => section.classList.add("in-view"));
}

menuToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    const href = link.getAttribute("href") || "";
    const url = new URL(href, window.location.href);

    if (url.hash) {
      setActiveLink(url.hash.slice(1));
    }

    header.classList.remove("nav-open");
    megaItems.forEach((item) => item.classList.remove("mega-open"));
    megaItems.forEach((item) => item.querySelector(".mega-toggle")?.setAttribute("aria-expanded", "false"));
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

window.addEventListener("hashchange", () => {
  setActiveLink(getCurrentNavTarget());
});

if (heroCarousel) {
  const heroSlides = [...heroCarousel.querySelectorAll(":scope > img")];
  const heroDots = [...heroCarousel.querySelectorAll(".hero-carousel-dots span")];
  const heroEyebrow = document.querySelector("[data-hero-eyebrow]");
  const heroTitle = document.querySelector("[data-hero-title]");
  const heroCopy = document.querySelector("[data-hero-copy]");
  const heroMessages = [
    {
      eyebrow: "Houston & Pearland Renovation Experts",
      title: "Built Right. Repaired Right.",
      copy: "Roofing to full remodels — done right the first time.",
    },
    {
      eyebrow: "Kitchen & Bath Remodeling",
      title: "Clean Finishes. Clear Communication.",
      copy: "Functional remodels built around your home, timeline, and budget.",
    },
    {
      eyebrow: "Roofing, Repairs & Exterior Work",
      title: "Reliable Help For Every Property.",
      copy: "From storm support to exterior upgrades, we keep the scope clear.",
    },
    {
      eyebrow: "Local, Licensed & Insured",
      title: "Quality Work You Can Trust.",
      copy: "Serving Pearland, Houston, and surrounding communities with dependable workmanship.",
    },
  ];
  let activeHeroSlide = 0;

  if (heroSlides.length > 1) {
    const updateHeroText = (index) => {
      const message = heroMessages[index] || heroMessages[0];

      if (heroEyebrow) {
        heroEyebrow.textContent = message.eyebrow;
      }

      if (heroTitle) {
        heroTitle.textContent = message.title;
      }

      if (heroCopy) {
        heroCopy.textContent = message.copy;
      }
    };

    setInterval(() => {
      heroSlides[activeHeroSlide].classList.remove("active");
      heroDots[activeHeroSlide]?.classList.remove("active");
      activeHeroSlide = (activeHeroSlide + 1) % heroSlides.length;
      heroSlides[activeHeroSlide].classList.add("active");
      heroDots[activeHeroSlide]?.classList.add("active");
      updateHeroText(activeHeroSlide);
    }, 4200);
  }
}

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
  customSelects.forEach((select) => {
    if (!select.contains(event.target)) {
      select.classList.remove("open");
      select.querySelector(".custom-select-trigger")?.setAttribute("aria-expanded", "false");
    }
  });

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

customSelects.forEach((select) => {
  const input = select.querySelector('input[type="hidden"]');
  const trigger = select.querySelector(".custom-select-trigger");
  const triggerText = trigger?.querySelector("span");
  const options = [...select.querySelectorAll(".custom-select-menu button")];

  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = select.classList.toggle("open");
    trigger.setAttribute("aria-expanded", String(isOpen));
  });

  options.forEach((option) => {
    option.addEventListener("click", (event) => {
      event.stopPropagation();
      const value = option.dataset.value || option.textContent.trim();

      if (input) {
        input.value = value;
      }

      if (triggerText) {
        triggerText.textContent = value;
      }

      options.forEach((button) => button.classList.remove("active"));
      option.classList.add("active");
      select.classList.remove("open");
      trigger?.setAttribute("aria-expanded", "false");
    });
  });
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

function initBeforeAfterSliders(root = document) {
  const beforeAfterSliders = [...root.querySelectorAll(".ba-slider")];

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
}

galleryFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.galleryFilter || "all";

    setActiveGalleryFilter(category);
    renderGallery(category);
  });
});

setActiveGalleryFilter("all");
renderGallery("all");

if (!galleryGrid) {
  initBeforeAfterSliders();
}

if (bookingFlow) {
  const fileInput = bookingFlow.querySelector("[data-booking-file]");
  const fileName = bookingFlow.querySelector("[data-booking-file-name]");

  fileInput?.addEventListener("change", () => {
    const fileCount = fileInput.files.length;
    fileName.textContent = fileCount === 0 ? "No files selected" : `${fileCount} file${fileCount === 1 ? "" : "s"} selected`;
  });
}
