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

function setSectionEnabled(sectionEl, enabled) {
  if (!sectionEl) return;

  sectionEl.style.display = enabled ? "block" : "none";

  sectionEl.querySelectorAll("input, select, textarea, button").forEach(el => {
    el.disabled = !enabled;
  });
}

function renderSizeInfo(sizeKey) {
  const row = document.getElementById("customEstimateRow");
  const bar = document.getElementById("customPriceInfo");

  if (!row || !bar) return;

  if (sizeDetails[sizeKey]) {
    bar.innerHTML = sizePriceRangeHTML(sizeKey);
    row.style.display = "block";
  } else {
    bar.innerHTML = "";
    row.style.display = "none";
  }
}

function updateClearBoxOptions(sizeKey) {
  const clearBoxSelect = document.getElementById("clearBoxOption");
  const clearOption = clearBoxSelect?.querySelector('option[value="clear"]');
  const note = document.getElementById("clearBoxAvailabilityNote");

  if (!clearBoxSelect || !clearOption || !note) return;

  const clearBoxPrice = clearBoxPrices[sizeKey];

  if (clearBoxPrice) {
    clearOption.disabled = false;
    clearOption.textContent = `Clear Box Upgrade (+$${clearBoxPrice})`;
    note.style.display = "none";
  } else {
    clearOption.disabled = true;
    clearOption.textContent = "Clear Box Upgrade";

    if (clearBoxSelect.value === "clear") {
      clearBoxSelect.value = "standard";
    }

    if (sizeKey) {
      note.style.display = "block";
    } else {
      note.style.display = "none";
    }
  }
}

function renderTastingBoxPriceInfo() {
  const tastingBoxType = document.getElementById("tastingBoxType").value;
  const row = document.getElementById("tastingEstimateRow");
  const priceInfo = document.getElementById("tastingBoxPriceInfo");

  if (!row || !priceInfo) return;

  if (tastingBoxType === "regular") {
    priceInfo.innerHTML = `$40 – <em>Regular Tasting Box</em>`;
    row.style.display = "block";
  } else if (tastingBoxType === "deluxe") {
    priceInfo.innerHTML = `$55 – <em>Deluxe Tasting Box</em>`;
    row.style.display = "block";
  } else {
    priceInfo.innerHTML = "";
    row.style.display = "none";
  }
}

function renderContactStepEstimate() {
  const row = document.getElementById("contactEstimateRow");
  const info = document.getElementById("contactEstimateInfo");
  const note = document.getElementById("contactEstimateNote");

  if (!row || !info || !note) return;

  const orderCategory = document.getElementById("orderCategory").value;

  if (orderCategory === "custom_cake") {
    const selectedSize = document.getElementById("size").value;
    const clearBoxValue = document.getElementById("clearBoxOption").value;

    if (selectedSize && sizeDetails[selectedSize]) {
      let display = sizePriceRangeHTML(selectedSize);

      info.innerHTML = display;
      note.textContent = "(Note: This is only an estimated cost & serving size. Total cost will be provided in invoice!)";
      row.style.display = "block";
    } else {
      info.innerHTML = "";
      note.textContent = "";
      row.style.display = "none";
    }

    return;
  }

  if (orderCategory === "tasting_box") {
    const tastingBoxType = document.getElementById("tastingBoxType").value;

    if (tastingBoxType === "regular") {
      info.innerHTML = `$40 – <em>Regular Tasting Box</em>`;
      note.textContent = "(Note: This is only an estimated cost. Total cost will be provided in invoice!)";
      row.style.display = "block";
      return;
    }

    if (tastingBoxType === "deluxe") {
      info.innerHTML = `$55 – <em>Deluxe Tasting Box</em>`;
      note.textContent = "(Note: This is only an estimated cost. Total cost will be provided in invoice!)";
      row.style.display = "block";
      return;
    }
  }

  if (orderCategory === "dessert") {
    const dessertType = document.getElementById("dessertType").value;
    const packageLabel = document.getElementById("dessertPackage").value;
    const details = getDessertPackageDetails(dessertType, packageLabel);

    if (details) {
      const dessertName = dessertTypeLabels[dessertType] || "Dessert";
      info.innerHTML = `${details.price} – <em>${dessertName}, ${details.label}</em>`;
      note.textContent = "(Note: Dessert pricing is fixed by quantity. Total cost will be confirmed in invoice!)";
      row.style.display = "block";
      return;
    }
  }

  info.innerHTML = "";
  note.textContent = "";
  row.style.display = "none";
}
