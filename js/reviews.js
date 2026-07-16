document.addEventListener("DOMContentLoaded", function () {
    const verifiedReviewInventory = Object.freeze([
        {
            quote: "I appreciate your work, hope you get big in your business ❤️❤️ thanks for helping and how amazing and patient your were!! Wish you all the best ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review1.png"
        },
        {
            quote: "Thanks so much for the beautiful cake and for taking our order last minute! Everyone loved it so much",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review2.png"
        },
        {
            quote: "WOW! The most prettiest cake! I don’t even want to touch it 😭❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review3.png"
        },
        {
            quote: "thank uu💕 the cake is exactly how i wanted 🥺🥺",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review4.png"
        },
        {
            quote: "I LOVE IT THANK YOU SO MUCH",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review5.png"
        },
        {
            quote: "NO PROBLEM THANK YOU TASTE SO GOOODDDDD",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review6.png"
        },
        {
            quote: "🥰🥰🥰🥰 will definitely be ordering againnn ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review7.png"
        },
        {
            quote: "oh my goodness. it’s perfect!! tysm for everything! ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review8.png"
        },
        {
            quote: "hey queen! i want to personally thank you for making my besties cake 🫶🏾 so freaking good and you really ate that up! we appreciate you so much! ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review9.png"
        },
        {
            quote: "hi love! i just wanted message you and say thank you for the gorgeous cake you did for my party! it was truly amazing and i loved everything about it 🥺🤍 i truly can’t thank you enough, it was exactly how i wanted it! it was soo good!!! ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review10.png"
        },
        {
            quote: "She sent me a pic and it looks GORGEOUS allahuma barik!!!!",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review11.png"
        },
        {
            quote: "thank you so much boo!! i loved it & we all loveddddd the cake. it tasted so good!! 🫶🏾🫶🏾🫶🏾❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review12.png"
        },
        {
            quote: "Thank you so much bareduu the cake was so beautiful and delicious everyone enjoyed it 💕❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review13.png"
        },
        {
            quote: "salam sister that was the best cake ever everyone loved it at my party thank you so much 💕",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review14.png"
        },
        {
            quote: "Just getting better and better as the minutes go by 👏❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review15.png"
        },
        {
            quote: "Hard work always pays off! Keep striving 👏 I remember when you first started 😮❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review16.png"
        },
        {
            quote: "oooo girll I recommended you to herrr",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review17.png"
        },
        {
            quote: "yes ofc it was so good thank you ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review19.png"
        },
        {
            quote: "IT LOOKS SO GOOD!! Thank you",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review21.png"
        },
        {
            quote: "Thank you so much girly! You snapped reallll bad❤️❤️❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review22.png"
        },
        {
            quote: "Thank you so much! It looks so beautiful ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review23.png"
        },
        {
            quote: "you ate down 😻😻😻😻😻❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review24.png"
        },
        {
            quote: "okay you are DOWNNN 🥳🥳❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review26.png"
        },
        {
            quote: "you’re the best!!!!! ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review27.png"
        },
        {
            quote: "I just got it thank you sm sis!! It looks amazing!! I’ll send pics of it as well!!",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review29.png"
        },
        {
            quote: "Lolll thank YOU so much! she showed me it and it looks beautiful 🥺",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review30.png"
        },
        {
            quote: "Thanks again, it was very delicious 😋",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review31.png"
        },
        {
            quote: "Thank you again, Iftu! You’re a gem!",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review32.png"
        },
        {
            quote: "I just sent the rest. Thank you so much!! This cake looks so beautiful ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review33.png"
        },
        {
            quote: "thank you so much, it’s gorgeous",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review34.png"
        },
        {
            quote: "Allahuma barik baby you ate",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review35.png"
        },
        {
            quote: "it was such an amazing cake!!! Can’t wait to order from you! Keep up the amazing work allahuma barik 🫶🏾🫶🏾❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review36.png"
        },
        {
            quote: "Hey love! I just wanted to say thank you so much for the prettyyy cake! It was so delicious 😋",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review37.png"
        },
        {
            quote: "Thank you sm for cake!! It looked so beautiful and tasted even better 🤍❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review38.png"
        },
        {
            quote: "Thank you so much again for the cake again she loved it! ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review39.png"
        },
        {
            quote: "Hi I just saw the cake, it’s sooo cuteee thank you!!! ❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review40.png"
        },
        {
            quote: "Thank you so much! I’m sure I will, you never disappoint. 🙏❤️",
            attribution: "Verified customer",
            _sourceFile: "images/reviews/review41.png"
        }
    ]);

    const reviewsPage = document.getElementById("reviews");
    const carousel = document.getElementById("testimonialCarousel");
    const stage = document.getElementById("testimonialStage");
    const quote = document.getElementById("testimonialQuote");
    const attribution = document.getElementById("testimonialAttribution");
    const previousButton = document.getElementById("testimonialPrevious");
    const nextButton = document.getElementById("testimonialNext");
    const announcement = document.getElementById("testimonialAnnouncement");

    if (!reviewsPage || !carousel || !stage || !quote || !attribution ||
        !previousButton || !nextButton || !announcement) {
        return;
    }

    const carouselReviews = verifiedReviewInventory;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const readingInterval = 5000;
    const transitionLead = 90;
    const transitionDuration = 200;

    let currentIndex = 0;
    let rotationTimer = null;
    let hovered = false;
    let focused = false;
    let swiping = false;
    let transitioning = false;
    let pointerActive = false;
    let pointerStartX = 0;
    let pointerStartY = 0;

    function setReviewLength(quoteText) {
        carousel.dataset.reviewLength = quoteText.length > 135
            ? "long"
            : quoteText.length > 85
                ? "medium"
                : "short";
    }

    function renderReview(shouldAnnounce) {
        const review = carouselReviews[currentIndex];

        quote.textContent = review.quote;
        attribution.textContent = review.attribution;
        setReviewLength(review.quote);

        if (shouldAnnounce) {
            announcement.textContent = `Selected testimonial. ${review.quote} ${review.attribution}.`;
        }
    }

    function clearRotation() {
        if (rotationTimer !== null) {
            window.clearTimeout(rotationTimer);
            rotationTimer = null;
        }
    }

    function canRotate() {
        return reviewsPage.classList.contains("active") &&
            !motionPreference.matches &&
            !hovered &&
            !focused &&
            !carousel.contains(document.activeElement) &&
            !swiping &&
            !document.hidden;
    }

    function scheduleRotation() {
        clearRotation();

        if (!canRotate()) return;

        rotationTimer = window.setTimeout(() => {
            selectReview(currentIndex + 1, false);
        }, readingInterval);
    }

    function selectReview(nextIndex, shouldAnnounce) {
        if (transitioning || carouselReviews.length < 2) return;

        const normalizedIndex = (nextIndex + carouselReviews.length) % carouselReviews.length;
        if (normalizedIndex === currentIndex) return;

        clearRotation();

        if (motionPreference.matches) {
            currentIndex = normalizedIndex;
            renderReview(shouldAnnounce);
            scheduleRotation();
            return;
        }

        transitioning = true;
        stage.classList.add("is-changing");

        window.setTimeout(() => {
            currentIndex = normalizedIndex;
            renderReview(shouldAnnounce);
            stage.classList.remove("is-changing");

            window.setTimeout(() => {
                transitioning = false;
                scheduleRotation();
            }, transitionDuration);
        }, transitionLead);
    }

    function moveReview(direction) {
        selectReview(currentIndex + direction, true);
    }

    previousButton.addEventListener("click", () => moveReview(-1));
    nextButton.addEventListener("click", () => moveReview(1));

    carousel.addEventListener("keydown", event => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

        event.preventDefault();
        moveReview(event.key === "ArrowLeft" ? -1 : 1);
    });

    carousel.addEventListener("mouseenter", () => {
        hovered = true;
        clearRotation();
    });

    carousel.addEventListener("mouseleave", () => {
        hovered = false;
        scheduleRotation();
    });

    carousel.addEventListener("focusin", () => {
        focused = true;
        clearRotation();
    });

    carousel.addEventListener("focusout", () => {
        window.setTimeout(() => {
            focused = carousel.contains(document.activeElement);
            if (!focused) scheduleRotation();
        }, 0);
    });

    stage.addEventListener("pointerdown", event => {
        if (!event.isPrimary) return;

        pointerActive = true;
        swiping = true;
        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        clearRotation();

        if (stage.setPointerCapture) {
            stage.setPointerCapture(event.pointerId);
        }
    });

    stage.addEventListener("pointerup", event => {
        if (!pointerActive || !event.isPrimary) return;

        pointerActive = false;
        swiping = false;

        const horizontalDistance = event.clientX - pointerStartX;
        const verticalDistance = event.clientY - pointerStartY;
        const isHorizontalSwipe = Math.abs(horizontalDistance) >= 56 &&
            Math.abs(horizontalDistance) > Math.abs(verticalDistance) * 1.25;

        if (isHorizontalSwipe) {
            moveReview(horizontalDistance < 0 ? 1 : -1);
        } else {
            scheduleRotation();
        }
    });

    stage.addEventListener("pointercancel", () => {
        pointerActive = false;
        swiping = false;
        scheduleRotation();
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            clearRotation();
        } else {
            scheduleRotation();
        }
    });

    const pageStateObserver = new MutationObserver(() => {
        if (reviewsPage.classList.contains("active")) {
            scheduleRotation();
        } else {
            clearRotation();
        }
    });

    pageStateObserver.observe(reviewsPage, {
        attributes: true,
        attributeFilter: ["class"]
    });

    function handleMotionPreferenceChange() {
        if (motionPreference.matches) {
            clearRotation();
            stage.classList.remove("is-changing");
            transitioning = false;
        }

        scheduleRotation();
    }

    if (motionPreference.addEventListener) {
        motionPreference.addEventListener("change", handleMotionPreferenceChange);
    } else {
        motionPreference.addListener(handleMotionPreferenceChange);
    }

    carousel.dataset.reviewCount = String(carouselReviews.length);
    renderReview(false);
    scheduleRotation();
});
