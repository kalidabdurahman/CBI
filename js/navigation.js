function syncNavigationState(targetPage) {
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    const isCurrent = link.getAttribute('data-page') === targetPage;
    link.classList.toggle('is-current', isCurrent);

    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  document.querySelectorAll('.mobile-nav-links a').forEach(link => {
    const isCurrent = link.getAttribute('href') === `#${targetPage}`;
    link.classList.toggle('is-current', isCurrent);

    if (isCurrent) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function navigateToPage(targetPage) {
  const activePage = document.querySelector('.page.active');
  if (activePage) {
      activePage.classList.remove('active', 'animate-in');
  }

  const newPage = document.getElementById(targetPage);
  if (!newPage) return;

  newPage.classList.add('active');

  if (targetPage === 'home') {
      document.body.classList.add('home-active');
  } else {
      document.body.classList.remove('home-active');
  }

  if (targetPage !== 'gallery') {
      newPage.classList.add('animate-in');
  } else if (typeof activateGallery === 'function') {
      activateGallery();
  }

  const heroBtns = document.querySelector(".hero-top-right");
  if (heroBtns) {
    heroBtns.style.display = targetPage === "home" ? "flex" : "none";
  }

  syncNavigationState(targetPage);
  window.scrollTo({ top: 0, behavior: 'auto' });

  const pageHeading = newPage.querySelector('h1, h2');
  if (pageHeading) {
    pageHeading.setAttribute('tabindex', '-1');
    pageHeading.focus({ preventScroll: true });
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const initialActivePage = document.querySelector('.page.active');
  const initialPageId = initialActivePage ? initialActivePage.id : "";
  if (initialPageId === "home") {
      document.body.classList.add("home-active");
  } else {
      document.body.classList.remove("home-active");
  }

  const initialHeroBtns = document.querySelector(".hero-top-right");
  if (initialHeroBtns) {
    initialHeroBtns.style.display = initialPageId === "home" ? "flex" : "none";
  }

  syncNavigationState(initialPageId);

  const logo = document.querySelector('.logo-left a');
  if (logo) {
    logo.addEventListener('click', function(event) {
      event.preventDefault();
      navigateToPage('home');
    });
  }

  // Handle click on navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault();
          const targetPage = this.getAttribute('data-page');
          navigateToPage(targetPage);
      });
  });

  // Add class to body on scroll
  window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
          document.body.classList.add("scrolled");
      } else {
          document.body.classList.remove("scrolled");
      }
  });

  const heroTierLink = document.querySelector('.hero-btn.nav-link[data-page="tiered-collections"]');
  if (heroTierLink) {
    heroTierLink.addEventListener('click', e => {
      e.preventDefault();
      navigateToPage('tiered-collections');
    });
  }
});
