function getDessertPerDozenPrice(dessertType, dozenCount) {
  const pricing = dessertPricing[dessertType];
  if (!pricing) return null;

  const tier = pricing.tiers.find(item => dozenCount >= item.min && dozenCount <= item.max);
  return tier ? tier.perDozen : null;
}

function getDessertQuantityOptions(dessertType) {
  const options = [];

  if (dessertType === "cupcakes") {
    options.push({
      label: "1/2 Dozen (6)",
      dozenCount: 0.5,
      totalPieces: 6,
      priceValue: dessertPricing.cupcakes.halfDozenPrice,
      price: `$${dessertPricing.cupcakes.halfDozenPrice}`
    });
  }

  for (let dozenCount = 1; dozenCount <= 10; dozenCount++) {
    const perDozen = getDessertPerDozenPrice(dessertType, dozenCount);
    if (!perDozen) continue;

    const totalPieces = dozenCount * 12;
    const totalPrice = perDozen * dozenCount;
    const dozenLabel = dozenCount === 1 ? "1 Dozen" : `${dozenCount} Dozen`;

    options.push({
      label: `${dozenLabel} (${totalPieces})`,
      dozenCount,
      totalPieces,
      perDozen,
      priceValue: totalPrice,
      price: `$${totalPrice}`
    });
  }

  return options;
}

function getDessertPackageDetails(dessertType, packageLabel) {
  const packages = getDessertQuantityOptions(dessertType);
  return packages.find(item => item.label === packageLabel);
}

function dessertNeedsFlavor(dessertType) {
  return dessertType === "cupcakes" || dessertType === "cake_cups" || dessertType === "cake_pops";
}

function dessertNeedsFrosting(dessertType) {
  return dessertType === "cupcakes" || dessertType === "cake_cups";
}

function dessertAllowsFilling(dessertType) {
  return dessertType === "cupcakes";
}

function getTieredLeadTimeDays(sizeKey) {
  return threeTierTieredSizes.includes(sizeKey) ? 30 : 14;
}

function getLeadTimeText(days) {
  if (days === 30) return "at least 1 month";
  if (days === 14) return "at least 2 weeks";
  if (days === 7) return "at least 1 week";
  return `at least ${days} days`;
}

function sizePriceRangeHTML(sizeKey) {
  const { price, serves } = sizeDetails[sizeKey];     // price like "$100"
  const base = parseInt(price.replace(/[^0-9]/g, ""), 10);
  const max  = base + 30;
  return `~$${base}–$${max} – <em>${serves}</em>`;
}
