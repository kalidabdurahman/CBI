document.addEventListener("DOMContentLoaded", function () {
    // Function to handle fade-in on scroll for reviews
    function revealReviewsOnScroll() {
        const reviews = document.querySelectorAll('#reviews .review');

        reviews.forEach(review => {
            const reviewPosition = review.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;

            // Check if the review is within the viewport
            if (reviewPosition < windowHeight - 100) {
                review.classList.add('visible');
            }
        });
    }

    // Add event listener for scroll events
    window.addEventListener('scroll', revealReviewsOnScroll);

    // Trigger the function on initial load
    revealReviewsOnScroll();

    const reviewImages = Array.from({ length: 41 }, (_, i) => `images/reviews/review${i + 1}.png`);

    const reviewSets = [
      reviewImages.slice(0, 10),
      reviewImages.slice(10, 20),
      reviewImages.slice(20, 30),
      reviewImages.slice(30, 41),
    ];

    const cornerIDs = ["review1", "review2", "review3", "review4"];
    const reviewIndexes = [0, 0, 0, 0];

    // Different intervals in milliseconds
    const autoSlideSpeeds = [2500, 4000, 3000, 5000];

    cornerIDs.forEach((id, i) => {
      const container = document.getElementById(id);
      const img = container.querySelector("img");
      const images = reviewSets[i];

      // Show the first image
      img.src = images[0];

      // Auto slide logic
      setInterval(() => {
        reviewIndexes[i] = (reviewIndexes[i] + 1) % images.length;
        img.src = images[reviewIndexes[i]];
      }, autoSlideSpeeds[i]);

      // Swipe Support (optional)
      let startX = 0;
      container.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
      });

      container.addEventListener("touchend", e => {
        const endX = e.changedTouches[0].clientX;
        const diff = endX - startX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            // Swipe right = previous
            reviewIndexes[i] = (reviewIndexes[i] - 1 + images.length) % images.length;
          } else {
            // Swipe left = next
            reviewIndexes[i] = (reviewIndexes[i] + 1) % images.length;
          }
          img.src = images[reviewIndexes[i]];
        }
      });
    });

    document.querySelectorAll('.review-image').forEach(img => {
      img.addEventListener('click', function() {
        let index = parseInt(img.getAttribute('data-index'));
        const parent = img.parentElement;
        const images = [
          'images/reviews/review1.png',
          'images/reviews/review2.png',
          'images/reviews/review3.png'
        ]; // 🔥 Replace these with your real images

        // Move to next image
        index = (index + 1) % images.length;
        img.src = images[index];
        img.setAttribute('data-index', index);
      });
    });
});
