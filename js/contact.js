document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".email-form").forEach(form => {
    form.addEventListener("submit", sendEmailForm);
  });
});

async function sendEmailForm(event) {
  const form = event.currentTarget;
  const submitButton = form.querySelector("button[type='submit']");
  if (submitButton.disabled || !form.reportValidity()) {
    event.preventDefault();
    return;
  }

  const attachment = form.elements.namedItem("attachment");
  const status = form.querySelector(".contact-form-status");
  const originalLabel = submitButton.textContent;

  function restoreButton() {
    submitButton.disabled = false;
    submitButton.textContent = originalLabel;
  }

  submitButton.disabled = true;
  submitButton.textContent = form.dataset.sendingLabel || "Sending...";
  status.className = "contact-form-status";

  if (attachment?.files.length) {
    status.textContent = "Uploading your photo and sending your inquiry…";
    // Let the browser post the file. Back navigation should allow another submission.
    window.addEventListener("pageshow", () => {
      restoreButton();
      status.textContent = "";
    }, { once: true });
    return;
  }

  event.preventDefault();
  status.textContent = "Sending your message...";

  try {
    const data = new FormData(form);
    if (attachment) data.delete(attachment.name);
    const response = await fetch(form.dataset.ajaxAction || form.action, {
      method: "POST",
      body: data,
      headers: {
        Accept: "application/json"
      }
    });
    const result = await response.json();

    if (!response.ok || result.success === false || result.success === "false") {
      throw new Error(result.message || "Contact form submission failed.");
    }

    form.reset();
    status.classList.add("is-success");
    status.textContent = form.dataset.successMessage || "Message sent. I'll be in touch soon.";
  } catch (error) {
    console.error("Contact form submission failed:", error);
    status.classList.add("is-error");
    status.textContent = "Your message couldn't be sent. Please try again.";
  } finally {
    restoreButton();
  }
}
