
import { User, Session } from '@supabase/supabase-js';
import { UserType } from '@/types/navigation';

/**
 * Mock Data Service
 * Provides comprehensive mock data for development mode testing
 */

// Mock Users
export const MOCK_USERS = {
  individual: {
    id: 'mock-user-individual-001',
    email: 'individual@test.com',
    user_metadata: {
      user_type: 'individual',
      username: 'testuser',
      display_name: 'Test Individual User'
    }
  },
  establishment: {
    id: 'mock-user-establishment-001', 
    email: 'establishment@test.com',
    user_metadata: {
      user_type: 'establishment',
      username: 'testbar',
      display_name: 'Test Bar Owner'
    }
  },
  promoter: {
    id: 'mock-user-promoter-001',
    email: 'promoter@test.com', 
    user_metadata: {
      user_type: 'promoter',
      username: 'testpromoter',
      display_name: 'Test Event Promoter'
    }
  },
  admin: {
    id: 'mock-user-admin-001',
    email: 'admin@test.com',
    user_metadata: {
      user_type: 'admin',
      username: 'admin',
      display_name: 'System Administrator'
    }
  }
};

// Mock Establishments
export const MOCK_ESTABLISHMENTS = [
  {
    id: 'est-001',
    name: 'The Spiritless Lounge',
    address: '123 Main St, Downtown',
    latitude: 40.7589,
    longitude: -73.9851,
    cocktail_count: 15,
    image_url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400',
    phone: '+1-555-0123',
    website: 'https://spiritlesslounge.com',
    owner_id: 'mock-user-establishment-001',
    created_at: new Date().toISOString()
  },
  {
    id: 'est-002', 
    name: 'Mocktail Masters',
    address: '456 Oak Ave, Midtown',
    latitude: 40.7505,
    longitude: -73.9934,
    cocktail_count: 22,
    image_url: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400',
    phone: '+1-555-0124',
    website: 'https://mocktailmasters.com',
    owner_id: 'mock-user-establishment-002',
    created_at: new Date().toISOString()
  },
  {
    id: 'est-003',
    name: 'Zero Proof Bar',
    address: '789 Pine St, Uptown', 
    latitude: 40.7614,
    longitude: -73.9776,
    cocktail_count: 18,
    image_url: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400',
    phone: '+1-555-0125',
    website: 'https://zeroproofbar.com',
    owner_id: 'mock-user-establishment-003',
    created_at: new Date().toISOString()
  }
];

// Mock Cocktails
export const MOCK_COCKTAILS = [
  {
    id: 'cocktail-001',
    name: 'Virgin Mojito',
    description: 'Fresh mint, lime, and sparkling water',
    price: '$8.50',
    ingredients: ['Fresh mint', 'Lime juice', 'Simple syrup', 'Sparkling water'],
    establishment_id: 'est-001',
    image_url: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'cocktail-002',
    name: 'Elderflower Spritz',
    description: 'Elderflower syrup with citrus and bubbles',
    price: '$9.00',
    ingredients: ['Elderflower syrup', 'Lemon juice', 'Lime juice', 'Prosecco (non-alcoholic)'],
    establishment_id: 'est-001',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'cocktail-003',
    name: 'Cucumber Basil Smash',
    description: 'Refreshing cucumber with fresh basil',
    price: '$10.00',
    ingredients: ['Fresh cucumber', 'Basil leaves', 'Lime juice', 'Agave nectar'],
    establishment_id: 'est-002',
    image_url: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400',
    created_at: new Date().toISOString()
  }
];

// Mock Events
export const MOCK_EVENTS = [
  {
    id: 'event-001',
    name: 'Mocktail Mixology Workshop',
    description: 'Learn to craft amazing non-alcoholic cocktails',
    date: '2024-02-15',
    time: '19:00',
    venue_id: 'est-001',
    created_by: 'mock-user-promoter-001',
    status: 'published',
    capacity: 25,
    is_public: true,
    event_type: 'workshop',
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400',
    created_at: new Date().toISOString()
  },
  {
    id: 'event-002',
    name: 'Zero Proof Happy Hour',
    description: 'Special mocktail prices and live music',
    date: '2024-02-20',
    time: '17:00',
    venue_id: 'est-002',
    created_by: 'mock-user-promoter-001',
    status: 'published',
    capacity: 50,
    is_public: true,
    event_type: 'social',
    image_url: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400',
    created_at: new Date().toISOString()
  }
];

// Mock Swig Circuits
export const MOCK_SWIG_CIRCUITS = [
  {
    id: 'circuit-001',
    name: 'Downtown Mocktail Circuit',
    description: 'Explore the best mocktail spots in downtown',
    theme: 'Urban Exploration',
    start_date: '2024-02-25',
    end_date: '2024-02-25',
    user_id: 'mock-user-promoter-001',
    max_distance: 5,
    projected_attendance: 30,
    projected_revenue: 1500,
    image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    created_at: new Date().toISOString()
  }
];

// Mock Reviews
export const MOCK_REVIEWS = [
  {
    id: 'review-001',
    cocktail_id: 'cocktail-001',
    user_id: 'mock-user-individual-001',
    rating: 5,
    text: 'Absolutely refreshing! Perfect balance of mint and lime.',
    source: 'app',
    content_status: 'approved',
    created_at: new Date().toISOString()
  },
  {
    id: 'review-002',
    cocktail_id: 'cocktail-002',
    user_id: 'mock-user-individual-001',
    rating: 4,
    text: 'Love the elderflower flavor. Very sophisticated!',
    source: 'app',
    content_status: 'approved',
    created_at: new Date().toISOString()
  }
];

// Mock Profiles
export const MOCK_PROFILES = [
  {
    id: 'mock-user-individual-001',
    username: 'testuser',
    display_name: 'Test Individual User',
    user_type: 'individual',
    bio: 'Mocktail enthusiast and explorer',
    avatar_url: null,
    email_notifications: true,
    push_notifications: false,
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-user-establishment-001',
    username: 'testbar',
    display_name: 'Test Bar Owner',
    user_type: 'establishment',
    bio: 'Crafting amazing non-alcoholic experiences',
    avatar_url: null,
    email_notifications: true,
    push_notifications: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-user-promoter-001',
    username: 'testpromoter',
    display_name: 'Test Event Promoter',
    user_type: 'promoter',
    bio: 'Creating memorable mocktail events',
    avatar_url: null,
    email_notifications: true,
    push_notifications: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'mock-user-admin-001',
    username: 'admin',
    display_name: 'System Administrator',
    user_type: 'admin',
    bio: 'Managing the Spiritless platform',
    avatar_url: null,
    email_notifications: true,
    push_notifications: true,
    created_at: new Date().toISOString()
  }
];

/**
 * Mock Data Service Class
 * Provides methods to retrieve mock data based on user type and context
 */
export class MockDataService {
  /**
   * Get mock establishments for a user type
   */
  static getEstablishments(userType?: UserType, userId?: string) {
    if (userType === 'establishment' && userId) {
      return MOCK_ESTABLISHMENTS.filter(est => est.owner_id === userId);
    }
    return MOCK_ESTABLISHMENTS;
  }

  /**
   * Get mock cocktails for an establishment
   */
  static getCocktails(establishmentId?: string) {
    if (establishmentId) {
      return MOCK_COCKTAILS.filter(cocktail => cocktail.establishment_id === establishmentId);
    }
    return MOCK_COCKTAILS;
  }

  /**
   * Get mock events for a user type
   */
  static getEvents(userType?: UserType, userId?: string) {
    if (userType === 'promoter' && userId) {
      return MOCK_EVENTS.filter(event => event.created_by === userId);
    }
    return MOCK_EVENTS;
  }

  /**
   * Get mock swig circuits
   */
  static getSwigCircuits(userId?: string) {
    if (userId) {
      return MOCK_SWIG_CIRCUITS.filter(circuit => circuit.user_id === userId);
    }
    return MOCK_SWIG_CIRCUITS;
  }

  /**
   * Get mock profile for a user
   */
  static getProfile(userId: string) {
    return MOCK_PROFILES.find(profile => profile.id === userId) || MOCK_PROFILES[0];
  }

  /**
   * Get mock reviews for a cocktail
   */
  static getReviews(cocktailId?: string) {
    if (cocktailId) {
      return MOCK_REVIEWS.filter(review => review.cocktail_id === cocktailId);
    }
    return MOCK_REVIEWS;
  }

  /**
   * Generate mock analytics data
   */
  static getAnalytics(userType: UserType, userId: string) {
    switch (userType) {
      case 'establishment':
        return {
          totalVisitors: 245,
          uniqueVisitors: 198,
          returningVisitors: 47,
          averageRating: 4.2,
          totalRevenue: 3420.50,
          topCocktails: MOCK_COCKTAILS.slice(0, 3)
        };
      case 'promoter':
        return {
          totalEvents: 8,
          totalAttendees: 324,
          totalRevenue: 6540.00,
          averageAttendance: 40.5,
          upcomingEvents: MOCK_EVENTS
        };
      case 'admin':
        return {
          totalUsers: 1234,
          totalEstablishments: 89,
          totalEvents: 156,
          platformRevenue: 45600.00,
          activeUsers: 892
        };
      default:
        return {
          favoriteEstablishments: MOCK_ESTABLISHMENTS.slice(0, 2),
          recentReviews: MOCK_REVIEWS,
          upcomingEvents: MOCK_EVENTS.slice(0, 1)
        };
    }
  }

  /**
   * Generate mock notification data
   */
  static getNotifications(userId: string) {
    return [
      {
        id: 'notif-001',
        recipient_id: userId,
        title: 'New Event Added',
        content: 'Check out the Mocktail Mixology Workshop happening this weekend!',
        priority: 'medium',
        is_read: false,
        created_at: new Date().toISOString()
      },
      {
        id: 'notif-002',
        recipient_id: userId,
        title: 'Review Received',
        content: 'Someone left a great review for your Virgin Mojito!',
        priority: 'low',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  }

  /**
   * Check if we should use mock data
   */
  static shouldUseMockData(): boolean {
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || 
                       hostname === '127.0.0.1' ||
                       hostname.includes('preview--') ||
                       hostname.includes('lovable');
    
    const devModeActive = localStorage.getItem('dev_user_type') !== null;
    
    return isLocalhost && devModeActive;
  }

  /**
   * Get current dev user type
   */
  static getCurrentDevUserType(): UserType | null {
    return localStorage.getItem('dev_user_type') as UserType | null;
  }

  /**
   * Get current dev user ID
   */
  static getCurrentDevUserId(): string | null {
    const userType = this.getCurrentDevUserType();
    return userType ? MOCK_USERS[userType].id : null;
  }
}
