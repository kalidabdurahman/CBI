document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactFormStatus");

  if (!form || !status) return;

  form.addEventListener("submit", async event => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const submitButton = form.querySelector("button[type='submit']");
    const originalLabel = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = "Sending...";
    status.className = "contact-form-status";
    status.textContent = "Sending your message...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
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
      status.textContent = "Message sent. I'll be in touch soon.";
    } catch (error) {
      console.error("Contact form submission failed:", error);
      status.classList.add("is-error");
      status.textContent = "Your message couldn't be sent. Please try again.";
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalLabel;
    }
  });
});
