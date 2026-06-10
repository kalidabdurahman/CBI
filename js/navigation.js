function navigateToPage(targetPage) {
  const activePage = document.querySelector('.page.active');
  if (activePage) {
      activePage.classList.remove('active', 'animate-in');
  }

  const newPage = document.getElementById(targetPage);
  newPage.classList.add('active');

  if (targetPage === 'home') {
      document.body.classList.add('home-active');
  } else {
      document.body.classList.remove('home-active');
  }

  if (targetPage !== 'gallery') {
      newPage.classList.add('animate-in');
  } else {
      revealGalleryItems();
  }

  const heroBtns = document.querySelector(".hero-top-right");
  if (heroBtns) {
    heroBtns.style.display = targetPage === "home" ? "flex" : "none";
  }
}

document.addEventListener("DOMContentLoaded", function () {
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
