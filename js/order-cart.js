(function () {
  let cartItems = [];
  let editingCartItemId = null;
  let editingExistingImages = [];

  const CART_STORAGE_KEY = "cbiCartItemsV2";

  function makeCartItemId() {
    return `cart_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  }

  function getCartItemsForStorage() {
    return cartItems.map(item => ({
      ...item,
      images: []
    }));
  }

  function saveCartToStorage() {
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(getCartItemsForStorage()));
    } catch (error) {
      console.warn("Cart could not be saved to localStorage.", error);
    }
  }

  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      cartItems = saved ? JSON.parse(saved) : [];

      cartItems = cartItems.map(item => ({
        ...item,
        images: item.images || []
      }));
    } catch {
      cartItems = [];
    }

    renderCart();
  }

  function getCartItemLeadTimeDays(item) {
    const details = item.details || {};
    const storedLeadDays = Number(item.requiredLeadDays) || 7;
    const isTieredCake =
      item.orderCategory === "custom_cake" &&
      (
        details.cakeTypeValue === "tiered" ||
        details.cakeType === "tiered" ||
        details.cakeType === "Tiered Cake" ||
        (typeof details.size === "string" && details.size.includes("Tiered"))
      );

    if (isTieredCake) {
      return Math.max(storedLeadDays, getTieredLeadTimeDays(details.size));
    }

    return storedLeadDays;
  }

  function getCartRequiredLeadTimeDays() {
    if (!cartItems.length) return 7;
    return Math.max(...cartItems.map(getCartItemLeadTimeDays));
  }

  function buildCartPlainTextSummary() {
    if (!cartItems.length) return "";

    return cartItems.map((item, index) => {
      const lines = [
        `Item ${index + 1}: ${item.title}`,
        `Order Type: ${item.displayCategory}`,
        `Price Estimate: ${item.priceEstimateText || item.priceEstimate || "—"}`
      ];

      Object.entries(item.details || {}).forEach(([key, value]) => {
        if (key === "deluxeSlices") return;

        if (key === "deluxeSliceSummary") {
          lines.push(`Slices:\n${value || "None"}`);
          return;
        }

        if (Array.isArray(value)) {
          lines.push(`${key}: ${value.length ? value.join(", ") : "None"}`);
        } else {
          lines.push(`${key}: ${value || "—"}`);
        }
      });

      if (item.images && item.images.length) {
        lines.push(`Images: ${item.images.map(img => img.name).join(", ")}`);
      }

      return lines.join("\n");
    }).join("\n\n----------------------------------------\n\n");
  }

  function cartItemJsonForSubmit() {
    return cartItems.map(item => ({
      ...item,
      images: (item.images || []).map(img => ({
        name: img.name,
        type: img.type
      }))
    }));
  }

  function renderCart() {
    const list = document.getElementById("cartItemsList");
    const emptyMessage = document.getElementById("cartEmptyMessage");
    const checkoutBtn = document.getElementById("checkoutCartBtn");

    if (!list || !emptyMessage || !checkoutBtn) return;

    emptyMessage.style.display = cartItems.length ? "none" : "block";
    checkoutBtn.disabled = cartItems.length === 0;

    list.innerHTML = cartItems.map((item, index) => `
      <div class="cart-item-card" data-cart-id="${item.id}">
        <div class="cart-item-header">
          <div>
            <div class="cart-item-title">${index + 1}. ${item.title}</div>
            <div class="cart-item-meta">
              ${item.displayCategory}<br>
              Price Estimate: ${item.priceEstimateText || item.priceEstimate || "—"}<br>
              Images: ${item.images && item.images.length ? item.images.length : 0}
            </div>
          </div>

          <div class="cart-item-buttons">
            <button type="button" class="cart-small-btn edit-cart-item" data-cart-id="${item.id}">Edit</button>
            <button type="button" class="cart-small-btn remove-cart-item" data-cart-id="${item.id}">Remove</button>
          </div>
        </div>
      </div>
    `).join("");
  }

  function addOrUpdateCartItem(item) {
    if (editingCartItemId) {
      cartItems = cartItems.map(existing => existing.id === editingCartItemId ? item : existing);
    } else {
      cartItems.push(item);
    }

    saveCartToStorage();
    renderCart();

    if (typeof window.resetItemBuilderForm === "function") {
      window.resetItemBuilderForm();
    }
  }

  function removeCartItem(id) {
    const wasEditingRemovedItem = editingCartItemId === id;

    cartItems = cartItems.filter(item => item.id !== id);
    saveCartToStorage();
    renderCart();

    if (wasEditingRemovedItem && typeof window.resetItemBuilderForm === "function") {
      window.resetItemBuilderForm();
    }
  }

  function loadCartItemForEdit(id) {
    const item = cartItems.find(entry => entry.id === id);
    if (!item) return;

    editingCartItemId = id;
    editingExistingImages = item.images || [];

    document.getElementById("orderCategory").value = item.orderCategory;
    toggleOrderTypePanels();

    if (item.orderCategory === "custom_cake") {
      const d = item.details;

      document.getElementById("cakeType").value = d.cakeTypeValue;
      document.getElementById("cakeType").dispatchEvent(new Event("change"));

      document.getElementById("size").value = d.size;
      document.getElementById("flavor").value = d.flavor;
      document.getElementById("frosting").value = d.frosting;
      document.getElementById("filling").value = d.filling === "None" ? "" : d.filling;
      document.getElementById("clearBoxOption").value = d.clearBoxOption || "standard";
      document.getElementById("cakeDetails").value = d.cakeDetails || "";
      document.getElementById("notes").value = d.notes || "";

      document.querySelectorAll("input[name='addons']").forEach(input => {
        input.checked = Array.isArray(d.addons) && d.addons.includes(input.value);
      });

      renderSizeInfo(d.size);
      updateClearBoxOptions(d.size);
      renderSavedCartImagePreviews(editingExistingImages, "previewContainer");
    }

    if (item.orderCategory === "tasting_box") {
      const d = item.details;
      const tastingValue = d.tastingBoxType === "Regular" ? "regular" : "deluxe";

      document.getElementById("tastingBoxType").value = tastingValue;
      toggleTastingTypePanels();

      if (tastingValue === "regular") {
        document.querySelectorAll("input[name='regularBoxSideFillings']").forEach(input => {
          input.checked = Array.isArray(d.sideFillings) && d.sideFillings.includes(input.value);
        });

        document.getElementById("tastingBoxNotes").value = d.notes || "";
      }

      if (tastingValue === "deluxe") {
        (d.deluxeSlices || []).forEach(slice => {
          document.getElementById(`slice${slice.slice}Flavor`).value = slice.flavor || "";
          document.getElementById(`slice${slice.slice}Frosting`).value = slice.frosting || "";
          document.getElementById(`slice${slice.slice}Filling`).value = slice.filling || "";
        });

        document.getElementById("tastingBoxNotesDeluxe").value = d.notes || "";
      }
    }

    if (item.orderCategory === "dessert") {
      const d = item.details;

      document.getElementById("dessertType").value = d.dessertTypeValue;
      populateDessertPackages();
      renderDessertFieldVisibility();

      document.getElementById("dessertPackage").value = d.dessertPackage || "";
      document.getElementById("dessertFlavor").value = d.flavor === "N/A" ? "" : d.flavor;
      document.getElementById("dessertFrosting").value = d.frosting === "N/A" ? "" : d.frosting;
      document.getElementById("dessertFilling").value = d.filling === "N/A" || d.filling === "None" ? "" : d.filling;
      document.getElementById("dessertDetails").value = d.dessertDetails || "";
      document.getElementById("dessertNotes").value = d.notes || "";

      renderDessertPriceInfo();
      renderSavedCartImagePreviews(editingExistingImages, "dessertPreviewContainer");
    }

    const addBtn = document.getElementById("addToCartBtn");
    if (addBtn) addBtn.textContent = "Update Cart Item";

    clearFormError();
  }

  function clearOrderCart() {
    cartItems = [];
    editingCartItemId = null;
    editingExistingImages = [];

    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (error) {
      console.warn("Could not clear saved cart after submit.", error);
    }

    renderCart();
  }

  function clearOrderCartEditState() {
    editingCartItemId = null;
    editingExistingImages = [];
  }

  window.getOrderCartItems = () => cartItems.slice();
  window.hasOrderCartItems = () => cartItems.length > 0;
  window.getEditingCartItemId = () => editingCartItemId;
  window.isEditingOrderCartItem = () => Boolean(editingCartItemId);
  window.getEditingExistingImages = () => editingExistingImages.slice();
  window.getEditingExistingImageCount = () => editingCartItemId ? editingExistingImages.length : 0;
  window.removeEditingExistingImageAt = (index) => { editingExistingImages.splice(index, 1); };
  window.clearOrderCartEditState = clearOrderCartEditState;
  window.createOrderCartItemId = makeCartItemId;
  window.addOrUpdateCartItem = addOrUpdateCartItem;
  window.removeCartItem = removeCartItem;
  window.loadCartItemForEdit = loadCartItemForEdit;
  window.loadCartFromStorage = loadCartFromStorage;
  window.clearOrderCart = clearOrderCart;
  window.getCartRequiredLeadTimeDays = getCartRequiredLeadTimeDays;
  window.buildCartPlainTextSummary = buildCartPlainTextSummary;
  window.cartItemJsonForSubmit = cartItemJsonForSubmit;
})();
