document.addEventListener("DOMContentLoaded", function () {
  const logo = document.querySelector('.logo-left a');
  if (logo) {
    logo.addEventListener('click', function(event) {
      event.preventDefault();
      navigateToPage('home');
    });
  }
  

function showFormError(message) {
    const errorBox = document.getElementById(`formErrorStep${currentStep + 1}`);
    if (errorBox) {
      errorBox.textContent = message;
      errorBox.style.display = "block";
      errorBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  
  function clearFormError() {
    const errorBox = document.getElementById(`formErrorStep${currentStep + 1}`);
    if (errorBox) {
      errorBox.textContent = "";
      errorBox.style.display = "none";
    }
  }
  
  

  document.querySelectorAll("input[required], select[required], textarea[required]").forEach(field => {
    field.addEventListener("input", () => {
      if (field.checkValidity()) {
        clearFormError();
      }
    });
  
    field.addEventListener("change", () => {
      if (field.checkValidity()) {
        clearFormError();
      }
    });
  });
  
  

// Handle click on navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const targetPage = this.getAttribute('data-page');
        navigateToPage(targetPage);
    });
});
  

document.querySelector('.order-button').addEventListener('click', function(event) {
    event.preventDefault();
  
    const wasAlreadyOnOrderPage = document.querySelector('#order').classList.contains('active');
    navigateToPage('order');
  
    // Check again *after* short delay to allow page switch
    setTimeout(() => {
      const nowOnOrderPage = document.querySelector('#order').classList.contains('active');
      if (!wasAlreadyOnOrderPage && nowOnOrderPage) {
        const modal = document.getElementById('orderModal');
        modal.style.display = 'flex';
        setTimeout(() => {
          modal.classList.add('show');
        }, 10);
      }
    }, 20);
  });
  
  


// Function to initially reveal gallery items with a staggered animation
function revealGalleryItems() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        // Reset each item's visibility to enable animation on each click
        item.classList.remove('visible');
        
        setTimeout(() => {
            item.classList.add('visible');
        }, index * 200); // Adjust delay as needed
    });
}

// Function to handle fade-in on scroll
function revealOnScroll() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach(item => {
        const itemPosition = item.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Check if the item is within the viewport
        if (itemPosition < windowHeight - 100) {
            item.classList.add('visible');
        }
    });
}

// Add event listener for scroll events
window.addEventListener('scroll', revealOnScroll);

// Trigger the function on initial load
revealOnScroll();



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


// Close the modal when "I Agree" is clicked
document.getElementById('agreeButton').addEventListener('click', function() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show'); // Remove show class to trigger the hiding animation
    setTimeout(() => {
        modal.style.display = 'none'; // Hide the modal after animation completes
    }, 300); // Match the transition duration
});

// Add class to body on scroll
window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        document.body.classList.add("scrolled");
    } else {
        document.body.classList.remove("scrolled");
    }
});

function navigateToPage(targetPage) {
  const activePage = document.querySelector('.page.active');
  if (activePage) {
      activePage.classList.remove('active', 'animate-in');
  }

  const newPage = document.getElementById(targetPage);
  newPage.classList.add('active');

  if (targetPage === 'home') {
      document.body.classList.add('home-active');
  } else {
      document.body.classList.remove('home-active');
  }

  if (targetPage !== 'gallery') {
      newPage.classList.add('animate-in');
  } else {
      revealGalleryItems();
  }
}


document.querySelector('#confirmationMessage a').addEventListener('click', function (e) {
    e.preventDefault();
    navigateToPage('home');

    // Optional: Reset form and show the order header again
    document.getElementById("orderForm").style.display = "block";
    document.getElementById("confirmationMessage").style.display = "none";
    document.getElementById("orderHeader").style.display = "block";

    currentStep = 0;
});


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



async function getExpensesSum() {
    let totalSum = 0;
  
    try {
      const response = await fetch("http://myCoolServer.com/expenses");
  
      if (response.ok) {
        const data = await response.json();
  
        data.res.forEach(item => {
          totalSum += item.amount;
        });
      } else {
        console.log("Failed to fetch expenses.");
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  
    return totalSum;
  }
  

let wasRedirectedAfterWarning = false;
const galleryImages = document.querySelectorAll('.gallery-item');
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const closeBtn = document.querySelector('.close-lightbox');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');

let currentIndex = 0;

galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        currentIndex = index;
        showLightbox();
    });
});

function showLightbox() {
    lightboxImage.src = galleryImages[currentIndex].src;
    lightbox.style.display = 'flex';
}

function hideLightbox() {
    lightbox.style.display = 'none';
}

function showNext() {
    currentIndex = (currentIndex + 1) % galleryImages.length;
    showLightbox();
}

function showPrev() {
    currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    showLightbox();
}

closeBtn.addEventListener('click', hideLightbox);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

// Optional: Close with ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') hideLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});

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




function updatePreview() {
    previewContainer.innerHTML = "";

    const inputs = imageInputsContainer.querySelectorAll("input[type='file']");
    inputs.forEach((input, index) => {
      if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const wrapper = document.createElement("div");
          wrapper.className = "preview-wrapper";
          wrapper.style.position = "relative";
          wrapper.style.display = "inline-block";
          wrapper.style.marginRight = "10px";

          const img = document.createElement("img");
          img.src = e.target.result;
          img.style.maxWidth = "100px";
          img.style.borderRadius = "8px";

          const removeBtn = document.createElement("span");
          removeBtn.innerHTML = "×";
          removeBtn.style.position = "absolute";
          removeBtn.style.top = "0";
          removeBtn.style.right = "5px";
          removeBtn.style.cursor = "pointer";
          removeBtn.style.fontSize = "20px";
          removeBtn.style.color = "#fff";
          removeBtn.style.background = "#d33";
          removeBtn.style.borderRadius = "50%";
          removeBtn.style.width = "20px";
          removeBtn.style.height = "20px";
          removeBtn.style.textAlign = "center";
          removeBtn.style.lineHeight = "20px";
          removeBtn.title = "Remove";

          removeBtn.addEventListener("click", () => {
            input.remove();
            updatePreview(); // re-render previews
          });

          wrapper.appendChild(img);
          wrapper.appendChild(removeBtn);
          previewContainer.appendChild(wrapper);
        };
        reader.readAsDataURL(input.files[0]);
      }
    });
  }

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
  

  // Show the order modal with animation when the order page is opened
    document.querySelector('.nav-link[data-page="order"]').addEventListener('click', function(event) {
        event.preventDefault();
        const modal = document.getElementById('orderModal');
        modal.style.display = 'flex'; // Show the modal
        setTimeout(() => {
            modal.classList.add('show'); // Add the scaling animation
        }, 10); // Short delay to trigger CSS transition
    });



    let currentStep = 0;
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const backBtns = document.querySelectorAll('.prev-step');

    function showStep(step) {
        formSteps.forEach((stepDiv, index) => {
          stepDiv.classList.toggle('active', index === step);
        });
      
        if (step === 1) {
          const cakeType = document.getElementById("cakeType").value;
          if (cakeType) {
            // 1. Populate first
            populateSelect(document.getElementById("flavor"), flavorOptions, "Select a flavor");
            populateSelect(document.getElementById("frosting"), frostingOptions, "Select a frosting");
            populateSelect(document.getElementById("filling"), fillingOptions, "Select a filling (optional)", true);
            populateSelect(document.getElementById("size"), sizeOptions[cakeType] || [], "Select a size");
      
            // 2. Now assign preserved values manually
            const flavorSelect = document.getElementById("flavor");
            const frostingSelect = document.getElementById("frosting");
            const fillingSelect = document.getElementById("filling");
            
            if (preservedFlavor && [...flavorSelect.options].some(opt => opt.value === preservedFlavor)) {
              flavorSelect.value = preservedFlavor;
            }
            if (preservedFrosting && [...frostingSelect.options].some(opt => opt.value === preservedFrosting)) {
              frostingSelect.value = preservedFrosting;
            }
            if (preservedFilling && [...fillingSelect.options].some(opt => opt.value === preservedFilling)) {
              fillingSelect.value = preservedFilling;
            }            
            if (preservedSize) {
              const sizeSelect = document.getElementById("size");
              sizeSelect.value = preservedSize;
      
              // Remove "selected" from placeholder manually if still present
              const firstOption = sizeSelect.querySelector("option[value='']");
              if (firstOption) firstOption.selected = false;
      
              // Set the size info too
              if (sizeDetails[preservedSize]) {
                const { price, serves } = sizeDetails[preservedSize];
                document.getElementById("sizeInfo").innerHTML = `${price} – <em>${serves}</em>`;
              }
            }
          }
        }
      }     
      

      nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const currentStepFields = formSteps[currentStep].querySelectorAll('input, select, textarea');
          let allValid = true;
          let firstInvalidField = null;
      
          // Special case for step 2 inspiration image validation
          if (currentStep === 1) {
            const imageInputs = document.querySelectorAll("input[name='inspirationPic']");
            const hasImage = Array.from(imageInputs).some(input => input.files.length > 0);
      
            if (!hasImage) {
              showFormError("⚠️ Please upload at least one inspiration picture.");
              return; // Stop here and do not proceed
            }
          }
      
          currentStepFields.forEach(field => {
            if (field.type === "file") {
              // Already handled above
              return;
            }
            if (!field.checkValidity()) {
              allValid = false;
              if (!firstInvalidField) {
                firstInvalidField = field;
              }
            }
          });
      
          if (allValid) {
            clearFormError();
            currentStep++;
            showStep(currentStep);
      
            // Repopulate dropdowns in Step 2
            if (currentStep === 1) {
              const cakeType = document.getElementById("cakeType").value;
              if (cakeType) {
                populateSelect(document.getElementById("flavor"), flavorOptions, "Select a flavor");
                populateSelect(document.getElementById("frosting"), frostingOptions, "Select a frosting");
                populateSelect(document.getElementById("filling"), fillingOptions, "Select a filling (optional)", true);
                populateSelect(document.getElementById("size"), sizeOptions[cakeType] || [], "Select a size");
      
                const selectedSize = document.getElementById("size").value;
                if (selectedSize && sizeDetails[selectedSize]) {
                  document.getElementById("sizeInfo").innerHTML = `${sizeDetails[selectedSize].price} – <em>${sizeDetails[selectedSize].serves}</em>`;
                }
              }
            }
          } else {
            if (firstInvalidField) {
              const label = firstInvalidField.closest(".form-group")?.querySelector("label")?.textContent || "a required field";
              showFormError(`⚠️ Please fill out: ${label}`);
              firstInvalidField.focus();
              firstInvalidField.reportValidity();
            }
          }
        });
      });
      
      
      

    backBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    // Auto-set the minimum pickup date (6 days from today)
    const pickupDateField = document.getElementById("pickupDate");
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(minDate.getDate() + 6);
    pickupDateField.min = minDate.toISOString().split("T")[0];

    const deliverySelect = document.getElementById("deliveryOption");
    const deliveryInfo   = document.getElementById("deliveryInfo"); // your hidden div :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}

    deliverySelect.addEventListener("change", e => {
      if (e.target.value === "delivery") {
        deliveryInfo.style.display = "block";
      } else {
        deliveryInfo.style.display = "none";
      }
    });


    const addImageBtn = document.getElementById("addImageBtn");
    const imageInputsContainer = document.getElementById("imageInputsContainer");
    const previewContainer = document.getElementById("previewContainer");
  
    addImageBtn.addEventListener("click", () => {
      const currentInputs = imageInputsContainer.querySelectorAll("input[type='file']");
      if (currentInputs.length < 3) {
        const newInput = document.createElement("input");
        newInput.type = "file";
        newInput.name = "inspirationPic";
        newInput.accept = "image/*";
        newInput.classList.add("inspo-file");
  
        newInput.addEventListener("change", updatePreview);
        imageInputsContainer.appendChild(newInput);
      }
    });

    document.getElementById("cakeType").addEventListener("change", function () {
        const selectedType = this.value;
    
        const tieredNotice = document.getElementById("tieredNotice");
        if (selectedType === "tiered") {
          tieredNotice.style.display = "block";
        } else {
          tieredNotice.style.display = "none";
        }
    
        populateSelect(document.getElementById("flavor"), flavorOptions, "Select a flavor");
        populateSelect(document.getElementById("frosting"), frostingOptions, "Select a frosting");
        populateSelect(document.getElementById("filling"), fillingOptions, "Select a filling (optional)", true);
        populateSelect(document.getElementById("size"), sizeOptions[selectedType] || [], "Select a size");
      });
    
      document.getElementById("size").addEventListener("change", function () {
        const selectedSize = this.value;
        const infoDiv = document.getElementById("sizeInfo");
    
        if (sizeDetails[selectedSize]) {
          const { price, serves } = sizeDetails[selectedSize];
          infoDiv.innerHTML = `~${price} – <em>${serves}</em>`;
        } else {
          infoDiv.innerHTML = "";
        }
      });
  
    // Handle first file input preview
    imageInputsContainer.querySelector("input[type='file']").addEventListener("change", updatePreview);
//   });
  
  


const flavorOptions = [
    "French Vanilla", "Double Chocolate", "Marble", "Confetti",
    "Strawberry", "Red Velvet", "Cookies & Cream"
  ];
  
  const frostingOptions = [
    "Vanilla Buttercream", "Chocolate Buttercream", "Whipped Cream", "Vanilla Ganache", "Chocolate Ganache"
  ];
  
  const fillingOptions = [
    "Cream Cheese","Strawberries", "Strawberries & Cream", "Chocolate Fudge",
    "Cookies & Cream", "Lotus Biscoff", "Reese's Peanut Butter"
  ];
  
  const sizeOptions = {
    heart: ["4\" Heart", "6\" Heart", "8\" Heart"],
    round: ["4\" Round", "6\" Round", "8\" Round", "10\" Round"],
    tiered: [
      "4\" + 6\" Tiered",
      "6\" + 8\" Tiered",
      "8\" + 10\" Tiered",
      "4\" + 6\" + 8\" Tiered",
      "6\" + 8\" + 10\" Tiered"
    ],
    cupcake: ["1/2 Dozen (6)", "1 Dozen (12)", "2 Dozen (24)"]
  };
  
  const sizeDetails = {
    '4" Heart': { price: "$50", serves: "Feeds 3–5" },
    '6" Heart': { price: "$100", serves: "Feeds 13–19" },
    '8" Heart': { price: "$150", serves: "Feeds 25–30" },
  
    '4" Round': { price: "$45", serves: "Feeds 4–8" },
    '6" Round': { price: "$90", serves: "Feeds 12–17" },
    '8" Round': { price: "$130", serves: "Feeds 25–35" },
    '10" Round': { price: "$165", serves: "Feeds 40–50" },
  
    '4" + 6" Tiered': { price: "$145", serves: "Feeds 20–30" },
    '6" + 8" Tiered': { price: "$220", serves: "Feeds 50–60" },
    '8" + 10" Tiered': { price: "$280", serves: "Feeds 90–100" },
    '4" + 6" + 8" Tiered': { price: "$290", serves: "Feeds 70–80" },
    '6" + 8" + 10" Tiered': { price: "$380", serves: "Feeds 115–135" },
  
    "1/2 Dozen (6)": { price: "$25", serves: "6 Cupcakes" },
    "1 Dozen (12)": { price: "$35", serves: "12 Cupcakes" },
    "2 Dozen (24)": { price: "$55", serves: "24 Cupcakes" }
  };
  
  
  
  
  function populateSelect(selectElement, options, placeholderText = "Select an option", includeEmpty = false) {
    const currentValue = selectElement.value; // 🚨 Store current value
    selectElement.innerHTML = "";
  
    const placeholder = document.createElement("option");
    placeholder.disabled = true;
    // placeholder.selected = true;
    placeholder.hidden = true;    // Optional: hides from dropdown
    placeholder.textContent = placeholderText;
    placeholder.value = "";
    selectElement.appendChild(placeholder);
     
  
    if (includeEmpty) {
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.textContent = "None";
      selectElement.appendChild(emptyOption);
    }
  
    options.forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      selectElement.appendChild(opt);
    });

    // ✅ After all options are added, set value back if it still exists
    const match = [...selectElement.options].some(opt => opt.value === currentValue);
    if (match) {
        selectElement.value = currentValue;
    } else {
        selectElement.value = ""; // Force it to land on placeholder
    }
  }
  

  window.addEventListener("DOMContentLoaded", () => {
    const isHome = document.getElementById("home").classList.contains("active");
    if (isHome) {
        document.body.classList.add("home-active");
    }
});


document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn = document.querySelector(".close-menu");

  if (!hamburger || !mobileMenu || !closeBtn) {
    console.error("Missing hamburger or menu element");
    return;
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    hamburger.classList.remove("open");
    mobileMenu.classList.remove("open");
  });
});





  let preservedSize = "";
  let preservedFlavor = "";
  let preservedFrosting = "";
  let preservedFilling = "";
  

  document.getElementById("orderForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const cakeType = document.getElementById("cakeType").value;
    const size     = document.getElementById("size").value;
    // Only enforce on the two 3‑tiered options:
    const needsNotice = ["4\" + 6\" + 8\" Tiered", "6\" + 8\" + 10\" Tiered"];
    if (cakeType === "tiered" && needsNotice.includes(size)) {
        const dateVal = document.getElementById("pickupDate").value;
        if (dateVal) {
            const selected = new Date(dateVal);
            const today    = new Date();
            const diffDays = (selected - today) / (1000*60*60*24);
            if (diffDays < 14) {
                showFormError("⚠️ 3‑tiered cakes require at least 2 weeks notice. Please choose a later date.");

                preservedSize = document.getElementById("size").value;
                preservedFlavor = document.getElementById("flavor").value;
                preservedFrosting = document.getElementById("frosting").value;
                preservedFilling = document.getElementById("filling").value;
                wasRedirectedAfterWarning = true;
              
                // Show Step 1 again
                document.querySelectorAll(".form-step").forEach((step, idx) =>
                  step.classList.toggle("active", idx === 0)
                );

              
                // ✅ Reset currentStep so 'Next' works again
                currentStep = 0;
              
                // ✅ Re-populate Step 2 values in advance so it's ready when they return
                const cakeType = document.getElementById("cakeType").value;
                if (cakeType) {
                  populateSelect(document.getElementById("flavor"), flavorOptions, "Select a flavor");
                  populateSelect(document.getElementById("frosting"), frostingOptions, "Select a frosting");
                  populateSelect(document.getElementById("filling"), fillingOptions, "Select a filling (optional)", true);
                  populateSelect(document.getElementById("size"), sizeOptions[cakeType] || [], "Select a size");
              
                  const selectedSize = document.getElementById("size").value;
                  if (selectedSize && sizeDetails[selectedSize]) {
                    document.getElementById("sizeInfo").innerHTML = `${sizeDetails[selectedSize].price} – <em>${sizeDetails[selectedSize].serves}</em>`;
                  }
                }
              
                return; // Cancel form submission
              }              
        }
    }

    const form = e.target;
    const formData = new FormData(form);

    const imageInputs = document.querySelectorAll("input[name='inspirationPic']");

    const atLeastOneImage = Array.from(imageInputs).some(input => input.files.length > 0);

    if (!atLeastOneImage) {
        showFormError("⚠️ Please upload at least one inspiration picture.");
    return;
    }

    for (let i = 0; i < Math.min(3, imageInputs.length); i++) {
    const file = imageInputs[i].files[0];
    if (!file) continue;

    const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    formData.append(`image${i + 1}`, base64);
    formData.append(`imageName${i + 1}`, file.name);
    }


  
    const scriptURL = 'https://script.google.com/macros/s/AKfycbx6eh_ZJWWV-F9pwlcIXUUzIJwFr-mMEp7bG_lxsWBx06xC5zRMHgVTSuBWMG2w5Y1-/exec';

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    submitBtn.classList.add("submitting");
    clearFormError();
  
    try {
      await fetch(scriptURL, {
        method: 'POST',
        body: formData,
      });
  
      // Show confirmation message
      document.getElementById("orderForm").style.display = "none";
      document.getElementById("orderHeader").style.display = "none";
      document.getElementById("confirmationMessage").style.display = "block";

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      submitBtn.classList.remove("submitting");
  
      // Reset form to step 1
      form.reset();

      preservedSize = "";
      preservedFlavor = "";
      preservedFrosting = "";
      preservedFilling = "";

      // Clear Step 2 dynamic content
      document.getElementById("tieredNotice").style.display = "none";
      document.getElementById("flavor").innerHTML = "";
      document.getElementById("frosting").innerHTML = "";
      document.getElementById("filling").innerHTML = "";
      document.getElementById("size").innerHTML = "";
      document.getElementById("sizeInfo").innerHTML = "";

      // Remove uploaded image inputs and preview
      const imageInputsContainer = document.getElementById("imageInputsContainer");
      imageInputsContainer.innerHTML = `<input type="file" name="inspirationPic" accept="image/*" class="inspo-file" required>`;
      document.getElementById("previewContainer").innerHTML = "";

      // Reattach the image preview listener to the new input
      imageInputsContainer.querySelector("input").addEventListener("change", updatePreview);

      currentStep = 0;
      document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
      });
  
    } catch (error) {
      console.error("Submission error:", error);
      alert("⚠️ Submission failed. Try again or contact on Instagram.");
    }
  });
  
    // Show modal when homepage "Order Now!" button is clicked
    const heroOrderBtn = document.getElementById("heroOrderBtn");
    if (heroOrderBtn) {
    heroOrderBtn.addEventListener("click", function (e) {
        e.preventDefault();
        navigateToPage("order");

        setTimeout(() => {
        const modal = document.getElementById("orderModal");
        modal.style.display = "flex";
        setTimeout(() => {
            modal.classList.add("show");
        }, 10);
        }, 50);
    });
    }

// mobile nav links
document.querySelectorAll('.mobile-nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetPage = link.getAttribute('href').substring(1);

    // close menu:
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');

    // go to page:
    navigateToPage(targetPage);
  });
});

    
const heroTierLink = document.querySelector('.hero-btn.nav-link[data-page="tiered-collections"]');
if (heroTierLink) {
  heroTierLink.addEventListener('click', e => {
    e.preventDefault();
    navigateToPage('tiered-collections');
  });
}

    

});


document.addEventListener("DOMContentLoaded", () => {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeBtn   = document.querySelector(".close-menu");

  if (!hamburger || !mobileMenu || !closeBtn) {
    console.error("🍔 Missing burger or menu elements");
    return;
  }

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  closeBtn.addEventListener("click", () => {
    // start pop-out
    mobileMenu.classList.add("closing");
    hamburger.classList.remove("open");
  
    // once the animation finishes, clean up
    mobileMenu.addEventListener("animationend", function handler() {
      mobileMenu.classList.remove("open", "closing");
      mobileMenu.removeEventListener("animationend", handler);
    });
  });
});
