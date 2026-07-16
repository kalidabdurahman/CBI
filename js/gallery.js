let featuredPreviewCards;
let galleryEmptyMessage;
let galleryCurrentLabel;
let galleryPage;
let galleryActivated = false;
let galleryInitialized = false;
let lightbox;
let lightboxImage;
let currentIndex = 0;
let lastLightboxTrigger = null;

const lightboxWarmCache = new Set();

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function getVisibleGalleryItems() {
    return Array.from(document.querySelectorAll('#galleryGrid .gallery-item'))
        .filter(item => !item.classList.contains('filtered-out'));
}

function getGalleryColumnCount() {
    if (window.innerWidth <= 420) return 1;
    if (window.innerWidth <= 768) return 2;
    if (window.innerWidth <= 1024) return 3;
    return 4;
}

function prioritizeGalleryRow(images, allowHighPriority) {
    const rowSize = Math.min(getGalleryColumnCount(), images.length);

    images.slice(0, rowSize).forEach((image, index) => {
        image.loading = 'eager';

        if (allowHighPriority && index < 2) {
            image.fetchPriority = 'high';
        }
    });
}

function markGalleryImageReady(image) {
    if (image.classList.contains('is-loaded')) return;

    const reveal = () => {
        const finish = () => {
            window.requestAnimationFrame(() => image.classList.add('is-loaded'));
        };

        if (typeof image.decode === 'function') {
            image.decode().then(finish).catch(finish);
        } else {
            finish();
        }
    };

    if (image.complete && image.naturalWidth > 0) {
        reveal();
        return;
    }

    image.addEventListener('load', reveal, { once: true });
    image.addEventListener('error', () => image.classList.add('is-loaded'), { once: true });
}

function activateGallery() {
    if (galleryActivated) return;

    galleryActivated = true;

    const previewImages = Array.from(document.querySelectorAll('.featured-preview-card img'));
    prioritizeGalleryRow(previewImages, true);
    prioritizeGalleryRow(getVisibleGalleryItems(), false);
}

function formatGalleryLabel(category) {
    if (category === 'all') return 'All Cakes';

    return category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function applyGalleryFilter(category) {
    const galleryItems = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));

    galleryItems.forEach(item => {
        const matches = category === 'all' || item.dataset.category === category;
        item.classList.toggle('filtered-out', !matches);
    });

    featuredPreviewCards.forEach(card => {
        const isActive = card.dataset.filterTarget === category;
        card.classList.toggle('active', isActive);
        card.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    if (galleryCurrentLabel) {
        galleryCurrentLabel.textContent = formatGalleryLabel(category);
    }

    const visibleItems = getVisibleGalleryItems();
    galleryEmptyMessage.classList.toggle('show', visibleItems.length === 0);

    if (galleryActivated) {
        prioritizeGalleryRow(visibleItems, false);
    }
}

function getLightboxSource(image) {
    return image.dataset.fullSrc || image.currentSrc || image.src;
}

function warmLightboxNeighbor(index, visibleItems) {
    if (!visibleItems.length) return;

    const normalizedIndex = (index + visibleItems.length) % visibleItems.length;
    const source = getLightboxSource(visibleItems[normalizedIndex]);

    if (lightboxWarmCache.has(source)) return;
    lightboxWarmCache.add(source);

    const image = new Image();
    image.decoding = 'async';
    image.src = source;

    if (typeof image.decode === 'function') {
        image.decode().catch(() => lightboxWarmCache.delete(source));
    }
}

function warmAdjacentLightboxImages(visibleItems) {
    warmLightboxNeighbor(currentIndex - 1, visibleItems);
    warmLightboxNeighbor(currentIndex + 1, visibleItems);
}

function showLightbox() {
    const visibleItems = getVisibleGalleryItems();
    if (!visibleItems.length) return;

    const wasClosed = lightbox.getAttribute('aria-hidden') === 'true';

    if (currentIndex < 0 || currentIndex >= visibleItems.length) {
        currentIndex = 0;
    }

    const selectedImage = visibleItems[currentIndex];
    const source = getLightboxSource(selectedImage);
    const absoluteSource = new URL(source, document.baseURI).href;

    if (lightboxImage.src !== absoluteSource) {
        lightboxImage.src = source;
    }

    lightboxImage.alt = selectedImage.alt;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (wasClosed) {
        document.querySelector('.close-lightbox').focus();
    }

    window.setTimeout(() => warmAdjacentLightboxImages(visibleItems), 0);
}

function hideLightbox() {
    if (lightbox.getAttribute('aria-hidden') === 'true') return;

    lightbox.style.display = 'none';
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (lastLightboxTrigger) {
        lastLightboxTrigger.focus();
    }
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

document.addEventListener('DOMContentLoaded', function () {
    if (galleryInitialized) return;
    galleryInitialized = true;

    galleryPage = document.getElementById('gallery');
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
                galleryGrid.scrollIntoView({
                    behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const backToTopBtn = document.getElementById('backToTop');
    let scrollFrame = null;

    window.addEventListener('scroll', () => {
        if (scrollFrame !== null) return;

        scrollFrame = window.requestAnimationFrame(() => {
            const galleryIsActive = galleryPage.classList.contains('active');
            backToTopBtn.style.display = galleryIsActive && window.scrollY > 50
                ? 'block'
                : 'none';
            scrollFrame = null;
        });
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion() ? 'auto' : 'smooth'
        });
    });

    applyGalleryFilter('all');

    const allGalleryImages = Array.from(document.querySelectorAll('#galleryGrid .gallery-item'));
    allGalleryImages.forEach(markGalleryImageReady);

    lightbox = document.getElementById('lightbox');
    lightboxImage = document.querySelector('.lightbox-image');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    allGalleryImages.forEach(img => {
        img.setAttribute('role', 'button');
        img.setAttribute('tabindex', '0');
        img.setAttribute('aria-label', `Open ${img.alt} in the gallery viewer`);

        img.addEventListener('click', () => {
            const visibleItems = getVisibleGalleryItems();
            currentIndex = visibleItems.indexOf(img);

            if (currentIndex !== -1) {
                lastLightboxTrigger = img;
                showLightbox();
            }
        });

        img.addEventListener('keydown', event => {
            if (event.key !== 'Enter' && event.key !== ' ') return;

            event.preventDefault();
            img.click();
        });
    });

    closeBtn.addEventListener('click', hideLightbox);
    nextBtn.addEventListener('click', showNext);
    prevBtn.addEventListener('click', showPrev);

    lightbox.addEventListener('click', event => {
        if (event.target === lightbox) hideLightbox();
    });

    document.addEventListener('keydown', event => {
        if (lightbox.getAttribute('aria-hidden') === 'true') return;

        if (event.key === 'Escape') hideLightbox();
        if (event.key === 'ArrowRight') showNext();
        if (event.key === 'ArrowLeft') showPrev();
    });

    if (galleryPage.classList.contains('active')) {
        activateGallery();
    }
});
