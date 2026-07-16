document.addEventListener("DOMContentLoaded", () => {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const menuPanel  = mobileMenu?.querySelector(".mobile-menu-panel");
  const closeBtn   = document.querySelector(".close-menu");

  if (!hamburger || !mobileMenu || !menuPanel || !closeBtn) {
    console.error("Missing mobile menu elements");
    return;
  }

  let previousBodyOverflow = "";
  let closeFallbackTimer = null;
  let closeCompletionHandler = null;
  const closeFallbackMs = 280;

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
    hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  function getMenuFocusables() {
    return Array.from(menuPanel.querySelectorAll('a[href], button:not([disabled])'));
  }

  function openMenu() {
    clearCloseCompletion();
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    hamburger.classList.add("open");
    mobileMenu.classList.remove("closing");
    mobileMenu.classList.add("open");
    syncMenuState(true);
    menuPanel.scrollTop = 0;
    closeBtn.focus();
  }

  function finishClose(restoreFocus) {
    clearCloseCompletion();
    mobileMenu.classList.remove("open", "closing");
    hamburger.classList.remove("open");
    syncMenuState(false);
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

  mobileMenu.addEventListener("click", event => {
    if (event.target === mobileMenu) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", event => {
    if (!mobileMenu.classList.contains("open")) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key === "Tab") {
      const focusables = getMenuFocusables();
      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];

      if (!firstFocusable || !lastFocusable) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      } else if (!menuPanel.contains(document.activeElement)) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  });

  const desktopNavigation = window.matchMedia("(min-width: 1025px)");
  desktopNavigation.addEventListener("change", event => {
    if (event.matches && (mobileMenu.classList.contains("open") || mobileMenu.classList.contains("closing"))) {
      finishClose(false);
    }
  });

  document.querySelectorAll(".mobile-nav-links a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const targetPage = link.getAttribute("href").substring(1);

      closeMenu(false);
      navigateToPage(targetPage);
    });
  });
});
