
import { FeatureItem } from './types';

// Admin features
export const adminFeatures: FeatureItem[] = [
  {
    name: "Admin Dashboard",
    description: "Comprehensive dashboard with overview of system metrics, user management, and content moderation tools",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "User Management",
    description: "View, edit, and manage all user accounts including changing user type and status",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "Establishment Management",
    description: "View, edit, approve, and manage all registered establishments",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "Mocktail Management",
    description: "Review, approve, and manage all mocktail recipes submitted across the platform",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "System Analytics",
    description: "Advanced analytics on user growth, engagement metrics, establishment participation, and platform usage",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "Content Moderation",
    description: "Review and moderate user-generated content including reviews, comments, and photos",
    status: "partial",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "Feature Toggle Management",
    description: "Enable/disable platform features and control rollout to specific user segments",
    status: "planned",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  },
  {
    name: "Promotion Management",
    description: "Create, edit, and manage global promotions and featured content",
    status: "partial",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: false
  }
];

// Establishment features
export const establishmentFeatures: FeatureItem[] = [
  {
    name: "Establishment Dashboard",
    description: "Dedicated dashboard showing key metrics, visitor statistics, and pending actions",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Menu Management",
    description: "Create, edit, and manage mocktail menu items with ingredients, prices, and photos",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Analytics",
    description: "View visitor statistics, popular drinks, revenue metrics, and customer retention data",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Profile Management",
    description: "Update establishment details, hours, photos, description, and contact information",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Promotion Creation",
    description: "Create and manage establishment-specific promotions and special offers",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Review Response",
    description: "View and respond to customer reviews of the establishment and its mocktails",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Swig Circuit Management",
    description: "Accept or decline inclusion in user-created bar crawls and manage visibility",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  },
  {
    name: "Mocktail Suggestions",
    description: "Receive AI-powered and trend-based suggestions for new mocktail creations",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: false
  }
];

// Individual user features
export const individualFeatures: FeatureItem[] = [
  {
    name: "Explore Mocktails",
    description: "Browse, search, and filter mocktails by ingredients, flavors, and establishments",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: true
  },
  {
    name: "Establishment Discovery",
    description: "Find nearby establishments with map view, filters, and search functionality",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: true
  },
  {
    name: "User Profile",
    description: "Manage personal profile, preferences, and account settings",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: true
  },
  {
    name: "Favorites Collection",
    description: "Save favorite mocktails and establishments for quick access",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: true
  },
  {
    name: "Rating & Reviews",
    description: "Rate and review mocktails and establishments with photos and comments",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: true
  },
  {
    name: "Swig Circuit Creation",
    description: "Create custom bar crawls selecting multiple establishments and drinks",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: true
  },
  {
    name: "Visit Tracking",
    description: "Track visited establishments and tried mocktails with personal notes",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: true
  },
  {
    name: "Reward Program",
    description: "Earn and redeem points for visiting establishments and trying new mocktails",
    status: "partial",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: true
  },
  {
    name: "Social Sharing",
    description: "Share favorite mocktails, establishments, and bar crawls on social media",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: true,
    individualAccess: true
  },
  {
    name: "Personal Recipe Creation",
    description: "Create and save personal mocktail recipes with ingredient lists and instructions",
    status: "implemented",
    adminAccess: true,
    establishmentAccess: false,
    individualAccess: true
  }
];
