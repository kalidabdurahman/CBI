document.addEventListener("DOMContentLoaded", () => {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn   = document.querySelector(".close-menu");

  if (!hamburger || !mobileMenu || !closeBtn) {
    console.error("🍔 Missing burger or menu elements");
    return;
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    // start pop-out
    mobileMenu.classList.add("closing");
    hamburger.classList.remove("open");
  
    // once the animation finishes, clean up
    mobileMenu.addEventListener("animationend", function handler() {
      mobileMenu.classList.remove("open", "closing");
      mobileMenu.removeEventListener("animationend", handler);
    });
  });
});
