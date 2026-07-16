document.addEventListener("DOMContentLoaded", function () {
    const page = document.getElementById("tiered-collections");
    if (!page || page.dataset.availabilityInitialized === "true") return;

    page.dataset.availabilityInitialized = "true";

    const available = window.CBI_CONFIG?.tieredCollectionsAvailable === true;
    const notice = document.getElementById("tieredAvailabilityNotice");
    const labels = page.querySelectorAll(".tier-availability-label");
    const actions = page.querySelectorAll("[data-tier-action], .tier-action");

    page.dataset.collectionsAvailable = String(available);
    page.classList.toggle("tiered-unavailable", !available);

    if (notice) notice.hidden = available;
    labels.forEach(label => {
        label.hidden = available;
    });

    actions.forEach(action => {
        if (action instanceof HTMLButtonElement ||
            action instanceof HTMLInputElement ||
            action instanceof HTMLSelectElement) {
            action.disabled = !available;
        }

        if (available) {
            action.removeAttribute("aria-disabled");
            return;
        }

        action.setAttribute("aria-disabled", "true");

        if (action instanceof HTMLAnchorElement || action.getAttribute("role") === "button") {
            action.setAttribute("tabindex", "-1");
        }
    });

    function blockUnavailableAction(event) {
        if (available) return;

        const action = event.target.closest("[data-tier-action], .tier-action");
        if (!action || !page.contains(action)) return;

        event.preventDefault();
        event.stopImmediatePropagation();
    }

    page.addEventListener("click", blockUnavailableAction, true);
    page.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            blockUnavailableAction(event);
        }
    }, true);
});
