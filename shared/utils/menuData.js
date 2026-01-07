// Shared Menu Data Management - Works for both Web (localStorage) and App (AsyncStorage)
// This will be imported and adapted by web and app specific implementations

export const defaultMenuData = [
  {
    id: 1,
    category: "Full Tiffin",
    icon: "fa-star",
    tag: "Best Seller",
    description:
      "Gravy Sabji + Dry Sabji + 4 Rotis + Rice (4 Rotis with Rice / 6 Rotis without Rice)",
    items: [
      { id: 1, name: "Thali Plastic (Classic)", price: 120 },
      { id: 10, name: "Tiffin Steel (Zambo)", price: 150 },
      // Mix & Match Tiffin section
      { id: 2, name: "Mix & Match Tiffin - 2 Sabji + 6 Rotis", price: 120 },
      {
        id: 3,
        name: "Mix & Match Tiffin - 1 Sabji + 4 Rotis + Rice",
        price: 100,
      },
      { id: 4, name: "Mix & Match Tiffin - 2 Sabji + 4 Rotis", price: 120 },
      { id: 5, name: "Mix & Match Tiffin - 1 Sabji + 6 Rotis", price: 100 },
      { id: 6, name: "Mix & Match Tiffin - 1 Sabji + 4 Rotis", price: 80 },
      {
        id: 7,
        name: "Mix & Match Tiffin - 1 Sabji + 2 Bowls Rice",
        price: 100,
      },
      { id: 8, name: "Mix & Match Tiffin - Only 1 Sabji", price: 40 },
      // Khichdi section
      { id: 9, name: "Khichdi - Full Tiffin (4 bowls)", price: 120 },
    ],
  },
  {
    id: 4,
    category: "Rotis & Parathas",
    icon: "fa-bread-slice",
    items: [
      { id: 1, name: "Plain Roti", price: 10 },
      { id: 2, name: "Roti with Ghee", price: 12 },
      { id: 3, name: "Plain Paratha", price: 20 },
      { id: 4, name: "Stuffed Paratha (Aloo/Gobhi/Muli/Methi)", price: 35 },
      { id: 5, name: "3 Stuffed Parathas", price: 100 },
    ],
  },
  {
    id: 5,
    category: "Add-ons",
    icon: "fa-plus",
    items: [
      { id: 1, name: "Homemade Curd (1 Bowl)", price: 25 },
      { id: 2, name: "Parathas + Curd Combo", price: 100 },
    ],
  },
  {
    id: 6,
    category: "Pickup Option",
    icon: "fa-person-walking",
    items: [{ id: 1, name: "Self-Pickup (A1 Tower)", price: 100 }],
    description: "Thali & Tiffin both available",
  },
];

// Trigger data sync event
export const triggerDataSync = () => {
  // For web
  if (typeof window !== "undefined" && window.localStorage) {
    const event = new CustomEvent("menuDataUpdated", {
      detail: { timestamp: Date.now() },
    });
    window.dispatchEvent(event);
    localStorage.setItem(
      "homiebites_menu_update_trigger",
      Date.now().toString(),
    );
    setTimeout(() => {
      localStorage.removeItem("homiebites_menu_update_trigger");
    }, 100);
  }
};
