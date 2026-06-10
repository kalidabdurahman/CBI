const SPREADSHEET_ID = "1Kl3aBtQyC8Ek4AQkMNGSzegQiZIj3P1gCTRg-jCMQI8";
const CUSTOM_ORDERS_TAB = "Custom Orders";
const TASTING_BOX_TAB = "Tasting Box Orders";
const DESSERT_ORDERS_TAB = "Dessert Orders";
const BATCHED_ORDERS_TAB = "Batched Orders";
const IMAGE_FOLDER_ID = "16wfK-Hp76Y0y9Vbn57CGgCGMBUhD86B1";
const ORDER_COUNTER_KEY = "LAST_ORDER_NUMBER";
const NOTIFICATION_EMAIL = "cakesbyiftu@gmail.com";

const DESSERT_TYPE_LABELS = {
  cupcakes: "Cupcakes",
  cake_cups: "Cake Cups",
  pretzel_rods: "Pretzel Rods",
  cake_pops: "Cake Pops"
};

function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const customSheet = ss.getSheetByName(CUSTOM_ORDERS_TAB);
    const tastingSheet = ss.getSheetByName(TASTING_BOX_TAB);
    const dessertSheet = ss.getSheetByName(DESSERT_ORDERS_TAB);
    const batchSheet = ss.getSheetByName(BATCHED_ORDERS_TAB);
    const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);

    if (!customSheet) {
      throw new Error(`Missing sheet tab: ${CUSTOM_ORDERS_TAB}`);
    }

    if (!tastingSheet) {
      throw new Error(`Missing sheet tab: ${TASTING_BOX_TAB}`);
    }

    if (!dessertSheet) {
      throw new Error(`Missing sheet tab: ${DESSERT_ORDERS_TAB}`);
    }

    if (!batchSheet) {
      throw new Error(`Missing sheet tab: ${BATCHED_ORDERS_TAB}`);
    }

    const formData = e.parameter;
    const allParams = e.parameters;

    const orderCategory = formData.orderCategory || "custom_cake";

    const firstName = (formData.firstName || "Unknown").trim();
    const lastName = (formData.lastName || "User").trim();

    const now = new Date();
    const orderId = getNextOrderId(customSheet, tastingSheet, dessertSheet, batchSheet);

    const customerName = `${firstName}_${lastName}`
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");

    if (orderCategory === "batch_order") {
      const cartItems = parseCartItemsJson(formData.cartItemsJson);
      const itemCount = Number(formData.cartItemCount || cartItems.length || 0);
      const cartSummary = buildBatchCartSummary(cartItems, formData.cartSummary || "");

      batchSheet.appendRow([
        now,
        orderId,
        firstName,
        lastName,
        formData.phoneNumber || "",
        formData.email || "",
        formData.deliveryOption || "",
        formData.pickupDate || "",
        formData.paymentType || "",
        formData.occasion || "",
        formData.referralSource || "",
        itemCount,
        cartSummary,
        formData.cartItemsJson || ""
      ]);

      saveBatchInspirationImages({
        formData,
        folder,
        customerName,
        orderId,
        itemCount
      });

      sendOrderNotificationEmail({
        orderCategory: "batch_order",
        orderId,
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        deliveryOption: formData.deliveryOption || "",
        pickupDate: formData.pickupDate || "",
        paymentType: formData.paymentType || "",
        occasion: formData.occasion || "",
        referralSource: formData.referralSource || "",
        itemCount,
        cartItems,
        cartSummary
      });

    } else if (orderCategory === "custom_cake") {
      const addons = normalizeMultiValue(allParams.addons).join(", ");
      const cakeDetails = formData.cakeDetails || "";
      const notes = formData.notes || "";

      customSheet.appendRow([
        now,
        orderId,
        firstName,
        lastName,
        formData.phoneNumber || "",
        formData.email || "",
        formData.deliveryOption || "",
        formData.pickupDate || "",
        formData.paymentType || "",
        formData.occasion || "",
        formData.referralSource || "",
        formData.cakeType || "",
        formData.size || "",
        formData.flavor || "",
        formData.frosting || "",
        formData.filling || "",
        addons,
        formData.clearBoxOption || "standard",
        cakeDetails,
        notes
      ]);

      saveInspirationImages({
        formData,
        folder,
        customerName,
        orderId
      });

      sendOrderNotificationEmail({
        orderCategory: "custom_cake",
        orderId,
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        deliveryOption: formData.deliveryOption || "",
        pickupDate: formData.pickupDate || "",
        paymentType: formData.paymentType || "",
        occasion: formData.occasion || "",
        referralSource: formData.referralSource || "",
        cakeType: formData.cakeType || "",
        size: formData.size || "",
        flavor: formData.flavor || "",
        frosting: formData.frosting || "",
        filling: formData.filling || "",
        addons,
        clearBoxOption: formData.clearBoxOption || "standard",
        cakeDetails,
        notes
      });

    } else if (orderCategory === "tasting_box") {
      const tastingBoxType = formData.tastingBoxType || "";
      const notes =
        tastingBoxType === "regular"
          ? (formData.tastingBoxNotes || "")
          : (formData.tastingBoxNotesDeluxe || "");

      const regularSideFillings = normalizeMultiValue(allParams.regularBoxSideFillings).join(", ");
      const deluxeSliceSummary = formData.deluxeSliceSummary || "";

      tastingSheet.appendRow([
        now,
        orderId,
        firstName,
        lastName,
        formData.phoneNumber || "",
        formData.email || "",
        formData.deliveryOption || "",
        formData.pickupDate || "",
        formData.paymentType || "",
        formData.occasion || "",
        formData.referralSource || "",
        tastingBoxType,
        regularSideFillings,
        deluxeSliceSummary,
        notes
      ]);

      sendOrderNotificationEmail({
        orderCategory: "tasting_box",
        orderId,
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        deliveryOption: formData.deliveryOption || "",
        pickupDate: formData.pickupDate || "",
        paymentType: formData.paymentType || "",
        occasion: formData.occasion || "",
        referralSource: formData.referralSource || "",
        tastingBoxType,
        regularSideFillings,
        deluxeSliceSummary,
        notes
      });

    } else if (orderCategory === "dessert") {
      const dessertType = formData.dessertType || "";
      const dessertTypeLabel = formatDessertType(dessertType);
      const dessertPackage = formData.dessertPackage || "";
      const dessertDetails = formData.dessertDetails || "";
      const notes = formData.dessertNotes || "";
      const priceEstimate = formData.dessertPriceEstimate || "";
      const totalPieces = formData.dessertTotalPieces || "";

      dessertSheet.appendRow([
        now,
        orderId,
        firstName,
        lastName,
        formData.phoneNumber || "",
        formData.email || "",
        formData.deliveryOption || "",
        formData.pickupDate || "",
        formData.paymentType || "",
        formData.occasion || "",
        formData.referralSource || "",
        dessertTypeLabel,
        dessertPackage,
        totalPieces,
        formData.dessertFlavor || "",
        formData.dessertFrosting || "",
        formData.dessertFilling || "",
        dessertDetails,
        notes,
        priceEstimate
      ]);

      saveInspirationImages({
        formData,
        folder,
        customerName,
        orderId
      });

      sendOrderNotificationEmail({
        orderCategory: "dessert",
        orderId,
        firstName,
        lastName,
        phoneNumber: formData.phoneNumber || "",
        email: formData.email || "",
        deliveryOption: formData.deliveryOption || "",
        pickupDate: formData.pickupDate || "",
        paymentType: formData.paymentType || "",
        occasion: formData.occasion || "",
        referralSource: formData.referralSource || "",
        dessertType: dessertTypeLabel,
        dessertPackage,
        totalPieces,
        dessertFlavor: formData.dessertFlavor || "",
        dessertFrosting: formData.dessertFrosting || "",
        dessertFilling: formData.dessertFilling || "",
        dessertDetails,
        notes,
        priceEstimate
      });

    } else {
      throw new Error(`Unsupported orderCategory: ${orderCategory}`);
    }

    return ContentService
      .createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    Logger.log("doPost failed: " + error.stack);
    return ContentService
      .createTextOutput(`Error: ${error.message}`)
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function normalizeMultiValue(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function cleanFileName(fileName) {
  return (fileName || "image")
    .replace(/\s+/g, "_")
    .replace(/[^\w.\-]/g, "");
}

function saveInspirationImages({ formData, folder, customerName, orderId }) {
  for (let i = 1; i <= 3; i++) {
    const base64Data = formData[`image${i}`];
    const imageName = formData[`imageName${i}`];
    const imageType = formData[`imageType${i}`] || "image/jpeg";

    if (!base64Data || !imageName) continue;

    const safeImageName = cleanFileName(imageName);

    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      imageType,
      `${customerName}_${orderId}_inspo${i}_${safeImageName}`
    );

    folder.createFile(blob);
  }
}

function saveBatchInspirationImages({ formData, folder, customerName, orderId, itemCount }) {
  for (let itemIndex = 1; itemIndex <= itemCount; itemIndex++) {
    for (let imageIndex = 1; imageIndex <= 3; imageIndex++) {
      const base64Data = formData[`item${itemIndex}Image${imageIndex}`];
      const imageName = formData[`item${itemIndex}ImageName${imageIndex}`];
      const imageType = formData[`item${itemIndex}ImageType${imageIndex}`] || "image/jpeg";

      if (!base64Data || !imageName) continue;

      const safeImageName = cleanFileName(imageName);
      const paddedItemIndex = String(itemIndex).padStart(2, "0");

      const blob = Utilities.newBlob(
        Utilities.base64Decode(base64Data),
        imageType,
        `${customerName}_${orderId}_item${paddedItemIndex}_inspo${imageIndex}_${safeImageName}`
      );

      folder.createFile(blob);
    }
  }
}

function getExisting2026OrderCount(customSheet, tastingSheet, dessertSheet, batchSheet) {
  const customCount = Math.max(customSheet.getLastRow() - 1, 0);
  const tastingCount = Math.max(tastingSheet.getLastRow() - 1, 0);
  const dessertCount = Math.max(dessertSheet.getLastRow() - 1, 0);
  const batchCount = Math.max(batchSheet.getLastRow() - 1, 0);
  return customCount + tastingCount + dessertCount + batchCount;
}

function getNextOrderId(customSheet, tastingSheet, dessertSheet, batchSheet) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const props = PropertiesService.getScriptProperties();
    const storedValue = props.getProperty(ORDER_COUNTER_KEY);

    const lastNumber = storedValue
      ? Number(storedValue)
      : getExisting2026OrderCount(customSheet, tastingSheet, dessertSheet, batchSheet);

    const nextNumber = lastNumber + 1;

    props.setProperty(ORDER_COUNTER_KEY, String(nextNumber));

    return String(nextNumber).padStart(3, "0");
  } finally {
    lock.releaseLock();
  }
}

function parseCartItemsJson(cartItemsJson) {
  if (!cartItemsJson) return [];

  try {
    const parsed = JSON.parse(cartItemsJson);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    Logger.log(`Failed to parse cartItemsJson: ${error}`);
    return [];
  }
}

function buildBatchCartSummary(cartItems, fallbackSummary) {
  if (!cartItems || !cartItems.length) {
    return fallbackSummary || "";
  }

  return cartItems.map((item, index) => formatCartItemForEmail(item, index)).join(
    "\n\n----------------------------------------\n\n"
  );
}

function formatCartItemForEmail(item, index) {
  const lines = [
    `Item ${index + 1}: ${item.title || "Untitled Item"}`,
    `Order Type: ${item.displayCategory || formatOrderCategory(item.orderCategory)}`,
    `Price Estimate: ${item.priceEstimateText || item.priceEstimate || "—"}`
  ];

  const details = item.details || {};

  Object.keys(details).forEach(key => {
    if (key.endsWith("Value")) return;
    if (key === "deluxeSlices") return;

    const label = formatDetailKey(key);
    const value = formatDetailValue(details[key]);

    lines.push(`${label}: ${value}`);
  });

  const imageCount = item.images && item.images.length ? item.images.length : 0;
  lines.push(`Images: ${imageCount}`);

  return lines.join("\n");
}

function formatDetailKey(key) {
  const labels = {
    cakeType: "Cake Type",
    size: "Size",
    flavor: "Flavor",
    frosting: "Frosting",
    filling: "Filling",
    addons: "Add-Ons",
    clearBoxOption: "Cake Box",
    cakeDetails: "Cake Details",
    notes: "Notes",
    tastingBoxType: "Tasting Box Type",
    includedFlavors: "Included Flavors",
    sideFillings: "Side Fillings",
    deluxeSliceSummary: "Deluxe Slice Summary",
    dessertType: "Dessert Type",
    dessertPackage: "Quantity",
    totalPieces: "Total Pieces",
    dessertDetails: "Dessert Details",
    priceEstimate: "Price Estimate"
  };

  return labels[key] || key;
}

function formatDetailValue(value) {
  if (Array.isArray(value)) {
    if (!value.length) return "None";

    if (typeof value[0] === "object") {
      return value.map(item => JSON.stringify(item)).join("; ");
    }

    return value.join(", ");
  }

  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (value === "standard") {
    return "Standard Cardboard Box (Included)";
  }

  if (value === "clear") {
    return "Clear Box Upgrade";
  }

  return String(value);
}

function sendOrderNotificationEmail(order) {
  const remaining = MailApp.getRemainingDailyQuota();
  Logger.log(`Remaining email quota before send: ${remaining}`);

  const subject = buildEmailSubject(order);
  const body = buildOrderEmailPlainText(order);

  MailApp.sendEmail(
    NOTIFICATION_EMAIL,
    subject,
    body
  );

  Logger.log(`Order notification email sent for order ${order.orderId} to ${NOTIFICATION_EMAIL}`);
}

function buildEmailSubject(order) {
  if (order.orderCategory === "batch_order") {
    return `New CakesByIftu Cart Order #${order.orderId} — ${order.firstName} ${order.lastName}`;
  }

  if (order.orderCategory === "custom_cake") {
    return `New Custom Cake Order #${order.orderId} — ${order.firstName} ${order.lastName}`;
  }

  if (order.orderCategory === "tasting_box") {
    const boxType = capitalize(order.tastingBoxType) || "Tasting Box";
    return `New ${boxType} Tasting Box Order #${order.orderId} — ${order.firstName} ${order.lastName}`;
  }

  if (order.orderCategory === "dessert") {
    return `New Dessert Order #${order.orderId} — ${order.firstName} ${order.lastName}`;
  }

  return `New CakesByIftu Order #${order.orderId} — ${order.firstName} ${order.lastName}`;
}

function buildOrderEmailPlainText(order) {
  const lines = [
    "New CakesByIftu Order Submitted",
    "----------------------------------------",
    `Order ID: ${order.orderId}`,
    `Order Type: ${formatOrderCategory(order.orderCategory)}`,
    "",
    "Customer Info",
    `Name: ${order.firstName} ${order.lastName}`,
    `Phone Number: ${order.phoneNumber || "—"}`,
    `Email: ${order.email || "—"}`,
    `Delivery Option: ${order.deliveryOption || "—"}`,
    `Pickup Date: ${order.pickupDate || "—"}`,
    `Payment Type: ${order.paymentType || "—"}`,
    `Occasion: ${order.occasion || "—"}`,
    `Referral Source: ${order.referralSource || "—"}`,
    ""
  ];

  if (order.orderCategory === "batch_order") {
    lines.push(
      "Cart Items",
      `Item Count: ${order.itemCount || 0}`,
      "",
      order.cartSummary || "—",
      "",
      "Inspiration images, if uploaded, were saved to the 2026 inspiration folder."
    );
  }

  if (order.orderCategory === "custom_cake") {
    lines.push(
      "Order Details",
      `Cake Type: ${order.cakeType || "—"}`,
      `Size: ${order.size || "—"}`,
      `Flavor: ${order.flavor || "—"}`,
      `Frosting: ${order.frosting || "—"}`,
      `Filling: ${order.filling || "None"}`,
      `Add-Ons: ${order.addons || "None"}`,
      `Cake Box: ${formatClearBoxValue(order.clearBoxOption)}`,
      `Cake Details: ${order.cakeDetails || "—"}`,
      `Extra Notes: ${order.notes || "—"}`,
      "",
      "Inspiration images, if uploaded, were saved to the 2026 inspiration folder."
    );
  }

  if (order.orderCategory === "tasting_box") {
    lines.push(
      "Order Details",
      `Tasting Box Type: ${capitalize(order.tastingBoxType) || "—"}`
    );

    if (order.tastingBoxType === "regular") {
      lines.push(
        `Regular Side Fillings: ${order.regularSideFillings || "None"}`
      );
    }

    if (order.tastingBoxType === "deluxe") {
      lines.push(
        "Deluxe Slice Summary:",
        order.deluxeSliceSummary || "—"
      );
    }

    lines.push(`Extra Notes: ${order.notes || "—"}`);
  }

  if (order.orderCategory === "dessert") {
    lines.push(
      "Order Details",
      `Dessert Type: ${order.dessertType || "—"}`,
      `Quantity: ${order.dessertPackage || "—"}`,
      `Total Pieces: ${order.totalPieces || "—"}`,
      `Price Estimate: ${order.priceEstimate || "—"}`,
      `Flavor: ${order.dessertFlavor || "N/A"}`,
      `Frosting: ${order.dessertFrosting || "N/A"}`,
      `Filling: ${order.dessertFilling || "N/A"}`,
      `Dessert Details: ${order.dessertDetails || "—"}`,
      `Extra Notes: ${order.notes || "—"}`,
      "",
      "Inspiration images, if uploaded, were saved to the 2026 inspiration folder."
    );
  }

  return lines.join("\n");
}

function formatOrderCategory(value) {
  if (value === "batch_order") return "Cart / Batched Order";
  if (value === "custom_cake") return "Custom Cake";
  if (value === "tasting_box") return "Cake Tasting Box";
  if (value === "dessert") return "Desserts";
  return value || "—";
}

function formatClearBoxValue(value) {
  return value === "clear"
    ? "Clear Box Upgrade"
    : "Standard Cardboard Box (Included)";
}

function formatDessertType(value) {
  return DESSERT_TYPE_LABELS[value] || value || "";
}

function capitalize(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function testNotificationEmail() {
  const order = {
    orderCategory: "batch_order",
    orderId: "TEST",
    firstName: "Testing",
    lastName: "Customer",
    phoneNumber: "(651) 555-1212",
    email: "cakesbyiftu@example.com",
    deliveryOption: "pickup",
    pickupDate: "2026-03-25",
    paymentType: "cashapp",
    occasion: "Birthday",
    referralSource: "Instagram",
    itemCount: 2,
    cartSummary:
      "Item 1: 8\" Round Cake\nOrder Type: Custom Cake\nPrice Estimate: ~$130–$160\nFlavor: Lemon\nFrosting: Vanilla Buttercream\n\n----------------------------------------\n\nItem 2: Pretzel Rods — 4 Dozen (48)\nOrder Type: Desserts\nPrice Estimate: $96"
  };

  sendOrderNotificationEmail(order);
}

function testSimpleMailApp() {
  const remaining = MailApp.getRemainingDailyQuota();
  Logger.log(`Remaining email quota: ${remaining}`);

  MailApp.sendEmail({
    to: NOTIFICATION_EMAIL,
    subject: "CBI test email",
    body: "This is a simple MailApp test email."
  });

  Logger.log("Simple MailApp test sent");
}

function doGet() {
  return ContentService.createTextOutput("Web app is live");
}