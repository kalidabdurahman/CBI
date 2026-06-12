// ▼ build the HTML for Step 3 review ▼
function generateReviewSummary() {
  const summaryDiv = document.getElementById("orderReviewSummary");
  const formData = new FormData(document.getElementById("orderForm"));
  const orderCategory = formData.get("orderCategory");
  const cartItems = window.getOrderCartItems();

  const row = (label, value) => {
    const safeValue = value && String(value).trim() ? value : "—";
    return `<li><strong>${label}:</strong> ${safeValue}</li>`;
  };

  if (cartItems.length) {
    const formData = new FormData(document.getElementById("orderForm"));

    const cartHtml = `
      <div class="review-summary-section">
        <h4>Cart Items</h4>
        ${cartItems.map((item, index) => `
          <div class="cart-review-item">
            <h4>Item ${index + 1}: ${item.title}</h4>
            <ul>
              ${row("Order Type", item.displayCategory)}
              ${row("Price Estimate", item.priceEstimateText || item.priceEstimate)}
              ${Object.entries(item.details || {}).map(([key, value]) => {
                if (key.endsWith("Value")) return "";

                // deluxeSlices is an array of objects, so don't display it directly
                if (key === "deluxeSlices") return "";

                // Show the readable slice summary instead
                if (key === "deluxeSliceSummary") {
                  return row("Slices", String(value || "None").replace(/\n/g, "<br>"));
                }

                if (Array.isArray(value)) {
                  return row(key, value.length ? value.join(", ") : "None");
                }

                return row(key, value);
              }).join("")}
              ${row("Images", item.images && item.images.length ? `${item.images.length} uploaded` : "None")}
            </ul>
          </div>
        `).join("")}
      </div>
    `;

    const contactDetailsHtml = `
      <div class="review-summary-section">
        <h4>Contact & Pickup Details</h4>
        <ul>
          ${row("First Name", formData.get("firstName"))}
          ${row("Last Name", formData.get("lastName"))}
          ${row("Phone Number", formData.get("phoneNumber"))}
          ${row("Email", formData.get("email"))}
          ${row("Delivery Option", formData.get("deliveryOption"))}
          ${row("Pickup Date", formData.get("pickupDate"))}
          ${row("Payment Type", formData.get("paymentType"))}
          ${row("Occasion", formData.get("occasion"))}
          ${row("Referral Source", formData.get("referralSource"))}
        </ul>
      </div>
    `;

    summaryDiv.innerHTML = cartHtml + contactDetailsHtml;
    return;
  }

  let orderDetailsHtml = "";

  if (orderCategory === "custom_cake") {
const addons = formData.getAll("addons");
const addonsDisplay = addons.length ? addons.join(", ") : "None";
const fillingDisplay = formData.get("filling") || "None";
const selectedSize = formData.get("size");
const customPriceEstimate =
  selectedSize && sizeDetails[selectedSize]
    ? sizePriceRangeHTML(selectedSize)
    : "—";

const clearBoxValue = formData.get("clearBoxOption") || "standard";
let clearBoxDisplay = "Standard Cardboard Box (Included)";

if (clearBoxValue === "clear") {
  const clearBoxPrice = clearBoxPrices[selectedSize];
  clearBoxDisplay = clearBoxPrice
    ? `Clear Box Upgrade (+$${clearBoxPrice})`
    : "Clear Box Upgrade";
}

orderDetailsHtml = `
  <div class="review-summary-section">
      <h4>Order Details</h4>
      <ul>
        ${row("Order Type", "Custom Cake")}
        ${row("Cake Type", formData.get("cakeType"))}
        ${row("Size", selectedSize)}
        ${row("Price Estimate", customPriceEstimate)}
        ${row("Flavor", formData.get("flavor"))}
        ${row("Frosting", formData.get("frosting"))}
        ${row("Filling", fillingDisplay)}
        ${row("Add-Ons", addonsDisplay)}
        ${row("Cake Box", clearBoxDisplay)}
        ${row("Cake Details", formData.get("cakeDetails"))}
        ${row("Extra Notes", formData.get("notes"))}
      </ul>
    </div>
  `;
  } else if (orderCategory === "tasting_box") {
    const tastingBoxType = formData.get("tastingBoxType");

    if (tastingBoxType === "regular") {
      const sideFillings = formData.getAll("regularBoxSideFillings");
      const sideFillingsDisplay = sideFillings.length ? sideFillings.join(", ") : "None";
      const regularFlavors = "Vanilla, Chocolate, Marble, Cookies & Cream, Red Velvet, Confetti";

      orderDetailsHtml = `
        <div class="review-summary-section">
          <h4>Order Details</h4>
          <ul>
            ${row("Order Type", "Cake Tasting Box")}
            ${row("Tasting Box Type", "Regular")}
            ${row("Price Estimate", "$40")}
            ${row("Included Flavors", regularFlavors)}
            ${row("Frosting", "Vanilla Buttercream on all 6 slices")}
            ${row("Side Fillings", sideFillingsDisplay)}
            ${row("Extra Notes", formData.get("tastingBoxNotes"))}
          </ul>
        </div>
      `;
    }

    if (tastingBoxType === "deluxe") {
      let slicesHtml = "";

      for (let i = 1; i <= 6; i++) {
        const flavor = formData.get(`slice${i}Flavor`) || "—";
        const frosting = formData.get(`slice${i}Frosting`) || "—";
        const filling = formData.get(`slice${i}Filling`) || "None";

        slicesHtml += `
          <div class="review-slice-card">
            <strong>Slice ${i}</strong><br>
            Flavor: ${flavor}<br>
            Frosting: ${frosting}<br>
            Filling: ${filling}
          </div>
        `;
      }

      orderDetailsHtml = `
        <div class="review-summary-section">
          <h4>Order Details</h4>
          <ul>
            ${row("Order Type", "Cake Tasting Box")}
            ${row("Tasting Box Type", "Deluxe")}
            ${row("Price Estimate", "$55")}
            ${row("Extra Notes", formData.get("tastingBoxNotesDeluxe"))}
          </ul>

          <div class="review-slices-grid">
            ${slicesHtml}
          </div>
        </div>
      `;
    }
  }

else if (orderCategory === "dessert") {
  const dessertType = formData.get("dessertType");
  const dessertPackage = formData.get("dessertPackage");
  const dessertDetails = getDessertPackageDetails(dessertType, dessertPackage);
  const dessertName = dessertTypeLabels[dessertType] || "Dessert";

  const flavorDisplay = formData.get("dessertFlavor") || "N/A";
  const frostingDisplay = formData.get("dessertFrosting") || "N/A";
  const fillingDisplay =
    dessertType === "cupcakes"
      ? (formData.get("dessertFilling") || "None")
      : "N/A";

  const priceDisplay = dessertDetails
    ? `${dessertDetails.price} – ${dessertName}, ${dessertPackage}`
    : "—";

  const totalPiecesDisplay = dessertDetails
    ? dessertDetails.totalPieces
    : "—";

  orderDetailsHtml = `
    <div class="review-summary-section">
      <h4>Order Details</h4>
      <ul>
        ${row("Order Type", "Desserts")}
        ${row("Dessert Type", dessertName)}
        ${row("Quantity", dessertPackage)}
        ${row("Total Pieces", totalPiecesDisplay)}
        ${row("Price Estimate", priceDisplay)}
        ${row("Flavor", flavorDisplay)}
        ${row("Frosting", frostingDisplay)}
        ${row("Filling", fillingDisplay)}
        ${row("Dessert Details", formData.get("dessertDetails"))}
        ${row("Extra Notes", formData.get("dessertNotes"))}
      </ul>
    </div>
  `;
}

  const contactDetailsHtml = `
    <div class="review-summary-section">
      <h4>Contact & Pickup Details</h4>
      <ul>
        ${row("First Name", formData.get("firstName"))}
        ${row("Last Name", formData.get("lastName"))}
        ${row("Phone Number", formData.get("phoneNumber"))}
        ${row("Email", formData.get("email"))}
        ${row("Delivery Option", formData.get("deliveryOption"))}
        ${row("Pickup Date", formData.get("pickupDate"))}
        ${row("Payment Type", formData.get("paymentType"))}
        ${row("Occasion", formData.get("occasion"))}
        ${row("Referral Source", formData.get("referralSource"))}
      </ul>
    </div>
  `;

  summaryDiv.innerHTML = orderDetailsHtml + contactDetailsHtml;
}
// ▲ end summary helper ▲
