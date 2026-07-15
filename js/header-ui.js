document.addEventListener("DOMContentLoaded", () => {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn   = document.querySelector(".close-menu");

  if (!hamburger || !mobileMenu || !closeBtn) {
    console.error("Missing mobile menu elements");
    return;
  }

  let previousBodyOverflow = "";
  let closeFallbackTimer = null;
  let closeCompletionHandler = null;
  const closeFallbackMs = 380;

  function clearCloseCompletion() {
    if (closeFallbackTimer) {
      window.clearTimeout(closeFallbackTimer);
      closeFallbackTimer = null;
    }

    if (closeCompletionHandler) {
      mobileMenu.removeEventListener("transitionend", closeCompletionHandler);
      closeCompletionHandler = null;
    }
  }

  function syncMenuState(isOpen) {
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  function openMenu() {
    clearCloseCompletion();
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    hamburger.classList.add("open");
    mobileMenu.classList.remove("closing");
    mobileMenu.classList.add("open");
    syncMenuState(true);
    closeBtn.focus();
  }

  function finishClose(restoreFocus) {
    clearCloseCompletion();
    mobileMenu.classList.remove("open", "closing");
    document.body.style.overflow = previousBodyOverflow;

    if (restoreFocus) {
      hamburger.focus();
    }
  }

  function closeMenu(restoreFocus = true) {
    if (mobileMenu.classList.contains("closing")) {
      return;
    }

    if (!mobileMenu.classList.contains("open")) {
      syncMenuState(false);
      return;
    }

    hamburger.classList.remove("open");
    mobileMenu.classList.add("closing");
    syncMenuState(false);

    closeCompletionHandler = function handler(event) {
      if (event.target !== mobileMenu || event.propertyName !== "opacity") {
        return;
      }

      finishClose(restoreFocus);
    };

    mobileMenu.addEventListener("transitionend", closeCompletionHandler);

    closeFallbackTimer = window.setTimeout(() => {
      finishClose(restoreFocus);
    }, closeFallbackMs);
  }

  syncMenuState(false);

  hamburger.addEventListener("click", () => {
    if (mobileMenu.classList.contains("open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  closeBtn.addEventListener("click", () => {
    closeMenu();
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
      event.preventDefault();
      closeMenu();
    }
  });

  document.querySelectorAll(".mobile-nav-links a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetPage = link.getAttribute("href").substring(1);

      closeMenu();
      navigateToPage(targetPage);
    });
  });
});
