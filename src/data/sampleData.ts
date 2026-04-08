
// Sample data for development purposes

// Sample establishments with locations within 10 miles of user's default location
export const sampleEstablishments = [
  {
    id: "e1a9f2b0-1d3c-4e5f-6a7b-8c9d0e1f2a3b",
    name: "The Mocktail Lounge",
    address: "123 Main St, Anytown, USA",
    distance: "0.5 miles",
    cocktailCount: 8,
    image: "https://images.unsplash.com/photo-1567696911980-2eed69a46042?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 123-4567",
    website: "https://example.com",
    hours: [
      "Mon-Thu: 4pm - 12am",
      "Fri-Sat: 4pm - 2am",
      "Sun: 4pm - 10pm"
    ],
    latitude: 40.7128,
    longitude: -74.006
  },
  {
    id: "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
    name: "Sober Bar & Kitchen",
    address: "456 Oak Ave, Somewhere, USA",
    distance: "1.2 miles",
    cocktailCount: 12,
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 987-6543",
    website: "https://example.com",
    hours: [
      "Mon-Thu: 11am - 11pm",
      "Fri-Sat: 11am - 1am",
      "Sun: 11am - 10pm"
    ],
    latitude: 40.7282,
    longitude: -73.994
  },
  {
    id: "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e",
    name: "Zero Proof",
    address: "789 Pine St, Elsewhere, USA",
    distance: "2.4 miles",
    cocktailCount: 6,
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 246-8101",
    website: "https://example.com",
    hours: [
      "Tue-Thu: 5pm - 11pm",
      "Fri-Sat: 5pm - 12am",
      "Sun-Mon: Closed"
    ],
    latitude: 40.7112,
    longitude: -74.013
  },
  {
    id: "c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f",
    name: "Spiritless Social",
    address: "101 Elm St, Nowhere, USA",
    distance: "3.0 miles",
    cocktailCount: 10,
    image: "https://images.unsplash.com/photo-1616902348073-98abb8f595e3?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 369-2578",
    website: "https://example.com",
    hours: [
      "Mon-Fri: 3pm - 12am",
      "Sat-Sun: 12pm - 2am"
    ],
    latitude: 40.7220,
    longitude: -73.989
  },
  {
    id: "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
    name: "Mindful Mixology",
    address: "202 Maple Dr, Anywhere, USA",
    distance: "3.6 miles",
    cocktailCount: 15,
    image: "https://images.unsplash.com/photo-1600456899121-68eda5705257?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 741-9630",
    website: "https://example.com",
    hours: [
      "Mon-Sun: 12pm - 10pm"
    ],
    latitude: 40.7180,
    longitude: -74.001
  },
  {
    id: "e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b",
    name: "Alcohol-Free Atelier",
    address: "303 Broadway St, Somewhere, USA",
    distance: "5.2 miles",
    cocktailCount: 7,
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 852-9631",
    website: "https://example.com",
    hours: [
      "Wed-Sun: 4pm - 11pm",
      "Mon-Tue: Closed"
    ],
    latitude: 40.7510,
    longitude: -74.0037
  },
  {
    id: "f7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c",
    name: "Zero Proof Palace",
    address: "404 River Rd, Elsewhere, USA",
    distance: "6.8 miles",
    cocktailCount: 14,
    image: "https://images.unsplash.com/photo-1638957773782-f9614cf5fb5d?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 369-7412",
    website: "https://example.com",
    hours: [
      "Mon-Thu: 5pm - 12am",
      "Fri-Sat: 5pm - 2am",
      "Sun: 5pm - 10pm"
    ],
    latitude: 40.6640,
    longitude: -74.0013
  },
  {
    id: "a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d",
    name: "Teetotalers Tavern",
    address: "505 Beach Ave, Nowhere, USA",
    distance: "8.3 miles",
    cocktailCount: 9,
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 963-8512",
    website: "https://example.com",
    hours: [
      "Mon-Fri: 4pm - 1am",
      "Sat-Sun: 12pm - 1am"
    ],
    latitude: 40.8123,
    longitude: -73.9520
  },
  {
    id: "b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e",
    name: "Sober Spirits",
    address: "606 Highland Ave, Anywhere, USA",
    distance: "9.1 miles",
    cocktailCount: 11,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 741-2469",
    website: "https://example.com",
    hours: [
      "Tue-Sat: 6pm - 12am",
      "Sun-Mon: Closed"
    ],
    latitude: 40.8212,
    longitude: -73.9440
  },
  {
    id: "c0d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f",
    name: "Mocktail Mansion",
    address: "707 Valley Rd, Somewhere, USA",
    distance: "9.9 miles",
    cocktailCount: 13,
    image: "https://images.unsplash.com/photo-1587888637140-849b25d80ef9?auto=format&fit=crop&q=80&w=1000",
    phone: "(555) 123-9874",
    website: "https://example.com",
    hours: [
      "Mon: Closed",
      "Tue-Thu: 4pm - 11pm",
      "Fri-Sun: 12pm - 12am"
    ],
    latitude: 40.6520,
    longitude: -73.9371
  }
];

// Sample cocktails
export const sampleCocktails = [
  {
    id: "f1e2d3c4-b5a6-7890-1234-567890abcdef",
    name: "Garden Spritz",
    price: "$12",
    description: "A refreshing blend of cucumber, mint, lime, and sparkling water with a hint of elderflower.",
    ingredients: ["Cucumber", "Mint", "Lime", "Elderflower Syrup", "Sparkling Water"],
    image: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "e1a9f2b0-1d3c-4e5f-6a7b-8c9d0e1f2a3b",
      name: "The Mocktail Lounge",
      distance: "0.5 miles"
    }
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    name: "Berry Bliss",
    price: "$14",
    description: "Mixed berries muddled with basil and lemon, topped with ginger beer and a splash of cranberry juice.",
    ingredients: ["Mixed Berries", "Basil", "Lemon", "Ginger Beer", "Cranberry Juice"],
    image: "https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "e1a9f2b0-1d3c-4e5f-6a7b-8c9d0e1f2a3b",
      name: "The Mocktail Lounge",
      distance: "0.5 miles"
    }
  },
  {
    id: "b2c3d4e5-f6a7-8901-2345-67890abcdef1",
    name: "Spiced Hibiscus Sour",
    price: "$13",
    description: "Tangy hibiscus tea infused with cinnamon and star anise, mixed with fresh lemon juice and maple syrup.",
    ingredients: ["Hibiscus Tea", "Lemon Juice", "Maple Syrup", "Cinnamon", "Star Anise", "Egg White Alternative"],
    image: "https://images.unsplash.com/photo-1638957773782-f9614cf5fb5d?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
      name: "Sober Bar & Kitchen",
      distance: "1.2 miles"
    }
  },
  {
    id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12",
    name: "Smoky Pineapple",
    price: "$15",
    description: "Grilled pineapple juice with smoked rosemary, lime, and chili-infused honey for a complex, smoky-sweet flavor.",
    ingredients: ["Grilled Pineapple", "Smoked Rosemary", "Lime", "Chili-infused Honey", "Tonic Water"],
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
      name: "Sober Bar & Kitchen",
      distance: "1.2 miles"
    }
  },
  {
    id: "d4e5f6a7-b8c9-0123-4567-890abcdef123",
    name: "Cardamom Coffee Fizz",
    price: "$13",
    description: "Cold brew coffee shaken with cardamom syrup and orange bitters, topped with tonic water and an orange twist.",
    ingredients: ["Cold Brew Coffee", "Cardamom Syrup", "Orange Bitters", "Tonic Water", "Orange Twist"],
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e",
      name: "Zero Proof",
      distance: "2.4 miles"
    }
  },
  {
    id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234",
    name: "Lemongrass Thai Cooler",
    price: "$14",
    description: "Fresh lemongrass, ginger, lime, and coconut water with a touch of Thai basil, served over ice.",
    ingredients: ["Lemongrass", "Ginger", "Lime", "Coconut Water", "Thai Basil"],
    image: "https://images.unsplash.com/photo-1587888637140-849b25d80ef9?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e",
      name: "Zero Proof",
      distance: "2.4 miles"
    }
  },
  {
    id: "f6a7b8c9-d0e1-2345-6789-0abcdef12345",
    name: "Vanilla Fig Fizz",
    price: "$16",
    description: "Fig purée with vanilla bean, lemon, and a dash of cinnamon, topped with sparkling water and a fresh fig garnish.",
    ingredients: ["Fig Purée", "Vanilla Bean", "Lemon", "Cinnamon", "Sparkling Water"],
    image: "https://images.unsplash.com/photo-1560508179-b2c9a3f8e92b?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f",
      name: "Spiritless Social",
      distance: "3.0 miles"
    }
  },
  {
    id: "a7b8c9d0-e1f2-3456-7890-abcdef123456",
    name: "Rosemary Peach Refresher",
    price: "$13",
    description: "Juicy peaches muddled with fresh rosemary, lemon juice, and honey, topped with ginger ale.",
    ingredients: ["Peaches", "Rosemary", "Lemon Juice", "Honey", "Ginger Ale"],
    image: "https://images.unsplash.com/photo-1616097970275-1e187b4ce59f?auto=format&fit=crop&q=80&w=1000",
    establishment: {
      id: "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
      name: "Mindful Mixology",
      distance: "3.6 miles"
    }
  }
];

// Map legacy numeric IDs to new UUIDs for backwards compatibility
export const legacyIdMap = {
  "1": "e1a9f2b0-1d3c-4e5f-6a7b-8c9d0e1f2a3b",
  "2": "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d",
  "3": "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e",
  "4": "c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f",
  "5": "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a",
  "6": "e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b",
  "7": "f7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c",
  "8": "a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d",
  "9": "b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e",
  "10": "c0d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f"
};

export const sampleSwigCircuits = [
  {
    id: "d1e2f3a4-b5c6-7d8e-9f0a-1b2c3d4e5f6a",
    name: "Downtown Mocktail Tour",
    stops: 4,
    description: "Explore the best downtown locations for spirit-free options",
    establishments: ["e1a9f2b0-1d3c-4e5f-6a7b-8c9d0e1f2a3b", "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d", "b3c4d5e6-f7a8-9b0c-1d2e-3f4a5b6c7d8e", "c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f"],
    organizer: "John Doe",
    distance: "2.5 mi",
    date: "2023-06-15"
  },
  {
    id: "e2f3a4b5-c6d7-8e9f-0a1b-2c3d4e5f6a7b",
    name: "Uptown Refreshment Walk",
    stops: 3,
    description: "A leisurely stroll through uptown's best mocktail spots",
    establishments: ["d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a", "e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b", "f7a8b9c0-d1e2-3f4a-5b6c-7d8e9f0a1b2c"],
    organizer: "Jane Smith",
    distance: "1.8 mi",
    date: "2023-07-22"
  },
  {
    id: "f3a4b5c6-d7e8-9f0a-1b2c-3d4e5f6a7b8c",
    name: "Harbor Breeze Crawl",
    stops: 5,
    description: "Seaside venues with amazing alcohol-free options",
    establishments: ["a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d", "b9c0d1e2-f3a4-5b6c-7d8e-9f0a1b2c3d4e", "c0d1e2f3-a4b5-6c7d-8e9f-0a1b2c3d4e5f", "e1a9f2b0-1d3c-4e5f-6a7b-8c9d0e1f2a3b", "a2b3c4d5-e6f7-8a9b-0c1d-2e3f4a5b6c7d"],
    organizer: "Sam Wilson",
    distance: "3.2 mi",
    date: "2023-08-10"
  },
  {
    id: "a4b5c6d7-e8f9-0a1b-2c3d-4e5f6a7b8c9d",
    name: "Arts District Crawl",
    stops: 3,
    description: "Unique mocktails at creative establishments",
    establishments: ["c4d5e6f7-a8b9-0c1d-2e3f-4a5b6c7d8e9f", "d5e6f7a8-b9c0-1d2e-3f4a-5b6c7d8e9f0a", "e6f7a8b9-c0d1-2e3f-4a5b-6c7d8e9f0a1b"],
    organizer: "Alex Johnson",
    distance: "1.5 mi",
    date: "2023-09-05"
  }
];
