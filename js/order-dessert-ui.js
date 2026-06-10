function populateDessertPackages() {
  const dessertType = document.getElementById("dessertType").value;
  const packageSelect = document.getElementById("dessertPackage");
  const options = getDessertQuantityOptions(dessertType);

  packageSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.disabled = true;
  placeholder.selected = true;
  placeholder.hidden = true;
  placeholder.textContent = "Select quantity";
  packageSelect.appendChild(placeholder);

  options.forEach(item => {
    const option = document.createElement("option");
    option.value = item.label;

    if (item.dozenCount === 0.5) {
      option.textContent = `${item.label} — ${item.price}`;
    } else {
      option.textContent = `${item.label} — ${item.price}`;
    }

    packageSelect.appendChild(option);
  });
}

function renderDessertFieldVisibility() {
  const dessertType = document.getElementById("dessertType").value;

  const flavorGroup = document.getElementById("dessertFlavorGroup");
  const frostingGroup = document.getElementById("dessertFrostingGroup");
  const fillingGroup = document.getElementById("dessertFillingGroup");

  const flavorSelect = document.getElementById("dessertFlavor");
  const frostingSelect = document.getElementById("dessertFrosting");
  const fillingSelect = document.getElementById("dessertFilling");

  const showFlavor = dessertNeedsFlavor(dessertType);
  const showFrosting = dessertNeedsFrosting(dessertType);
  const showFilling = dessertAllowsFilling(dessertType);

  flavorGroup.style.display = showFlavor ? "block" : "none";
  frostingGroup.style.display = showFrosting ? "block" : "none";
  fillingGroup.style.display = showFilling ? "block" : "none";

  flavorSelect.required = showFlavor;
  frostingSelect.required = showFrosting;
  fillingSelect.required = false;

  flavorSelect.disabled = !showFlavor;
  frostingSelect.disabled = !showFrosting;
  fillingSelect.disabled = !showFilling;

  if (showFlavor) {
    populateSelect(flavorSelect, flavorOptions, "Select a flavor");
  } else {
    flavorSelect.innerHTML = "";
    flavorSelect.value = "";
  }

  if (showFrosting) {
    populateSelect(frostingSelect, frostingOptions, "Select a frosting");
  } else {
    frostingSelect.innerHTML = "";
    frostingSelect.value = "";
  }

  if (showFilling) {
    populateSelect(fillingSelect, fillingOptions, "Select a filling (optional)", true);
  } else {
    fillingSelect.innerHTML = "";
    fillingSelect.value = "";
  }
}

function renderDessertPriceInfo() {
  const dessertType = document.getElementById("dessertType").value;
  const packageLabel = document.getElementById("dessertPackage").value;

  const row = document.getElementById("dessertEstimateRow");
  const info = document.getElementById("dessertPriceInfo");

  if (!row || !info) return;

  const details = getDessertPackageDetails(dessertType, packageLabel);

  if (details) {
    const dessertName = dessertTypeLabels[dessertType] || "Dessert";
    info.innerHTML = `${details.price} – <em>${dessertName}, ${details.label}</em>`;
    row.style.display = "block";
  } else {
    info.innerHTML = "";
    row.style.display = "none";
  }

  renderContactStepEstimate();
}
