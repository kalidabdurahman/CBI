document.addEventListener("DOMContentLoaded", function () {
    // Function to handle displaying the selected pricing information
    document.querySelectorAll('.cake-type-button').forEach(button => {
        button.addEventListener('click', function () {
            const type = this.getAttribute('data-type');

            // Hide all pricing info sections
            document.querySelectorAll('.pricing-info').forEach(info => {
                info.classList.remove('active');
            });

            // Show the selected pricing info
            const selectedInfo = document.getElementById(type);
            if (selectedInfo) {
                selectedInfo.classList.add('active');
            }
        });
    });
});
