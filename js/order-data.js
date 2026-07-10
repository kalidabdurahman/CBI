const invalidDates = [
  "2026-07-16",
  "2026-07-17",
  "2026-07-18",
  "2026-07-19",
  "2026-07-20",
  "2026-07-21",
  "2026-07-22",
  "2026-07-23",
  "2026-07-24",
  "2026-07-25",
  "2026-07-26",
  "2026-08-02",
  "2026-08-07",
  "2026-08-08",
  "2026-08-09",
  "2026-08-14",
  "2026-08-15",
  "2026-08-16",
  "2026-08-19",
  "2026-08-20",
  "2026-09-04",
  "2026-09-05",
  "2026-09-06",
  "2026-09-12",
];

const invalidYears = [
  "2027",
];

const flavorOptions = [
  "French Vanilla",
  "Double Chocolate",
  "Marble",
  "Confetti",
  "Lemon",
  "Strawberry",
  "Red Velvet",
  "Cookies & Cream",
  "Biscoff Swirl"
];

const frostingOptions = [
  "Vanilla Buttercream", "Chocolate Buttercream"
];

const fillingOptions = [
  "Cream Cheese", "Whipped Cream", "Raspberry Jam",  "Blueberry Jam", "Lemon Jam", "Strawberries", "Strawberries & Cream", "Chocolate Fudge",
  "Cookies & Cream", "Lotus Biscoff", "Reese's Peanut Butter"
];

const tastingFrostingOptions = [
  "Vanilla Buttercream",
  "Chocolate Buttercream"
];

const sizeOptions = {
  heart: ["4\" Heart", "6\" Heart", "8\" Heart"],
  round: ["4\" Round", "6\" Round", "8\" Round", "10\" Round", "12\" Round"],
  tiered: [
    "4\" + 6\" Tiered",
    "6\" + 8\" Tiered",
    "8\" + 10\" Tiered",
    "4\" + 6\" + 8\" Tiered",
    "6\" + 8\" + 10\" Tiered"
  ],
  dessert: ["1/2 Dozen (6) Cupcakes", "1 Dozen (12) Cupcakes", "1 Dozen (12) Cake Cups"]
};

const sizeDetails = {
  '4" Heart': { price: "$50", serves: "Feeds 2–4" },
  '6" Heart': { price: "$110", serves: "Feeds 13–19" },
  '8" Heart': { price: "$160", serves: "Feeds 25–30" },

  '4" Round': { price: "$50", serves: "Feeds 4–6" },
  '6" Round': { price: "$100", serves: "Feeds 12–17" },
  '8" Round': { price: "$150", serves: "Feeds 25–35" },
  '10" Round': { price: "$185", serves: "Feeds 40–50" },
  '12" Round': { price: "$230", serves: "Feeds 60–70" },

  '4" + 6" Tiered': { price: "$160", serves: "Feeds 20–30" },
  '6" + 8" Tiered': { price: "$240", serves: "Feeds 50–60" },
  '8" + 10" Tiered': { price: "$300", serves: "Feeds 90–100" },
  '4" + 6" + 8" Tiered': { price: "$310", serves: "Feeds 70–80" },
  '6" + 8" + 10" Tiered': { price: "$410", serves: "Feeds 115–135" },

  "1/2 Dozen (6) Cupcakes": { price: "$25", serves: "6 Cupcakes" },
  "1 Dozen (12) Cupcakes": { price: "$35", serves: "12 Cupcakes" },
  "1 Dozen (12) Cake Cups": { price: "$25", serves: "12 Cake Cups" }
};

const dessertPricing = {
  cupcakes: {
    halfDozenPrice: 25,
    tiers: [
      { min: 1, max: 1, perDozen: 35 },
      { min: 2, max: 4, perDozen: 32 },
      { min: 5, max: 7, perDozen: 30 },
      { min: 8, max: 10, perDozen: 28 }
    ]
  },
  cake_cups: {
    tiers: [
      { min: 1, max: 1, perDozen: 30 },
      { min: 2, max: 4, perDozen: 28 },
      { min: 5, max: 7, perDozen: 27 },
      { min: 8, max: 10, perDozen: 26 }
    ]
  },
  pretzel_rods: {
    tiers: [
      { min: 1, max: 1, perDozen: 25 },
      { min: 2, max: 4, perDozen: 24 },
      { min: 5, max: 7, perDozen: 23 },
      { min: 8, max: 10, perDozen: 22 }
    ]
  },
  cake_pops: {
    tiers: [
      { min: 1, max: 1, perDozen: 30 },
      { min: 2, max: 4, perDozen: 28 },
      { min: 5, max: 7, perDozen: 27 },
      { min: 8, max: 10, perDozen: 26 }
    ]
  }
};

const dessertTypeLabels = {
  cupcakes: "Cupcakes",
  cake_cups: "Cake Cups",
  pretzel_rods: "Pretzel Rods",
  cake_pops: "Cake Pops"
};

const clearBoxPrices = {
  '4" Heart': 3,
  '4" Round': 3,
  '6" Heart': 5,
  '6" Round': 5,
  '8" Heart': 7,
  '8" Round': 7,
  '10" Round': 9
};

const threeTierTieredSizes = [
  '4" + 6" + 8" Tiered',
  '6" + 8" + 10" Tiered'
];
