document.addEventListener("DOMContentLoaded", function () {

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
  
  

// Close the modal when "I Agree" is clicked
document.getElementById('agreeButton').addEventListener('click', function() {
    const modal = document.getElementById('orderModal');
    modal.classList.remove('show'); // Remove show class to trigger the hiding animation
    setTimeout(() => {
        modal.style.display = 'none'; // Hide the modal after animation completes
    }, 300); // Match the transition duration
});

document.querySelector('#confirmationMessage a').addEventListener('click', function (e) {
    e.preventDefault();
    navigateToPage('home');

    // Optional: Reset form and show the order header again
    document.getElementById("orderForm").style.display = "block";
    document.getElementById("confirmationMessage").style.display = "none";
    document.getElementById("orderHeader").style.display = "block";

    currentStep = 0;
});

// ▼ open “Order Rules” modal when clicking the inline link ▼
const showRulesLink = document.getElementById("showRulesLink");
const orderModal    = document.getElementById("orderModal");

showRulesLink.addEventListener("click", e => {
  e.preventDefault();
  orderModal.style.display = "flex";
  setTimeout(() => orderModal.classList.add("show"), 10);
});

// reuse your existing “I Agree” button to close the modal
document.getElementById("agreeButton").addEventListener("click", () => {
  orderModal.classList.remove("show");
  setTimeout(() => (orderModal.style.display = "none"), 300);
});
  

let wasRedirectedAfterWarning = false;



    let currentStep = 0;
    window.getOrderCurrentStep = () => currentStep;
    const formSteps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-step');
    const backBtns = document.querySelectorAll('.prev-step');

    function showStep(step) {
        formSteps.forEach((stepDiv, index) => {
          stepDiv.classList.toggle('active', index === step);
        });
      
        if (step === 0) {
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
                renderSizeInfo(preservedSize);
              }
              
            }
          }
        }

        if (step === 1) {
          renderContactStepEstimate();
        }

        if (step === 2) {
          generateReviewSummary();
        }
      }     
      

      nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          if (currentStep === 1) {
            const dateVal = document.getElementById("pickupDate").value;
            if (dateVal) {
              const chosen = new Date(dateVal + "T00:00");
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const diffDays = (chosen - today) / (1000 * 60 * 60 * 24);
              const requiredDays = getCurrentOrderRequiredLeadTimeDays();

              if (chosen.getDay() === 1 || chosen.getDay() === 2 || diffDays < requiredDays) {
                showFormError(
                  `⚠️ Please choose a valid date: ${getLeadTimeText(requiredDays)} notice and not a Monday or Tuesday.`
                );
                return;
              }
            }
          }
          // ▲ end date-validation guard ▲


          const currentStepFields = formSteps[currentStep].querySelectorAll('input, select, textarea');
          let allValid = true;
          let firstInvalidField = null;
      
          if (currentStep === 0 && !validateStepOne()) {
            return;
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
      
            // // Repopulate dropdowns in Step 2
            // if (currentStep === 1) {
            //   const cakeType = document.getElementById("cakeType").value;
            //   if (cakeType) {
            //     populateSelect(document.getElementById("flavor"), flavorOptions, "Select a flavor");
            //     populateSelect(document.getElementById("frosting"), frostingOptions, "Select a frosting");
            //     populateSelect(document.getElementById("filling"), fillingOptions, "Select a filling (optional)", true);
            //     populateSelect(document.getElementById("size"), sizeOptions[cakeType] || [], "Select a size");
      
            //     const selectedSize = document.getElementById("size").value;
            //     if (selectedSize && sizeDetails[selectedSize]) {
            //       document.getElementById("sizeInfo").innerHTML = `${sizeDetails[selectedSize].price} – <em>${sizeDetails[selectedSize].serves}</em>`;
            //     }
            //   }
            // }
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
    minDate.setDate(minDate.getDate() + 7);
    pickupDateField.min = minDate.toISOString().split("T")[0];

// ▽ block out Mondays AND specific dates ▽
pickupDateField.addEventListener("change", function(e) {
  const val = e.target.value;
  if (!val) return; // no date chosen, so do nothing

  // Parse the chosen date (assumes "YYYY-MM-DD")
  const chosen = new Date(val + "T00:00");
  const dayOfWeek = chosen.getDay(); // 0=Sunday, 1=Monday, …, 6=Saturday

  // 1) Block all Mondays and Tuesdays
  if (dayOfWeek === 1 || dayOfWeek === 2) {
    showFormError("⚠️ Mondays and Tuesdays are unavailable. Please pick another day.");
    e.target.value = "";
    return;
  }

  // 2) Block exact dates from order data
  if (invalidDates.includes(val)) {
    showFormError("⚠️ That date is unavailable. Please choose another day.");
    e.target.value = "";
    return;
  }

  // If we reach here, the date is allowed—clear any previous error
  clearFormError();
});
// ▲ end Monday & specific-date blocker ▲




    const addImageBtn = document.getElementById("addImageBtn");
    const imageInputsContainer = document.getElementById("imageInputsContainer");
    const previewContainer = document.getElementById("previewContainer");
  
    addImageBtn.addEventListener("click", () => {
      const savedCount = getSavedImageCountForCurrentEdit();
      const selectedNewCount = getSelectedNewImageCount(imageInputsContainer);
      const totalImageCount = savedCount + selectedNewCount;

      if (totalImageCount >= 3) {
        showFormError("⚠️ You can upload up to 3 inspiration pictures total.");
        return;
      }

      const maxNewInputsAllowed = 3 - savedCount;
      const currentInputs = imageInputsContainer.querySelectorAll("input[type='file']");

      if (currentInputs.length < maxNewInputsAllowed) {
        const newInput = document.createElement("input");
        newInput.type = "file";
        newInput.name = "inspirationPic";
        newInput.accept = "image/*";
        newInput.classList.add("inspo-file");

        newInput.addEventListener("change", updatePreview);
        imageInputsContainer.appendChild(newInput);
      } else {
        showFormError("⚠️ You can upload up to 3 inspiration pictures total.");
      }
    });

    const addDessertImageBtn = document.getElementById("addDessertImageBtn");
    const dessertImageInputsContainer = document.getElementById("dessertImageInputsContainer");

    if (addDessertImageBtn && dessertImageInputsContainer) {
      addDessertImageBtn.addEventListener("click", () => {
        const savedCount = getSavedImageCountForCurrentEdit();
        const selectedNewCount = getSelectedNewImageCount(dessertImageInputsContainer);
        const totalImageCount = savedCount + selectedNewCount;

        if (totalImageCount >= 3) {
          showFormError("⚠️ You can upload up to 3 inspiration pictures total.");
          return;
        }

        const maxNewInputsAllowed = 3 - savedCount;
        const currentInputs = dessertImageInputsContainer.querySelectorAll("input[type='file']");

        if (currentInputs.length < maxNewInputsAllowed) {
          const newInput = document.createElement("input");
          newInput.type = "file";
          newInput.name = "dessertInspirationPic";
          newInput.accept = "image/*";
          newInput.classList.add("inspo-file");

          newInput.addEventListener("change", updateDessertPreview);
          dessertImageInputsContainer.appendChild(newInput);
        } else {
          showFormError("⚠️ You can upload up to 3 inspiration pictures total.");
        }
      });

      const firstDessertImageInput = dessertImageInputsContainer.querySelector("input[type='file']");
      if (firstDessertImageInput) {
        firstDessertImageInput.addEventListener("change", updateDessertPreview);
      }
    }

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
      renderSizeInfo(selectedSize);
      updateClearBoxOptions(selectedSize);
      renderContactStepEstimate();
    });

    document.getElementById("clearBoxOption").addEventListener("change", function () {
      renderContactStepEstimate();
    });
      
    document.getElementById("orderCategory").addEventListener("change", toggleOrderTypePanels);
    document.getElementById("tastingBoxType").addEventListener("change", () => {
      toggleTastingTypePanels();
      clearFormError();
    });

    document.getElementById("dessertType").addEventListener("change", () => {
      populateDessertPackages();
      renderDessertFieldVisibility();
      renderDessertPriceInfo();
      clearFormError();
    });

    document.getElementById("dessertPackage").addEventListener("change", () => {
      renderDessertPriceInfo();
      clearFormError();
    });

    document.getElementById("dessertFlavor").addEventListener("change", clearFormError);
    document.getElementById("dessertFrosting").addEventListener("change", clearFormError);
    document.getElementById("dessertFilling").addEventListener("change", clearFormError);
    document.getElementById("dessertDetails").addEventListener("input", clearFormError);

    toggleOrderTypePanels();

  
    // Handle first file input preview
    imageInputsContainer.querySelector("input[type='file']").addEventListener("change", updatePreview);
//   });
  
  
function resetDessertFields() {
  document.getElementById("dessertType").value = "";
  document.getElementById("dessertPackage").innerHTML = `<option value="" disabled selected>Select quantity</option>`;
  document.getElementById("dessertFlavor").innerHTML = "";
  document.getElementById("dessertFrosting").innerHTML = "";
  document.getElementById("dessertFilling").innerHTML = "";
  document.getElementById("dessertFillingGroup").style.display = "none";
  document.getElementById("dessertPriceInfo").innerHTML = "";
  document.getElementById("dessertEstimateRow").style.display = "none";
  document.getElementById("dessertPreviewContainer").innerHTML = "";
  document.getElementById("dessertImageInputsContainer").innerHTML = `<input type="file" name="dessertInspirationPic" accept="image/*" class="inspo-file">`;

  const firstDessertInput = document.querySelector("input[name='dessertInspirationPic']");
  if (firstDessertInput) {
    firstDessertInput.addEventListener("change", updateDessertPreview);
  }
}

  function validateStepOne() {
    const orderCategory = document.getElementById("orderCategory").value;

    if (!orderCategory) {
      showFormError("⚠️ Please choose what you'd like to order.");
      return false;
    }

    if (orderCategory === "custom_cake") {
      const requiredFields = [
        { id: "cakeType", label: "cake type" },
        { id: "size", label: "cake size" },
        { id: "flavor", label: "cake flavor" },
        { id: "frosting", label: "cake frosting" },
        { id: "cakeDetails", label: "cake details" }
      ];

      for (const { id, label } of requiredFields) {
        const field = document.getElementById(id);
        const value = field ? field.value.trim() : "";

        if (field && !field.disabled && !value) {
          showFormError(`⚠️ Please fill out: ${label}.`);
          field.focus();
          field.reportValidity();
          return false;
        }
      }

      const imageInputs = document.querySelectorAll("input[name='inspirationPic']");
      const hasNewImage = Array.from(imageInputs).some(input => input.files.length > 0);
      const hasExistingImage = window.isEditingOrderCartItem() && window.getEditingExistingImageCount() > 0;

      if (!hasNewImage && !hasExistingImage) {
        showFormError("⚠️ Please upload at least one inspiration picture.");
        return false;
      }
    }

    if (orderCategory === "tasting_box") {
      const tastingBoxType = document.getElementById("tastingBoxType").value;

      if (!tastingBoxType) {
        showFormError("⚠️ Please choose which tasting box you'd like.");
        return false;
      }

      if (tastingBoxType === "regular") {
        const checked = document.querySelectorAll("input[name='regularBoxSideFillings']:checked");
        if (checked.length > 2) {
          showFormError("⚠️ Regular tasting boxes can have up to 2 side fillings.");
          return false;
        }
      }

      if (tastingBoxType === "deluxe") {
        for (let i = 1; i <= 6; i++) {
          const flavorField = document.getElementById(`slice${i}Flavor`);
          const frostingField = document.getElementById(`slice${i}Frosting`);

          if (!flavorField || flavorField.disabled || !flavorField.value) {
            showFormError(`⚠️ Please choose a cake flavor for slice ${i}.`);
            if (flavorField) {
              flavorField.focus();
              flavorField.reportValidity();
            }
            return false;
          }

          if (!frostingField || frostingField.disabled || !frostingField.value) {
            showFormError(`⚠️ Please choose a frosting for slice ${i}.`);
            if (frostingField) {
              frostingField.focus();
              frostingField.reportValidity();
            }
            return false;
          }
        }
      }
    }

    if (orderCategory === "dessert") {
      const dessertType = document.getElementById("dessertType").value;
      const dessertPackage = document.getElementById("dessertPackage").value;
      const dessertDetails = document.getElementById("dessertDetails").value.trim();

      if (!dessertType) {
        showFormError("⚠️ Please choose what dessert you'd like.");
        return false;
      }

      if (!dessertPackage) {
        showFormError("⚠️ Please choose a dessert package.");
        return false;
      }

      if (dessertNeedsFlavor(dessertType) && !document.getElementById("dessertFlavor").value) {
        showFormError("⚠️ Please choose a dessert flavor.");
        return false;
      }

      if (dessertNeedsFrosting(dessertType) && !document.getElementById("dessertFrosting").value) {
        showFormError("⚠️ Please choose a dessert frosting.");
        return false;
      }

      if (!dessertDetails) {
        showFormError("⚠️ Please describe the details you'd like for your dessert order.");
        return false;
      }
    }

    return true;
  }

  function htmlToText(html) {
    const div = document.createElement("div");
    div.innerHTML = html || "";
    return div.textContent || div.innerText || "";
  }

  function getCakeTypeLabel(value) {
    const labels = {
      heart: "Heart Cake",
      round: "Round Cake",
      tiered: "Tiered Cake"
    };

    return labels[value] || value || "Custom Cake";
  }

  function getTastingBoxLabel(value) {
    if (value === "regular") return "Regular Tasting Box";
    if (value === "deluxe") return "Deluxe Tasting Box";
    return "Cake Tasting Box";
  }

  function getCurrentOrderRequiredLeadTimeDays() {
    if (window.hasOrderCartItems()) {
      return window.getCartRequiredLeadTimeDays();
    }

    const orderCategory = document.getElementById("orderCategory").value;
    const cakeType = document.getElementById("cakeType").value;
    const selectedSize = document.getElementById("size").value;

    if (orderCategory === "custom_cake" && cakeType === "tiered") {
      return getTieredLeadTimeDays(selectedSize);
    }

    return 7;
  }

  async function buildCartItemFromCurrentForm() {
    if (!validateStepOne()) {
      return null;
    }

    const form = document.getElementById("orderForm");
    const formData = new FormData(form);
    const orderCategory = formData.get("orderCategory");

    if (orderCategory === "custom_cake") {
      const cakeType = formData.get("cakeType");
      const selectedSize = formData.get("size");
      const priceEstimateHtml =
        selectedSize && sizeDetails[selectedSize]
          ? sizePriceRangeHTML(selectedSize)
          : "—";

      const editingCartItemId = window.getEditingCartItemId();
      const newImages = await collectImagesFromInputs("input[name='inspirationPic']");
      let images = editingCartItemId
        ? [...window.getEditingExistingImages(), ...newImages].slice(0, 3)
        : newImages;

      const addons = formData.getAll("addons");

      return {
        id: editingCartItemId || window.createOrderCartItemId(),
        orderCategory: "custom_cake",
        displayCategory: "Custom Cake",
        title: `${selectedSize || ""} ${getCakeTypeLabel(cakeType)}`.trim(),
        priceEstimate: priceEstimateHtml,
        priceEstimateText: htmlToText(priceEstimateHtml),
        requiredLeadDays: cakeType === "tiered" ? getTieredLeadTimeDays(selectedSize) : 7,
        images,
        details: {
          cakeType: getCakeTypeLabel(cakeType),
          cakeTypeValue: cakeType,
          size: selectedSize,
          flavor: formData.get("flavor"),
          frosting: formData.get("frosting"),
          filling: formData.get("filling") || "None",
          addons,
          clearBoxOption: formData.get("clearBoxOption") || "standard",
          cakeDetails: formData.get("cakeDetails"),
          notes: formData.get("notes")
        }
      };
    }

    if (orderCategory === "tasting_box") {
      const tastingBoxType = formData.get("tastingBoxType");

      if (tastingBoxType === "regular") {
        const sideFillings = formData.getAll("regularBoxSideFillings");

        return {
          id: window.getEditingCartItemId() || window.createOrderCartItemId(),
          orderCategory: "tasting_box",
          displayCategory: "Cake Tasting Box",
          title: "Regular Tasting Box",
          priceEstimate: "$40",
          priceEstimateText: "$40",
          requiredLeadDays: 7,
          images: [],
          details: {
            tastingBoxType: "Regular",
            includedFlavors: "Vanilla, Chocolate, Marble, Cookies & Cream, Red Velvet, Confetti",
            frosting: "Vanilla Buttercream on all 6 slices",
            sideFillings,
            notes: formData.get("tastingBoxNotes")
          }
        };
      }

      if (tastingBoxType === "deluxe") {
        const deluxeSlices = buildDeluxeSlicesData();
        const deluxeSliceSummary = deluxeSlices
          .map(slice => `Slice ${slice.slice}: ${slice.flavor} / ${slice.frosting} / ${slice.filling || "None"}`)
          .join("\n");

        return {
          id: window.getEditingCartItemId() || window.createOrderCartItemId(),
          orderCategory: "tasting_box",
          displayCategory: "Cake Tasting Box",
          title: "Deluxe Tasting Box",
          priceEstimate: "$55",
          priceEstimateText: "$55",
          requiredLeadDays: 7,
          images: [],
          details: {
            tastingBoxType: "Deluxe",
            deluxeSlices,
            deluxeSliceSummary,
            notes: formData.get("tastingBoxNotesDeluxe")
          }
        };
      }
    }

    if (orderCategory === "dessert") {
      const dessertType = formData.get("dessertType");
      const dessertPackage = formData.get("dessertPackage");
      const dessertDetails = getDessertPackageDetails(dessertType, dessertPackage);
      const dessertName = dessertTypeLabels[dessertType] || "Dessert";

      const editingCartItemId = window.getEditingCartItemId();
      const newImages = await collectImagesFromInputs("input[name='dessertInspirationPic']");
      let images = editingCartItemId
        ? [...window.getEditingExistingImages(), ...newImages].slice(0, 3)
        : newImages;

      return {
        id: editingCartItemId || window.createOrderCartItemId(),
        orderCategory: "dessert",
        displayCategory: "Desserts",
        title: `${dessertName} — ${dessertPackage}`,
        priceEstimate: dessertDetails ? dessertDetails.price : "—",
        priceEstimateText: dessertDetails ? dessertDetails.price : "—",
        requiredLeadDays: 7,
        images,
        details: {
          dessertType: dessertName,
          dessertTypeValue: dessertType,
          dessertPackage,
          totalPieces: dessertDetails ? dessertDetails.totalPieces : "",
          flavor: formData.get("dessertFlavor") || "N/A",
          frosting: formData.get("dessertFrosting") || "N/A",
          filling: dessertType === "cupcakes" ? (formData.get("dessertFilling") || "None") : "N/A",
          dessertDetails: formData.get("dessertDetails"),
          notes: formData.get("dessertNotes"),
          priceEstimate: dessertDetails ? dessertDetails.price : "—"
        }
      };
    }

    return null;
  }

  function resetItemBuilderForm() {
    const stepOne = formSteps[0];

    stepOne.querySelectorAll("input, select, textarea").forEach(field => {
      if (field.type === "checkbox" || field.type === "radio") {
        field.checked = false;
      } else if (field.type === "file") {
        field.value = "";
      } else {
        field.value = "";
      }
    });

    document.getElementById("previewContainer").innerHTML = "";
    document.getElementById("dessertPreviewContainer").innerHTML = "";

    document.getElementById("imageInputsContainer").innerHTML = `
      <input type="file" name="inspirationPic" accept="image/*" class="inspo-file" required>
    `;

    document.getElementById("dessertImageInputsContainer").innerHTML = `
      <input type="file" name="dessertInspirationPic" accept="image/*" class="inspo-file">
    `;

    const firstCustomImage = document.querySelector("input[name='inspirationPic']");
    if (firstCustomImage) firstCustomImage.addEventListener("change", updatePreview);

    const firstDessertImage = document.querySelector("input[name='dessertInspirationPic']");
    if (firstDessertImage) firstDessertImage.addEventListener("change", updateDessertPreview);

    window.clearOrderCartEditState();

    const addBtn = document.getElementById("addToCartBtn");
    if (addBtn) addBtn.textContent = "Add to Cart";

    toggleOrderTypePanels();
    clearFormError();
  }

  window.resetItemBuilderForm = resetItemBuilderForm;

  document.getElementById("addToCartBtn").addEventListener("click", async () => {
    const item = await buildCartItemFromCurrentForm();

    if (!item) return;

    window.addOrUpdateCartItem(item);
  });

  document.getElementById("checkoutCartBtn").addEventListener("click", () => {
    if (!window.hasOrderCartItems()) {
      showFormError("⚠️ Please add at least one item to your cart before checking out.");
      return;
    }

    clearFormError();
    currentStep = 1;
    showStep(currentStep);
  });

  document.getElementById("cartItemsList").addEventListener("click", (event) => {
    const editBtn = event.target.closest(".edit-cart-item");
    const removeBtn = event.target.closest(".remove-cart-item");

    if (editBtn) {
      window.loadCartItemForEdit(editBtn.dataset.cartId);
    }

    if (removeBtn) {
      window.removeCartItem(removeBtn.dataset.cartId);
    }
  });

  window.loadCartFromStorage();

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


  function buildDeluxeSlicesData() {
    const slices = [];

    for (let i = 1; i <= 6; i++) {
      slices.push({
        slice: i,
        flavor: document.getElementById(`slice${i}Flavor`).value || "",
        frosting: document.getElementById(`slice${i}Frosting`).value || "",
        filling: document.getElementById(`slice${i}Filling`).value || ""
      });
    }

    return slices;
  }

  let preservedSize = "";
  let preservedFlavor = "";
  let preservedFrosting = "";
  let preservedFilling = "";
  
  document.getElementById("orderForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const agreeCheckbox = document.getElementById("agreeRules");
    if (!agreeCheckbox.checked) {
      showFormError("⚠️ You must agree to the Order Rules before submitting.");
      agreeCheckbox.focus();
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const cartItems = window.getOrderCartItems();
    let orderCategory = cartItems.length ? "batch_order" : document.getElementById("orderCategory").value;
    formData.set("orderCategory", orderCategory);

    const cakeType = document.getElementById("cakeType").value;

    if (orderCategory === "batch_order") {
      formData.append("cartItemsJson", JSON.stringify(window.cartItemJsonForSubmit()));
      formData.append("cartSummary", window.buildCartPlainTextSummary());
      formData.append("cartItemCount", String(cartItems.length));

      cartItems.forEach((item, itemIndex) => {
        (item.images || []).forEach((image, imageIndex) => {
          const itemNumber = itemIndex + 1;
          const imageNumber = imageIndex + 1;

          formData.append(`item${itemNumber}Image${imageNumber}`, image.data);
          formData.append(`item${itemNumber}ImageName${imageNumber}`, image.name);
          formData.append(`item${itemNumber}ImageType${imageNumber}`, image.type || "image/jpeg");
        });
      });
    }

  const requiredLeadDays = getCurrentOrderRequiredLeadTimeDays();

  if (requiredLeadDays > 7) {
    const dateVal = document.getElementById("pickupDate").value;

    if (dateVal) {
      const selected = new Date(dateVal + "T00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const diffDays = (selected - today) / (1000 * 60 * 60 * 24);

      if (diffDays < requiredLeadDays) {
        showFormError(`⚠️ Tiered cakes require ${getLeadTimeText(requiredLeadDays)} notice. Please choose a later date.`);

        if (!window.hasOrderCartItems() && orderCategory === "custom_cake" && cakeType === "tiered") {
          preservedSize = document.getElementById("size").value;
          preservedFlavor = document.getElementById("flavor").value;
          preservedFrosting = document.getElementById("frosting").value;
          preservedFilling = document.getElementById("filling").value;
          wasRedirectedAfterWarning = true;

          document.querySelectorAll(".form-step").forEach((step, idx) =>
            step.classList.toggle("active", idx === 0)
          );
          currentStep = 0;

          const cakeTypeNow = document.getElementById("cakeType").value;
          if (cakeTypeNow) {
            populateSelect(document.getElementById("flavor"), flavorOptions, "Select a flavor");
            populateSelect(document.getElementById("frosting"), frostingOptions, "Select a frosting");
            populateSelect(document.getElementById("filling"), fillingOptions, "Select a filling (optional)", true);
            populateSelect(document.getElementById("size"), sizeOptions[cakeTypeNow] || [], "Select a size");

            const selectedSize = document.getElementById("size").value;
            if (selectedSize && sizeDetails[selectedSize]) {
              renderSizeInfo(selectedSize);
              updateClearBoxOptions(selectedSize);
            }
          }
        }

          return;
        }
      }
    }

    if (orderCategory === "custom_cake") {
      const imageInputs = document.querySelectorAll("input[name='inspirationPic']");
      const atLeastOneImage = Array.from(imageInputs).some(input => input.files.length > 0);

      if (!atLeastOneImage) {
        showFormError("⚠️ Please upload at least one inspiration picture.");
        return;
      }

      await appendImagesToFormData(formData, imageInputs);
    }

    if (orderCategory === "dessert") {
      const dessertType = document.getElementById("dessertType").value;
      const dessertPackage = document.getElementById("dessertPackage").value;
      const dessertDetails = getDessertPackageDetails(dessertType, dessertPackage);

      if (dessertDetails) {
        formData.append("dessertPriceEstimate", dessertDetails.price);
        formData.append("dessertTotalPieces", String(dessertDetails.totalPieces));
      }

      const dessertImageInputs = document.querySelectorAll("input[name='dessertInspirationPic']");
      await appendImagesToFormData(formData, dessertImageInputs);
    }

    if (orderCategory === "tasting_box") {
      const tastingBoxType = document.getElementById("tastingBoxType").value;

      if (tastingBoxType === "regular") {
        const selectedFillings = Array.from(
          document.querySelectorAll("input[name='regularBoxSideFillings']:checked")
        ).map(input => input.value);

      }

      if (tastingBoxType === "deluxe") {
        const deluxeSlices = buildDeluxeSlicesData();

        const deluxeSliceSummary = deluxeSlices
          .map(slice => `Slice ${slice.slice}: ${slice.flavor} / ${slice.frosting} / ${slice.filling || "None"}`)
          .join("\n");


        formData.append("deluxeSliceSummary", deluxeSliceSummary);
      }
    }

    const scriptURL = 'https://script.google.com/macros/s/AKfycbyaMidrMaJuA8VTty6vAIs6jnDBJb_PA-ifsw1cFJcyf7TF52Vf7iU4wWDcypcYhAWUfQ/exec';

    const submitBtn = form.querySelector("button[type='submit']");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting... please wait";
    submitBtn.classList.add("submitting");

    clearFormError();
    clearSubmitStatus();
    showSubmitStatus("Please don’t close or refresh this page. Orders with multiple images may take up to 1 minute.");

    try {
      await fetch(scriptURL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      clearSubmitStatus();

      document.getElementById("orderForm").style.display = "none";
      document.getElementById("orderHeader").style.display = "none";
      document.getElementById("confirmationMessage").style.display = "block";

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      submitBtn.classList.remove("submitting");

      // ✅ Clear cart only after successful submission
      window.clearOrderCart();

      const addToCartBtn = document.getElementById("addToCartBtn");
      if (addToCartBtn) {
        addToCartBtn.textContent = "Add to Cart";
      }

      form.reset();

      preservedSize = "";
      preservedFlavor = "";
      preservedFrosting = "";
      preservedFilling = "";

      document.getElementById("tieredNotice").style.display = "none";
      document.getElementById("flavor").innerHTML = "";
      document.getElementById("frosting").innerHTML = "";
      document.getElementById("filling").innerHTML = "";
      document.getElementById("size").innerHTML = "";

      document.getElementById("customPriceInfo").innerHTML = "";
      document.getElementById("tastingBoxPriceInfo").innerHTML = "";
      document.getElementById("customEstimateRow").style.display = "none";
      document.getElementById("tastingEstimateRow").style.display = "none";

      document.getElementById("contactEstimateInfo").innerHTML = "";
      document.getElementById("contactEstimateNote").textContent = "";
      document.getElementById("contactEstimateRow").style.display = "none";

      const imageInputsContainer = document.getElementById("imageInputsContainer");
      imageInputsContainer.innerHTML = `<input type="file" name="inspirationPic" accept="image/*" class="inspo-file" required>`;
      document.getElementById("previewContainer").innerHTML = "";

      imageInputsContainer.querySelector("input").addEventListener("change", updatePreview);

      currentStep = 0;
      document.querySelectorAll('.form-step').forEach((step, index) => {
        step.classList.toggle('active', index === 0);
      });

      resetOrderPanelsAfterSubmit();

    } catch (error) {
      console.error("Submission error:", error);

      clearSubmitStatus();
      showSubmitStatus("⚠️ Submission failed. Try again with fewer/smaller images or contact me on Instagram.", "error");

      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      submitBtn.classList.remove("submitting");
    }
  });


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

});
