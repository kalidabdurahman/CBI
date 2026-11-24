(() => {
  const guide = document.getElementById("wedding-guide");
  const viewport = document.getElementById("weddingViewport");
  const track = document.getElementById("weddingTrack");
  const slides = Array.from(track.querySelectorAll(".guide-slide"));
  const arrows = guide.querySelectorAll("[data-dir]");
  const dotRow = document.getElementById("weddingDots");
  const count = document.getElementById("weddingPageCount");
  const title = document.getElementById("weddingSlideName");
  const announcement = document.getElementById("carouselAnnounce");
  let current = 0;

  const dots = slides.map((slide, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Go to slide ${index + 1} of ${slides.length}: ${slide.dataset.title}`);
    dot.addEventListener("click", () => showSlide(index));
    dotRow.append(dot);
    return dot;
  });

  function showSlide(index) {
    const focused = document.activeElement;
    current = Math.max(0, Math.min(index, slides.length - 1));
    track.style.transform = `translateX(${-current * 100}%)`;

    slides.forEach((slide, i) => {
      slide.inert = i !== current;
      slide.setAttribute("aria-hidden", String(i !== current));
      dots[i].classList.toggle("active", i === current);
      dots[i].setAttribute("aria-current", String(i === current));
    });
    arrows.forEach(arrow => {
      const target = current + Number(arrow.dataset.dir);
      arrow.disabled = target < 0 || target >= slides.length;
    });
    count.textContent = `${current + 1} of ${slides.length}`;
    title.textContent = slides[current].dataset.title;
    announcement.textContent = `Slide ${count.textContent}: ${title.textContent}`;
    if (guide.contains(focused) && (focused.disabled || focused.closest("[inert]"))) {
      dots[current].focus({ preventScroll: true });
    }
  }

  arrows.forEach(arrow => {
    arrow.addEventListener("click", () => showSlide(current + Number(arrow.dataset.dir)));
  });
  guide.addEventListener("keydown", event => {
    const destinations = { ArrowRight: current + 1, ArrowLeft: current - 1, Home: 0, End: slides.length - 1 };
    if (!Object.hasOwn(destinations, event.key) || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    showSlide(destinations[event.key]);
  });

  const touchLayout = window.matchMedia("(max-width: 1024px)");
  let dragStart;
  viewport.addEventListener("pointerdown", event => {
    if (!touchLayout.matches || event.pointerType !== "touch" || !event.isPrimary || event.target.closest("a, button")) return;
    dragStart = { x: event.clientX, y: event.clientY };
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointerup", event => {
    if (!dragStart || event.pointerType !== "touch" || !event.isPrimary) return;
    const dx = event.clientX - dragStart.x;
    const dy = event.clientY - dragStart.y;
    dragStart = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) {
      showSlide(current + (dx < 0 ? 1 : -1));
    }
  });
  viewport.addEventListener("lostpointercapture", () => { dragStart = null; });
  showSlide(0);
})();

(() => {
  const form = document.getElementById("weddingInquiryForm");
  const page = form.closest(".page");
  const heading = document.getElementById("weddingFormHeading");
  const status = document.getElementById("weddingInquirySent");
  const date = document.getElementById("weddingDate");
  const dateError = document.getElementById("weddingDateError");
  const method = document.getElementById("weddingReplyMethod");
  const email = document.getElementById("weddingEmail");
  const phone = document.getElementById("weddingPhone");
  const photo = document.getElementById("weddingPhoto");
  const removePhoto = document.getElementById("removeWeddingPhoto");
  const bakeryCalendar = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago", year: "numeric", month: "numeric", day: "numeric"
  });

  const returnUrl = new URL(window.location.pathname, window.location.href);
  returnUrl.searchParams.set("wedding-inquiry", "sent");
  form.elements.namedItem("_next").value = returnUrl.href;

  function focusInquiryForm() {
    heading.focus({ preventScroll: true });
    heading.scrollIntoView({ block: "start" });
  }

  page.querySelectorAll('a[href="#weddingFormHeading"]').forEach(link => {
    link.addEventListener("click", event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      focusInquiryForm();
    });
  });

  document.addEventListener("DOMContentLoaded", () => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("wedding-inquiry") === "sent") {
      url.searchParams.delete("wedding-inquiry");
      url.hash = status.id;
      history.replaceState(history.state, "", url);
      navigateToPage(page.id);
      form.reset();
      status.textContent = form.dataset.successMessage;
      status.classList.add("is-success");
      status.focus({ preventScroll: true });
      status.scrollIntoView({ block: "center" });
      return;
    }
    const target = window.location.hash.slice(1);
    if (target !== page.id && target !== heading.id && target !== status.id) return;
    navigateToPage(page.id);
    if (target !== page.id) focusInquiryForm();
  });

  function syncWeddingDate() {
    const parts = Object.fromEntries(bakeryCalendar.formatToParts(new Date()).map(({ type, value }) => [type, value]));
    const earliest = new Date(Date.UTC(+parts.year, +parts.month - 1, +parts.day + 21));
    date.min = earliest.toISOString().slice(0, 10);
    let error = "";
    if (date.value && date.value < date.min) {
      error = "Please choose a wedding date at least 3 weeks from today.";
    } else {
      error = getBlockedPickupDateMessage(date.value);
    }
    date.setCustomValidity(error);
    dateError.textContent = error;
    if (error) date.setAttribute("aria-invalid", "true");
    else date.removeAttribute("aria-invalid");
  }

  date.addEventListener("input", syncWeddingDate);
  date.addEventListener("change", syncWeddingDate);
  date.addEventListener("focus", syncWeddingDate);
  // Refresh the minimum before the email handler checks validity, even across midnight.
  form.addEventListener("submit", syncWeddingDate, { capture: true });

  function syncContactFields() {
    const prefersText = method.value === "Text";
    email.disabled = prefersText;
    email.closest(".contact-field").hidden = prefersText;
    phone.disabled = !prefersText;
    phone.closest(".contact-field").hidden = !prefersText;
  }

  function syncPhoto() {
    const file = photo.files[0];
    let error = "";
    if (file) {
      // Some phone photo pickers supply a filename without a specific MIME type.
      const genericType = !file.type || file.type === "application/octet-stream";
      const knownPhoto = /\.(avif|bmp|gif|heic|heif|jpe?g|png|tiff?|webp)$/i.test(file.name);
      if (!file.type.startsWith("image/") && !(genericType && knownPhoto)) {
        error = "Choose an image file for your inspiration photo.";
      } else if (!file.size || file.size > 10_000_000) {
        error = file.size ? "Choose a photo that is 10 MB or smaller." : "This photo is empty. Choose another image.";
      }
    }
    photo.setCustomValidity(error);
    removePhoto.hidden = !file;
  }

  photo.addEventListener("change", () => {
    syncPhoto();
    photo.reportValidity();
  });
  removePhoto.addEventListener("click", () => {
    photo.value = "";
    syncPhoto();
    photo.focus();
  });

  function syncForm() {
    syncWeddingDate();
    syncContactFields();
    syncPhoto();
  }

  method.addEventListener("change", syncContactFields);
  form.addEventListener("reset", () => queueMicrotask(syncForm));
  window.addEventListener("pageshow", syncForm);
  syncForm();
})();
