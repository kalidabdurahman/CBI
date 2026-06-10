// // Function to initially reveal gallery items with a staggered animation
// function revealGalleryItems() {
//     const galleryItems = document.querySelectorAll('.gallery-item');
//     galleryItems.forEach((item, index) => {
//         // Reset each item's visibility to enable animation on each click
//         item.classList.remove('visible');
//        
//         setTimeout(() => {
//             item.classList.add('visible');
//         }, index * 200); // Adjust delay as needed
//     });
// }

// // Function to handle fade-in on scroll
// function revealOnScroll() {
//     const galleryItems = document.querySelectorAll('.gallery-item');

//     galleryItems.forEach(item => {
//         const itemPosition = item.getBoundingClientRect().top;
//         const windowHeight = window.innerHeight;

//         // Check if the item is within the viewport
//         if (itemPosition < windowHeight - 100) {
//             item.classList.add('visible');
//         }
//     });
// }

let featuredPreviewCards;
let galleryEmptyMessage;
let galleryCurrentLabel;
let lightbox;
let lightboxImage;
let currentIndex = 0;

function getVisibleGalleryItems() {
    return Array.from(document.querySelectorAll('#galleryGrid .gallery-item'))
        .filter(item => !item.classList.contains('filtered-out'));
}

function revealGalleryItems() {
    const galleryItems = getVisibleGalleryItems();

    galleryItems.forEach((item, index) => {
        item.classList.remove('visible');

        setTimeout(() => {
            item.classList.add('visible');
        }, index * 120);
    });
}

// Function to handle fade-in on scroll
function revealOnScroll() {
    const galleryItems = getVisibleGalleryItems();

    galleryItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (itemPosition < windowHeight - 100) {
            item.classList.add('visible');
        }
    });
}

function formatGalleryLabel(category) {
    if (category === 'all') return 'All Cakes';

    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function applyGalleryFilter(category) {
    const galleryItems = document.querySelectorAll('#galleryGrid .gallery-item');

    galleryItems.forEach(item => {
        const matches = category === 'all' || item.dataset.category === category;
        item.classList.toggle('filtered-out', !matches);
        item.classList.remove('visible');
    });

    featuredPreviewCards.forEach(card => {
        card.classList.toggle('active', card.dataset.filterTarget === category);
    });

    if (galleryCurrentLabel) {
        galleryCurrentLabel.textContent = formatGalleryLabel(category);
    }

    const visibleItems = getVisibleGalleryItems();
    galleryEmptyMessage.classList.toggle('show', visibleItems.length === 0);

    revealGalleryItems();
    setTimeout(revealOnScroll, 50);
}

// let wasRedirectedAfterWarning = false;
// const galleryImages = document.querySelectorAll('.gallery-item');
// const lightbox = document.getElementById('lightbox');
// const lightboxImage = document.querySelector('.lightbox-image');
// const closeBtn = document.querySelector('.close-lightbox');
// const prevBtn = document.querySelector('.lightbox-prev');
// const nextBtn = document.querySelector('.lightbox-next');

// let currentIndex = 0;

// galleryImages.forEach((img, index) => {
//     img.addEventListener('click', () => {
//         currentIndex = index;
//         showLightbox();
//     });
// });

// function showLightbox() {
//     lightboxImage.src = galleryImages[currentIndex].src;
//     lightbox.style.display = 'flex';
// }

// function hideLightbox() {
//     lightbox.style.display = 'none';
// }

// function showNext() {
//     currentIndex = (currentIndex + 1) % galleryImages.length;
//     showLightbox();
// }

// function showPrev() {
//     currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
//     showLightbox();
// }

// closeBtn.addEventListener('click', hideLightbox);
// nextBtn.addEventListener('click', showNext);
// prevBtn.addEventListener('click', showPrev);

function showLightbox() {
    const visibleItems = getVisibleGalleryItems();
    if (!visibleItems.length) return;

    if (currentIndex < 0 || currentIndex >= visibleItems.length) {
        currentIndex = 0;
    }

    lightboxImage.src = visibleItems[currentIndex].src;
    lightboxImage.alt = visibleItems[currentIndex].alt;
    lightbox.style.display = 'flex';
}

function hideLightbox() {
    lightbox.style.display = 'none';
}

function showNext() {
    const visibleItems = getVisibleGalleryItems();
    if (!visibleItems.length) return;

    currentIndex = (currentIndex + 1) % visibleItems.length;
    showLightbox();
}

function showPrev() {
    const visibleItems = getVisibleGalleryItems();
    if (!visibleItems.length) return;

    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showLightbox();
}

document.addEventListener("DOMContentLoaded", function () {
    featuredPreviewCards = document.querySelectorAll('.featured-preview-card');
    galleryEmptyMessage = document.getElementById('galleryEmptyMessage');
    galleryCurrentLabel = document.getElementById('galleryCurrentLabel');

    featuredPreviewCards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.dataset.filterTarget;
            const isAlreadyActive = card.classList.contains('active');

            applyGalleryFilter(isAlreadyActive ? 'all' : category);

            const galleryGrid = document.getElementById('galleryGrid');
            if (galleryGrid) {
                galleryGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ▼ Back to Top button on Gallery ▼
    const backToTopBtn = document.getElementById("backToTop");

    window.addEventListener("scroll", () => {
      // Only show when Gallery page is active AND scrolled down
      const galleryActive = document
        .getElementById("gallery")
        .classList.contains("active");

      if (galleryActive && window.scrollY > 50) {
        backToTopBtn.style.display = "block";
      } else {
        backToTopBtn.style.display = "none";
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    // ▲ end Back to Top ▼

    // Add event listener for scroll events
    window.addEventListener('scroll', revealOnScroll);

    // Trigger the function on initial load
    revealOnScroll();

    applyGalleryFilter('all');

    const allGalleryImages = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));
    lightbox = document.getElementById('lightbox');
    lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    allGalleryImages.forEach((img) => {
        img.addEventListener('click', () => {
            const visibleItems = getVisibleGalleryItems();
            currentIndex = visibleItems.indexOf(img);

            if (currentIndex !== -1) {
                showLightbox();
            }
        });
    });

    closeBtn.addEventListener('click', hideLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    // Optional: Close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') hideLightbox();
        if (e.key === 'ArrowRight') showNext();
        if (e.key === 'ArrowLeft') showPrev();
    });
});
