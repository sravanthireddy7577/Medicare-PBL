/**
 * MEDICARE+ - Main Global Script
 * Manages Theme Toggle (Dark/Light), Mobile Navigation, Active Links, and Toast Notifications
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileNav();
  highlightActiveLink();
  updateFooterYear();
});

/* ==========================================
   1. Theme Switcher (Dark / Light Mode)
   ========================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("medicare_theme") || "light";

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    if (themeToggleBtn) themeToggleBtn.innerHTML = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    if (themeToggleBtn) themeToggleBtn.innerHTML = "🌙";
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDark = document.body.classList.contains("dark-mode");
      themeToggleBtn.innerHTML = isDark ? "☀️" : "🌙";
      localStorage.setItem("medicare_theme", isDark ? "dark" : "light");
      showToast(isDark ? "Dark theme enabled" : "Light theme enabled", "info");
    });
  }
}

/* ==========================================
   2. Mobile Navigation Toggle
   ========================================== */
function initMobileNav() {
  const mobileToggleBtn = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggleBtn && navLinks) {
    mobileToggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("show");
      mobileToggleBtn.innerHTML = navLinks.classList.contains("show") ? "✕" : "☰";
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileToggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("show");
        mobileToggleBtn.innerHTML = "☰";
      }
    });
  }
}

/* ==========================================
   3. Highlight Active Navigation Item
   ========================================== */
function highlightActiveLink() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll(".nav-links a");
  
  links.forEach(link => {
    const href = link.getAttribute("href");
    if (href === currentPath || (currentPath === "" && href === "index.html")) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/* ==========================================
   4. Update Footer Copyright Year
   ========================================== */
function updateFooterYear() {
  const yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* ==========================================
   5. Dynamic Toast Notification Utility
   ========================================== */
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const icons = {
    success: "✓",
    danger: "⚠",
    warning: "!",
    info: "ℹ"
  };

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span style="font-weight: bold; font-size: 1.1rem;">${icons[type] || "•"}</span>
    <span style="font-size: 0.9rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  // Automatically remove toast after 3.5 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
