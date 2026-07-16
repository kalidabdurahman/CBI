document.addEventListener("DOMContentLoaded", function () {
    const buttons = Array.from(document.querySelectorAll('.cake-type-button'));
    const panels = Array.from(document.querySelectorAll('.pricing-info'));

    function activatePricingPanel(button) {
        const type = button.getAttribute('data-type');

        buttons.forEach(item => {
            const isActive = item === button;
            item.classList.toggle('active', isActive);
            item.setAttribute('aria-expanded', isActive ? 'true' : 'false');
        });

        panels.forEach(panel => {
            panel.classList.toggle('active', panel.id === type);
        });
    }

    buttons.forEach(button => {
        button.addEventListener('click', function () {
            activatePricingPanel(button);
        });
    });

    if (buttons.length > 0) {
        activatePricingPanel(buttons[0]);
    }
});
