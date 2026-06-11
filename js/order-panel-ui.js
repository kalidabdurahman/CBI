function toggleOrderTypePanels() {
  const orderCategory = document.getElementById("orderCategory").value;
  const customPanel = document.getElementById("customCakeFields");
  const tastingPanel = document.getElementById("tastingBoxFields");
  const dessertPanel = document.getElementById("dessertFields");

  setSectionEnabled(customPanel, orderCategory === "custom_cake");
  setSectionEnabled(tastingPanel, orderCategory === "tasting_box");
  setSectionEnabled(dessertPanel, orderCategory === "dessert");

  const customEstimateRow = document.getElementById("customEstimateRow");
  const customPriceInfo = document.getElementById("customPriceInfo");
  const tastingEstimateRow = document.getElementById("tastingEstimateRow");
  const tastingBoxPriceInfo = document.getElementById("tastingBoxPriceInfo");
  const dessertEstimateRow = document.getElementById("dessertEstimateRow");
  const dessertPriceInfo = document.getElementById("dessertPriceInfo");

  if (orderCategory === "custom_cake") {
    tastingBoxPriceInfo.innerHTML = "";
    tastingEstimateRow.style.display = "none";

    if (dessertPriceInfo) dessertPriceInfo.innerHTML = "";
    if (dessertEstimateRow) dessertEstimateRow.style.display = "none";

    renderSizeInfo(document.getElementById("size").value);
  } else {
    customPriceInfo.innerHTML = "";
    customEstimateRow.style.display = "none";
  }

  if (orderCategory !== "tasting_box") {
    document.getElementById("tastingBoxType").value = "";
    setSectionEnabled(document.getElementById("regularTastingFields"), false);
    setSectionEnabled(document.getElementById("deluxeTastingFields"), false);
    tastingBoxPriceInfo.innerHTML = "";
    tastingEstimateRow.style.display = "none";
  }

  if (orderCategory !== "custom_cake") {
    customPriceInfo.innerHTML = "";
    customEstimateRow.style.display = "none";
    document.getElementById("clearBoxOption").value = "standard";
    document.getElementById("clearBoxAvailabilityNote").style.display = "none";
  }

  if (orderCategory !== "dessert") {
    if (dessertPriceInfo) dessertPriceInfo.innerHTML = "";
    if (dessertEstimateRow) dessertEstimateRow.style.display = "none";
  }

  renderContactStepEstimate();
  clearFormError();
}

function resetOrderPanelsAfterSubmit() {
  document.getElementById("orderCategory").value = "";
  document.getElementById("tastingBoxType").value = "";

  toggleOrderTypePanels();
  setSectionEnabled(document.getElementById("regularTastingFields"), false);
  setSectionEnabled(document.getElementById("deluxeTastingFields"), false);

  document.getElementById("customPriceInfo").innerHTML = "";
  document.getElementById("tastingBoxPriceInfo").innerHTML = "";
  document.getElementById("customEstimateRow").style.display = "none";
  document.getElementById("tastingEstimateRow").style.display = "none";

  document.getElementById("clearBoxOption").value = "standard";
  document.getElementById("clearBoxAvailabilityNote").style.display = "none";

  document.getElementById("contactEstimateInfo").innerHTML = "";
  document.getElementById("contactEstimateNote").textContent = "";
  document.getElementById("contactEstimateRow").style.display = "none";

  clearFormError();
}
