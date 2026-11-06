const STORAGE_KEYS = {
  theme: "toa-theme",
  favorites: "toa-favorites",
};

// Read a JSON value from localStorage safely (returns fallback if missing/broken)
function loadFromStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not save to localStorage:", error);
  }
}


/* =1. DARK / LIGHT MODE TOGGLE = */
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

function applyTheme(theme) {
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  if (themeToggle) {
    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  }
}

const savedTheme = loadFromStorage(STORAGE_KEYS.theme, null);
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const newTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    saveToStorage(STORAGE_KEYS.theme, newTheme);
  });
}


/* =2. MOBILE NAVIGATION MENU= */
const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}


/* =4. ADD TO FAVORITES  = */
let favorites = loadFromStorage(STORAGE_KEYS.favorites, []);
const favButtons = document.querySelectorAll(".fav-btn");

function renderFavButton(button) {
  const id = button.dataset.id;
  const isFav = favorites.includes(id);
  const name = button.closest(".recipe-card")?.querySelector("h3")?.textContent
    || document.querySelector("h1")?.textContent
    || "this recipe";

  button.classList.toggle("is-fav", isFav);
  button.setAttribute("aria-pressed", String(isFav));
  button.setAttribute("aria-label", isFav ? `Remove ${name} from favourites` : `Add ${name} to favourites`);
  button.querySelector(".fav-label").textContent = isFav ? "Saved" : "Favorite";
}

// show how many favorites are saved 
function renderFavCount() {
  document.querySelectorAll(".fav-count").forEach((el) => {
    el.textContent = favorites.length;
  });
}

function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((favId) => favId !== id);
  } else {
    favorites.push(id);
  }
  saveToStorage(STORAGE_KEYS.favorites, favorites);
}

// Restore saved favorites 
favButtons.forEach(renderFavButton);
renderFavCount();

favButtons.forEach((button) => {
  button.addEventListener("click", () => {
    toggleFavorite(button.dataset.id);

    document.querySelectorAll(`.fav-btn[data-id="${button.dataset.id}"]`).forEach(renderFavButton);
    renderFavCount();

    // Ilist refresh
    if (currentFilter === "favorites") {
      filterRecipes(currentFilter);
    }
  });
});


/* =3. RECIPE FILTER BY REGION= */
const filterButtons = document.querySelectorAll(".filter-btn");
const recipeCards = document.querySelectorAll(".recipe-grid .recipe-card");
const emptyState = document.getElementById("empty-state");
const filterStatus = document.querySelector(".filter-status");
let currentFilter = "all";

function filterRecipes(filter) {
  currentFilter = filter;
  let visibleCount = 0;

  for (const card of recipeCards) {
    let show;
    if (filter === "all") {
      show = true;
    } else if (filter === "favorites") {
      show = favorites.includes(card.dataset.id);
    } else {
      show = card.dataset.region === filter;
    }

    card.classList.toggle("hidden", !show);
    if (show) visibleCount++;
  }

  if (emptyState) emptyState.classList.toggle("hidden", visibleCount > 0);
  if (filterStatus) {
    filterStatus.textContent = `Showing ${visibleCount} recipe${visibleCount === 1 ? "" : "s"}`;
  }
}

if (filterButtons.length && recipeCards.length) {
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // highlight active button
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      filterRecipes(button.dataset.filter);
    });
  });

  filterRecipes("all");
}


/* =5. INGREDIENT SCALER= */
const scaler = document.querySelector(".scaler");

// Turn decimals into friendly kitchen fractions
function formatQuantity(value) {
  const fractions = { 0.25: "¼", 0.33: "⅓", 0.5: "½", 0.67: "⅔", 0.75: "¾" };
  const whole = Math.floor(value);
  const remainder = Math.round((value - whole) * 100) / 100;

  if (remainder === 0) return String(whole);
  if (fractions[remainder]) return (whole > 0 ? whole : "") + fractions[remainder];
  if (value >= 10) return String(Math.round(value));          // e.g. grams
  return String(Math.round(value * 10) / 10);
}

if (scaler) {
  const baseServings = Number(scaler.dataset.base);
  const servingsInput = scaler.querySelector("input");
  const quantities = document.querySelectorAll(".qty");

  function updateQuantities() {
    let servings = parseInt(servingsInput.value, 10);
    if (isNaN(servings) || servings < 1) servings = 1;
    if (servings > 24) servings = 24;
    servingsInput.value = servings;

    const ratio = servings / baseServings;
    quantities.forEach((qty) => {
      const original = parseFloat(qty.dataset.qty);
      qty.textContent = formatQuantity(original * ratio);

      qty.classList.remove("updated");
      void qty.offsetWidth;
      qty.classList.add("updated");
    });
  }

  scaler.querySelectorAll(".scaler-btn").forEach((button) => {
    button.addEventListener("click", () => {
      servingsInput.value = (parseInt(servingsInput.value, 10) || baseServings) + Number(button.dataset.step);
      updateQuantities();
    });
  });

  servingsInput.addEventListener("change", updateQuantities);
}


/* =6. CONTACT FORM VALIDATION & FEEDBACK= */
const contactForm = document.getElementById("contact-form");

if (contactForm) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const charCount = document.getElementById("char-count");
  const successBox = document.getElementById("form-success");
  const successMessage = document.getElementById("success-message");
  const sendAnother = document.getElementById("send-another");
  const MIN_LENGTH = 21; // "more than 20 characters"

  function showError(input, message) {
    const errorEl = document.getElementById(`${input.id}-error`);
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
    if (errorEl) errorEl.textContent = message;
  }

  function clearError(input) {
    const errorEl = document.getElementById(`${input.id}-error`);
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }

  // character counter for the message field
  messageInput.addEventListener("input", () => {
    const length = messageInput.value.trim().length;
    charCount.textContent = `${length} / ${MIN_LENGTH} characters minimum`;
    charCount.classList.toggle("ok", length >= MIN_LENGTH);
    if (length >= MIN_LENGTH) clearError(messageInput);
  });

  [nameInput, emailInput].forEach((input) => {
    input.addEventListener("input", () => clearError(input));
  });

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the browser from submitting/reloading

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    let isValid = true;

    if (name === "") {
      showError(nameInput, "Please tell us your name.");
      isValid = false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError(emailInput, "Please enter a valid email address.");
      isValid = false;
    }

    if (message.length <= 20) {
      const needed = MIN_LENGTH - message.length;
      showError(messageInput, `Your message must be more than 20 characters (${needed} more to go).`);
      isValid = false;
    }

    if (!isValid) {
      contactForm.querySelector(".invalid")?.focus();
      return;
    }

    const firstName = name.split(" ")[0];
    successMessage.textContent = `Thank you, ${firstName}! We've received your message.`;
    contactForm.classList.add("hidden");
    successBox.classList.remove("hidden");
    successBox.focus();
  });

  sendAnother.addEventListener("click", () => {
    contactForm.reset();
    charCount.textContent = `0 / ${MIN_LENGTH} characters minimum`;
    charCount.classList.remove("ok");
    successBox.classList.add("hidden");
    contactForm.classList.remove("hidden");
    nameInput.focus();
  });
}


/* =7. NEWSLETTER SIGNUP = */
const newsletterForm = document.getElementById("newsletter-form");

if (newsletterForm) {
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterMsg = document.querySelector(".newsletter-msg");

  newsletterForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = newsletterEmail.value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newsletterMsg.textContent = "Please enter a valid email address.";
      newsletterMsg.classList.add("error");
      return;
    }

    newsletterMsg.classList.remove("error");
    newsletterMsg.textContent = `Karibu! ${email} is now subscribed.`;
    newsletterForm.reset();
  });
}


/* =8. Scroll reveal, back-to-top, footer year = */

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const backToTop = document.querySelector(".back-to-top");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 600);
  });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
