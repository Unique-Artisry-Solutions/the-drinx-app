
import { PageComponentsMap } from '../types';

export const componentCatalogData: PageComponentsMap = {
  '/': {
    pageName: 'Landing Page',
    description: 'The main landing page of the application that showcases Spiritless features.',
    components: [
      {
        name: 'Hero Section',
        description: 'Top-level components that introduce the site',
        components: [
          {
            id: 'landing-hero',
            name: 'Hero',
            description: 'Main hero section with background image and call-to-action buttons',
            type: 'section',
            filePath: 'src/components/landing/Hero.tsx',
            selectors: ['.bg-gradient-to-b', '.container', '.text-5xl'],
            preview: '/FireflyMasthead.jpg'
          },
          {
            id: 'landing-nav',
            name: 'Landing Navigation',
            description: 'Navigation header for the landing page',
            type: 'navigation',
            filePath: 'src/components/navigation/GuestTopNavigation.tsx',
            selectors: ['.flex', '.justify-between', '.items-center']
          }
        ]
      },
      {
        name: 'Content Sections',
        description: 'Main content sections of the landing page',
        components: [
          {
            id: 'landing-features',
            name: 'Features Section',
            description: 'Highlights key features with cards',
            type: 'section',
            filePath: 'src/components/landing/Features.tsx',
            selectors: ['.bg-white', '.container', '.grid']
          },
          {
            id: 'landing-feature-card',
            name: 'Feature Card',
            description: 'Individual feature card with icon, title, and description',
            type: 'element',
            filePath: 'src/components/landing/FeatureCard.tsx',
            selectors: ['.bg-white', '.p-6', '.rounded-xl']
          },
          {
            id: 'landing-key-features',
            name: 'Key Features',
            description: 'Bold highlight of main features with icons',
            type: 'section',
            filePath: 'src/components/landing/KeyFeatures.tsx',
            selectors: ['.py-20', '.container', '.grid'],
            preview: '/featuresBG.jpg'
          },
          {
            id: 'landing-benefits',
            name: 'Benefits Section',
            description: 'Section highlighting the benefits of using the platform',
            type: 'section',
            filePath: 'src/components/landing/Benefits.tsx',
            selectors: ['.py-24', '.bg-gradient-to-r', '.grid']
          },
          {
            id: 'landing-cta',
            name: 'Call To Action',
            description: 'Prominent call-to-action section with buttons',
            type: 'section',
            filePath: 'src/components/landing/CallToAction.tsx',
            selectors: ['.bg-spiritless-pink', '.container', '.flex']
          }
        ]
      },
      {
        name: 'Footer Components',
        description: 'Footer elements at the bottom of the page',
        components: [
          {
            id: 'landing-footer',
            name: 'Footer',
            description: 'Main footer with links and copyright',
            type: 'section',
            filePath: 'src/components/landing/Footer.tsx',
            selectors: ['.container', '.flex', '.grid']
          }
        ]
      }
    ]
  },
  '/explore': {
    pageName: 'Explore Page',
    description: 'Main content exploration page for users to discover cocktails and establishments.',
    components: [
      {
        name: 'Search Components',
        description: 'Components for searching and filtering content',
        components: [
          {
            id: 'explore-search',
            name: 'Search Input',
            description: 'Main search input with auto-suggestions',
            type: 'element',
            filePath: 'src/components/search/SearchInput.tsx',
            selectors: ['.relative', 'input[type="text"]', '.search-input']
          },
          {
            id: 'explore-filter',
            name: 'Filter Panel',
            description: 'Advanced filtering options for search results',
            type: 'element',
            filePath: 'src/components/search/FilterPanel.tsx',
            selectors: ['.filter-panel', '.filter-group']
          },
          {
            id: 'explore-suggestions',
            name: 'Search Suggestions',
            description: 'Dropdown with search suggestions',
            type: 'element',
            filePath: 'src/components/search/SearchSuggestions.tsx',
            selectors: ['.suggestions', '.suggestion-item']
          }
        ]
      },
      {
        name: 'Content Display',
        description: 'Components for displaying search results and content',
        components: [
          {
            id: 'cocktail-card',
            name: 'Cocktail Card',
            description: 'Card displaying cocktail details with image',
            type: 'element',
            filePath: 'src/components/CocktailCard.tsx',
            selectors: ['.cocktail-card', '.card-image', '.card-content']
          },
          {
            id: 'establishment-card',
            name: 'Establishment Card',
            description: 'Card displaying establishment details',
            type: 'element',
            filePath: 'src/components/EstablishmentCard.tsx',
            selectors: ['.establishment-card', '.establishment-image', '.establishment-details']
          }
        ]
      }
    ]
  },
  '/map': {
    pageName: 'Map Page',
    description: 'Interactive map for exploring establishments by location.',
    components: [
      {
        name: 'Map Components',
        description: 'Components for displaying and interacting with the map',
        components: [
          {
            id: 'map-view',
            name: 'Map View',
            description: 'Main map component with markers',
            type: 'section',
            filePath: 'src/components/map/MapView.tsx',
            selectors: ['.map-container', '.mapboxgl-map']
          },
          {
            id: 'map-controls',
            name: 'Map Controls',
            description: 'Controls for interacting with the map',
            type: 'element',
            filePath: 'src/components/map/MapControls.tsx',
            selectors: ['.map-controls', '.control-button']
          },
          {
            id: 'establishment-marker',
            name: 'Establishment Marker',
            description: 'Marker for establishments on the map',
            type: 'element',
            filePath: 'src/components/map/EstablishmentMarker.tsx',
            selectors: ['.marker', '.marker-icon']
          },
          {
            id: 'info-card',
            name: 'Establishment Info Card',
            description: 'Card displayed when clicking a marker',
            type: 'element',
            filePath: 'src/components/map/EstablishmentInfoCard.tsx',
            selectors: ['.info-card', '.establishment-name', '.establishment-details']
          }
        ]
      }
    ]
  },
  '/profile': {
    pageName: 'User Profile',
    description: 'User profile page with personal information and activity.',
    components: [
      {
        name: 'Profile Components',
        description: 'Components for displaying user profile information',
        components: [
          {
            id: 'profile-header',
            name: 'Profile Header',
            description: 'Header with user information and avatar',
            type: 'section',
            filePath: 'src/components/profile/ProfileHeader.tsx',
            selectors: ['.profile-header', '.avatar', '.user-info']
          },
          {
            id: 'profile-tabs',
            name: 'Profile Tabs',
            description: 'Tab navigation for different profile sections',
            type: 'navigation',
            filePath: 'src/components/profile/mobile/ProfileTabs.tsx',
            selectors: ['.tab-list', '.tab-trigger']
          },
          {
            id: 'active-circuit',
            name: 'Active Swig Circuit',
            description: 'Display of currently active swig circuit',
            type: 'section',
            filePath: 'src/components/profile/ActiveSwigCircuitSection.tsx',
            selectors: ['.active-circuit', '.circuit-details']
          }
        ]
      },
      {
        name: 'Content Tabs',
        description: 'Tab content components for profile sections',
        components: [
          {
            id: 'favorites-tab',
            name: 'Favorites Tab',
            description: 'Tab showing user favorite cocktails and establishments',
            type: 'section',
            filePath: 'src/components/profile/FavoritesTab.tsx',
            selectors: ['.favorites-tab', '.favorites-list']
          },
          {
            id: 'visited-tab',
            name: 'Visited Tab',
            description: 'Tab showing places the user has visited',
            type: 'section',
            filePath: 'src/components/profile/VisitedTab.tsx',
            selectors: ['.visited-tab', '.visited-list']
          },
          {
            id: 'swigcircuit-tab',
            name: 'Bar Crawl Tab',
            description: 'Tab showing user bar crawls',
            type: 'section',
            filePath: 'src/components/profile/SwigCircuitTab.tsx',
            selectors: ['.swigcircuit-tab', '.swigcircuit-list']
          }
        ]
      }
    ]
  },
  '/admin/dashboard': {
    pageName: 'Admin Dashboard',
    description: 'Main dashboard for the admin suite with overview and quick actions.',
    components: [
      {
        name: 'Header Components',
        description: 'Header elements including title, navigation and controls',
        components: [
          {
            id: 'admin-dashboard-header',
            name: 'Dashboard Header',
            description: 'The main header component for the admin dashboard page',
            type: 'section',
            filePath: 'src/components/admin/AdminHeader.tsx',
            selectors: ['.admin-dashboard-header', '.dashboard-title'],
            props: {
              title: 'Admin Dashboard'
            }
          },
          {
            id: 'admin-quick-actions',
            name: 'Quick Actions',
            description: 'Action buttons for common tasks in the admin dashboard',
            type: 'element',
            filePath: 'src/components/admin/AdminHeader.tsx',
            selectors: ['.quick-actions', '.admin-action-button']
          }
        ]
      },
      {
        name: 'Content Components',
        description: 'Main content section components',
        components: [
          {
            id: 'admin-stats-overview',
            name: 'Stats Overview',
            description: 'Overview of key statistics displayed on the admin dashboard',
            type: 'section',
            filePath: 'src/components/admin/AdminDashboard.tsx',
            selectors: ['.stats-overview', '.stat-card']
          },
          {
            id: 'admin-recent-activity',
            name: 'Recent Activity',
            description: 'List of recent activities in the system',
            type: 'section',
            filePath: 'src/components/admin/RecentActivity.tsx',
            selectors: ['.recent-activity', '.activity-item']
          }
        ]
      }
    ]
  },
  '/admin/users': {
    pageName: 'Admin Users',
    description: 'User management page for administrators.',
    components: [
      {
        name: 'User Management',
        description: 'Components for displaying and managing users',
        components: [
          {
            id: 'users-table',
            name: 'Users Table',
            description: 'Table displaying all users with search and filter options',
            type: 'section',
            filePath: 'src/components/admin/UsersTable.tsx',
            selectors: ['.users-table', '.user-row', '.user-details']
          },
          {
            id: 'user-filters',
            name: 'User Filters',
            description: 'Filter controls for the users list',
            type: 'element',
            filePath: 'src/components/admin/UsersFilters.tsx',
            selectors: ['.user-filters', '.filter-dropdown']
          }
        ]
      },
      {
        name: 'User Details',
        description: 'Components for displaying detailed user information',
        components: [
          {
            id: 'user-profile-card',
            name: 'User Profile Card',
            description: 'Card displaying user profile information',
            type: 'element',
            filePath: 'src/components/admin/UserProfileCard.tsx',
            selectors: ['.user-profile-card', '.user-avatar', '.user-info']
          },
          {
            id: 'user-activity-log',
            name: 'User Activity Log',
            description: 'Log of user activity in the system',
            type: 'section',
            filePath: 'src/components/admin/UserActivityLog.tsx',
            selectors: ['.activity-log', '.log-entry']
          }
        ]
      }
    ]
  },
  '/admin/system-breakdown': {
    pageName: 'System Breakdown',
    description: 'Detailed breakdown of system functionality and components.',
    components: [
      {
        name: 'System Overview Components',
        description: 'Components for displaying system overview information',
        components: [
          {
            id: 'system-header',
            name: 'System Header',
            description: 'Header with system analysis and export options',
            type: 'section',
            filePath: 'src/components/admin/systemBreakdown/SystemHeader.tsx',
            selectors: ['.system-header', '.analysis-btn', '.export-btn']
          },
          {
            id: 'status-notification',
            name: 'Status Update Notification',
            description: 'Notification for system status updates',
            type: 'element',
            filePath: 'src/components/admin/systemBreakdown/StatusUpdateNotification.tsx',
            selectors: ['.status-notification', '.update-count']
          }
        ]
      },
      {
        name: 'Feature Management',
        description: 'Components for displaying and managing system features',
        components: [
          {
            id: 'feature-tab',
            name: 'Feature Tab',
            description: 'Tab displaying feature information',
            type: 'section',
            filePath: 'src/components/admin/systemBreakdown/FeatureTab.tsx',
            selectors: ['.feature-tab', '.feature-description']
          },
          {
            id: 'features-table',
            name: 'Features Table',
            description: 'Table of system features with status information',
            type: 'section',
            filePath: 'src/components/admin/systemBreakdown/FeaturesTable.tsx',
            selectors: ['.features-table', '.feature-row']
          },
          {
            id: 'analysis-progress',
            name: 'Analysis Progress',
            description: 'Progress indicator for system analysis',
            type: 'element',
            filePath: 'src/components/admin/systemBreakdown/AnalysisProgress.tsx',
            selectors: ['.analysis-progress', '.progress-step']
          }
        ]
      }
    ]
  },
  '/admin/establishments': {
    pageName: 'Admin Establishments',
    description: 'Management interface for establishments in the system.',
    components: [
      {
        name: 'Establishment Management',
        description: 'Components for displaying and managing establishments',
        components: [
          {
            id: 'establishments-table',
            name: 'Establishments Table',
            description: 'Table displaying all establishments with search and filter options',
            type: 'section',
            filePath: 'src/components/admin/EstablishmentsTable.tsx',
            selectors: ['.establishments-table', '.establishment-row']
          },
          {
            id: 'establishment-filters',
            name: 'Establishment Filters',
            description: 'Filter controls for the establishments list',
            type: 'element',
            filePath: 'src/components/admin/EstablishmentFilters.tsx',
            selectors: ['.establishment-filters', '.filter-dropdown']
          }
        ]
      }
    ]
  },
  '/auth': {
    pageName: 'Authentication',
    description: 'Sign-up and login pages.',
    components: [
      {
        name: 'Authentication Forms',
        description: 'Forms for user authentication',
        components: [
          {
            id: 'login-form',
            name: 'Login Form',
            description: 'Form for user login',
            type: 'section',
            filePath: 'src/components/auth/LoginForm.tsx',
            selectors: ['.login-form', '.form-field']
          },
          {
            id: 'signup-form',
            name: 'Signup Form',
            description: 'Form for new user registration',
            type: 'section',
            filePath: 'src/components/auth/SignupForm.tsx',
            selectors: ['.signup-form', '.form-field']
          },
          {
            id: 'auth-header',
            name: 'Auth Header',
            description: 'Header for authentication pages',
            type: 'section',
            filePath: 'src/components/auth/UserAuthHeader.tsx',
            selectors: ['.auth-header']
          }
        ]
      }
    ]
  }
};
