const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

function setMenuOpen(open) {
  navLinks.classList.toggle("open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
  menuButton.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
}

menuButton.addEventListener("click", () => {
  setMenuOpen(!navLinks.classList.contains("open"));
});

navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    setMenuOpen(false);
  });
});

const heroCarousel = document.querySelector(".media-frame");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDotsContainer = document.querySelector(".hero-carousel-dots");
const heroCarouselTimerDelay = 5000;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let activeHeroSlide = 0;
let heroCarouselTimer;
let heroCarouselHovered = false;

function stopHeroCarousel() {
  window.clearInterval(heroCarouselTimer);
}

function startHeroCarousel() {
  stopHeroCarousel();
  if (prefersReducedMotion || heroCarouselHovered || heroCarousel.contains(document.activeElement)) return;
  heroCarouselTimer = window.setInterval(() => showHeroSlide(activeHeroSlide + 1), heroCarouselTimerDelay);
}

function showHeroSlide(index) {
  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    const active = slideIndex === activeHeroSlide;
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
  });
  [...heroDotsContainer.children].forEach((dot, dotIndex) => {
    dot.setAttribute("aria-pressed", String(dotIndex === activeHeroSlide));
  });
  startHeroCarousel();
}

heroSlides.forEach((_, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Mostrar imagen ${index + 1}`);
  dot.setAttribute("aria-pressed", "false");
  dot.addEventListener("click", () => showHeroSlide(index));
  heroDotsContainer.append(dot);
});

document.querySelector(".hero-carousel-prev").addEventListener("click", () => showHeroSlide(activeHeroSlide - 1));
document.querySelector(".hero-carousel-next").addEventListener("click", () => showHeroSlide(activeHeroSlide + 1));
heroCarousel.addEventListener("mouseenter", () => {
  heroCarouselHovered = true;
  stopHeroCarousel();
});
heroCarousel.addEventListener("mouseleave", () => {
  heroCarouselHovered = false;
  startHeroCarousel();
});
heroCarousel.addEventListener("focusin", stopHeroCarousel);
heroCarousel.addEventListener("focusout", event => {
  if (!heroCarousel.contains(event.relatedTarget)) startHeroCarousel();
});
showHeroSlide(0);

document.querySelectorAll("[data-service]").forEach(link => {
  link.addEventListener("click", () => {
    document.getElementById("servicio").value = link.dataset.service;
  });
});

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const message = [
    "Hola, quiero solicitar información sobre un servicio.",
    `Nombre: ${data.get("nombre")}`,
    `Teléfono: ${data.get("telefono")}`,
    `Correo: ${data.get("email") || "No indicado"}`,
    `Servicio: ${data.get("servicio") || "No especificado"}`,
    `Mensaje: ${data.get("mensaje") || "Sin mensaje adicional"}`
  ].join("\n");

  status.textContent = "Abriendo WhatsApp para continuar tu solicitud...";
  window.location.assign(`https://wa.me/51938409513?text=${encodeURIComponent(message)}`);
});

