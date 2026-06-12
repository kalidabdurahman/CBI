function getSelectedNewImageCount(container) {
  if (!container) return 0;

  return Array.from(container.querySelectorAll("input[type='file']"))
    .filter(input => input.files && input.files[0])
    .length;
}

function getSavedImageCountForCurrentEdit() {
  return window.getEditingExistingImageCount();
}

function getTotalImageCountForContainer(container) {
  return getSavedImageCountForCurrentEdit() + getSelectedNewImageCount(container);
}

function updatePreview() {
  const previewContainer = document.getElementById("previewContainer");
  const imageInputsContainer = document.getElementById("imageInputsContainer");

  if (!previewContainer || !imageInputsContainer) return;

  previewContainer.innerHTML = "";

  const existingImages = window.getEditingExistingImages();
  if (window.isEditingOrderCartItem() && existingImages.length) {
    renderSavedCartImagePreviews(existingImages, "previewContainer");
  }

  const inputs = imageInputsContainer.querySelectorAll("input[type='file']");

  const selectedInputs = Array.from(inputs).filter(input => input.files && input.files[0]);
  const savedCount = getSavedImageCountForCurrentEdit();

  if (savedCount + selectedInputs.length > 3) {
    selectedInputs[selectedInputs.length - 1].value = "";
    showFormError("⚠️ You can upload up to 3 inspiration pictures total.");
    updatePreview();
    return;
  }

  selectedInputs.forEach((input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const wrapper = document.createElement("div");
        wrapper.className = "preview-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";
        wrapper.style.marginRight = "10px";
        wrapper.style.marginBottom = "10px";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100px";
        img.style.borderRadius = "8px";

        const label = document.createElement("div");
        label.textContent = "New";
        label.style.fontSize = "0.75rem";
        label.style.textAlign = "center";
        label.style.marginTop = "4px";

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
          updatePreview();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        wrapper.appendChild(label);
        previewContainer.appendChild(wrapper);
      };

      reader.readAsDataURL(input.files[0]);
    }
  });
}

function updateDessertPreview() {
  const dessertPreviewContainer = document.getElementById("dessertPreviewContainer");
  const dessertImageInputsContainer = document.getElementById("dessertImageInputsContainer");

  if (!dessertPreviewContainer || !dessertImageInputsContainer) return;

  dessertPreviewContainer.innerHTML = "";

  const existingImages = window.getEditingExistingImages();
  if (window.isEditingOrderCartItem() && existingImages.length) {
    renderSavedCartImagePreviews(existingImages, "dessertPreviewContainer");
  }

  const inputs = dessertImageInputsContainer.querySelectorAll("input[type='file']");

  const selectedInputs = Array.from(inputs).filter(input => input.files && input.files[0]);
  const savedCount = getSavedImageCountForCurrentEdit();

  if (savedCount + selectedInputs.length > 3) {
    selectedInputs[selectedInputs.length - 1].value = "";
    showFormError("⚠️ You can upload up to 3 inspiration pictures total.");
    updateDessertPreview();
    return;
  }

  selectedInputs.forEach((input) => {
    if (input.files && input.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        const wrapper = document.createElement("div");
        wrapper.className = "preview-wrapper";
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";
        wrapper.style.marginRight = "10px";
        wrapper.style.marginBottom = "10px";

        const img = document.createElement("img");
        img.src = e.target.result;
        img.style.maxWidth = "100px";
        img.style.borderRadius = "8px";

        const label = document.createElement("div");
        label.textContent = "New";
        label.style.fontSize = "0.75rem";
        label.style.textAlign = "center";
        label.style.marginTop = "4px";

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
          updateDessertPreview();
        });

        wrapper.appendChild(img);
        wrapper.appendChild(removeBtn);
        wrapper.appendChild(label);
        dessertPreviewContainer.appendChild(wrapper);
      };

      reader.readAsDataURL(input.files[0]);
    }
  });
}

function renderSavedCartImagePreviews(images, previewContainerId) {
  const container = document.getElementById(previewContainerId);
  if (!container) return;

  container.innerHTML = "";

  if (!images || !images.length) return;

  images.forEach((image, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "preview-wrapper saved-cart-preview";
    wrapper.style.position = "relative";
    wrapper.style.display = "inline-block";
    wrapper.style.marginRight = "10px";
    wrapper.style.marginBottom = "10px";

    const img = document.createElement("img");
    img.src = `data:${image.type || "image/jpeg"};base64,${image.data}`;
    img.alt = image.name || `Saved image ${index + 1}`;
    img.style.maxWidth = "100px";
    img.style.borderRadius = "8px";

    const label = document.createElement("div");
    label.textContent = "Saved";
    label.style.fontSize = "0.75rem";
    label.style.textAlign = "center";
    label.style.marginTop = "4px";

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
    removeBtn.title = "Remove saved image";

    removeBtn.addEventListener("click", () => {
      window.removeEditingExistingImageAt(index);

      if (previewContainerId === "dessertPreviewContainer") {
        updateDessertPreview();
      } else {
        updatePreview();
      }
    });

    wrapper.appendChild(img);
    wrapper.appendChild(removeBtn);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}
