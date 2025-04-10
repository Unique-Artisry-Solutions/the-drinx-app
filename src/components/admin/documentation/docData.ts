
import { DocFeature, DocSection } from './types';
import { adminFeatures, establishmentFeatures, individualFeatures } from '@/components/admin/systemBreakdown/features';

// Helper function to convert system breakdown features to doc features
const convertSystemFeatureToDocFeature = (feature: any, category: string): DocFeature => {
  return {
    id: feature.id,
    title: feature.name,
    description: feature.description,
    category,
    status: feature.status,
    steps: feature.testSteps ? feature.testSteps.map((step: string) => ({
      title: step,
      description: ''
    })) : [],
    quickTips: [],
    bestPractices: []
  };
};

// Create features from system breakdown data
const adminDocFeatures: DocFeature[] = adminFeatures.map(feature => 
  convertSystemFeatureToDocFeature(feature, 'admin')
);

const establishmentDocFeatures: DocFeature[] = establishmentFeatures.map(feature => 
  convertSystemFeatureToDocFeature(feature, 'establishment')
);

const individualDocFeatures: DocFeature[] = individualFeatures.map(feature => 
  convertSystemFeatureToDocFeature(feature, 'user')
);

// Additional detailed documentation features
const userManagementFeatures: DocFeature[] = [
  {
    id: "user-management-detail",
    title: "User Management",
    description: "Comprehensive guide to managing users in the admin panel",
    category: "users",
    status: "implemented",
    steps: [
      {
        title: "Navigate to Users Section",
        description: "Click on the 'Users' item in the main navigation menu to access the user management area."
      },
      {
        title: "View User List",
        description: "The main user screen displays all registered users with key information such as email, registration date, and status."
      },
      {
        title: "Search and Filter",
        description: "Use the search bar at the top to find specific users by name, email, or ID. Apply filters to narrow down results."
      },
      {
        title: "View User Details",
        description: "Click on a user row to access their detailed profile with all information and activity history."
      },
      {
        title: "Edit User Information",
        description: "From the user detail view, click 'Edit' to modify user information including profile details, permissions, and settings."
      },
      {
        title: "Manage Permissions",
        description: "Assign or revoke specific permissions from the Permissions tab in the user detail view."
      }
    ],
    quickTips: [
      "Use batch actions to manage multiple users simultaneously",
      "Export user data to CSV for offline analysis",
      "Check the activity log to review recent user actions"
    ],
    troubleshooting: [
      {
        problem: "Unable to save user changes",
        solution: "Ensure you have administrative privileges and that all required fields are completed properly."
      },
      {
        problem: "User unable to access features after permission changes",
        solution: "Remember that some permission changes require the user to log out and log back in to take effect."
      }
    ]
  },
  {
    id: "role-management",
    title: "Role Management",
    description: "Create and manage user roles with predefined permission sets",
    category: "users",
    status: "implemented",
    steps: [
      {
        title: "Access Role Management",
        description: "Navigate to Users > Roles in the admin panel."
      },
      {
        title: "Create New Role",
        description: "Click the 'Add Role' button to create a new role with custom permissions."
      },
      {
        title: "Configure Permissions",
        description: "Select the specific permissions this role should have access to."
      },
      {
        title: "Assign Users to Role",
        description: "Navigate to a user's profile and assign them the newly created role."
      }
    ]
  }
];

const analyticsFeatures: DocFeature[] = [
  {
    id: "analytics-dashboard",
    title: "Analytics Dashboard",
    description: "Learn how to use the analytics dashboard to track key metrics and user engagement",
    category: "analytics",
    status: "implemented",
    steps: [
      {
        title: "Access Analytics",
        description: "Navigate to the Analytics section from the main admin menu."
      },
      {
        title: "View Key Metrics",
        description: "The dashboard displays key metrics including user registrations, active users, and content engagement."
      },
      {
        title: "Adjust Date Range",
        description: "Use the date picker at the top to select the time period for the displayed metrics."
      },
      {
        title: "Export Reports",
        description: "Click the Export button to download analytics data in CSV or PDF format."
      }
    ],
    bestPractices: [
      "Review analytics weekly to identify trends",
      "Compare current metrics to previous periods to track growth",
      "Set up automated reports to be delivered via email"
    ]
  }
];

const contentManagementFeatures: DocFeature[] = [
  {
    id: "content-moderation",
    title: "Content Moderation",
    description: "Tools and workflows for moderating user-generated content",
    category: "content",
    status: "implemented",
    steps: [
      {
        title: "Access Moderation Queue",
        description: "Navigate to Content > Moderation to view items flagged for review."
      },
      {
        title: "Review Flagged Content",
        description: "Click on any item to view details and the reason it was flagged."
      },
      {
        title: "Make Moderation Decision",
        description: "Choose to approve, reject, or request changes to the content."
      },
      {
        title: "Send Feedback",
        description: "Optionally provide feedback to the content creator about your decision."
      }
    ],
    troubleshooting: [
      {
        problem: "Large backlog of items to moderate",
        solution: "Use batch moderation tools for similar content types and implement automated filtering rules."
      }
    ]
  },
  {
    id: "photo-moderation",
    title: "Photo Moderation",
    description: "Process for reviewing and approving user-uploaded images",
    category: "content",
    status: "implemented",
    path: "/admin/photo-moderation",
    steps: [
      {
        title: "Access Photo Moderation",
        description: "Navigate to Content > Photos to view the image moderation queue."
      },
      {
        title: "Review Images",
        description: "Click on thumbnails to view full-size images for detailed review."
      },
      {
        title: "Apply Filters",
        description: "Use content filters to focus on specific types of images or sources."
      },
      {
        title: "Make Decisions",
        description: "Approve or reject images based on community guidelines."
      }
    ]
  }
];

const systemSettingsFeatures: DocFeature[] = [
  {
    id: "system-configuration",
    title: "System Configuration",
    description: "Configure global system settings and parameters",
    category: "settings",
    status: "implemented",
    steps: [
      {
        title: "Access System Settings",
        description: "Navigate to Settings > System Configuration in the admin menu."
      },
      {
        title: "Modify Settings",
        description: "Adjust parameters by category including general, security, and performance settings."
      },
      {
        title: "Save Changes",
        description: "Click 'Save Changes' to apply new settings. Some changes may require system restart."
      }
    ],
    quickTips: [
      "Use the search function to quickly find specific settings",
      "Hover over the information icon next to settings for detailed explanations",
      "The system maintains a history of setting changes for auditing purposes"
    ]
  },
  {
    id: "theme-customization",
    title: "Theme Customization",
    description: "Customize the appearance and branding of the application",
    category: "settings",
    status: "implemented",
    path: "/admin/theme-customization",
    steps: [
      {
        title: "Access Theme Settings",
        description: "Navigate to Settings > Theme Customization."
      },
      {
        title: "Select Color Scheme",
        description: "Choose primary and secondary colors that align with your brand."
      },
      {
        title: "Upload Logo",
        description: "Add your company logo in both light and dark variants."
      },
      {
        title: "Customize Typography",
        description: "Select font families and sizes for headings and body text."
      },
      {
        title: "Preview Changes",
        description: "Use the live preview to see how changes will appear before saving."
      }
    ]
  }
];

const systemBreakdownFeatures: DocFeature[] = [
  {
    id: "system-breakdown",
    title: "System Functionality Breakdown",
    description: "Comprehensive overview of all system features and their implementation status",
    category: "tools",
    status: "implemented",
    path: "/admin/system-breakdown",
    steps: [
      {
        title: "Access System Breakdown",
        description: "Navigate to Admin > System Breakdown in the main navigation."
      },
      {
        title: "View Feature Categories",
        description: "Browse through the tabs to see different feature categories: Admin, Establishment, and Individual features."
      },
      {
        title: "Check Implementation Status",
        description: "Each feature shows its current implementation status and database requirements."
      },
      {
        title: "View Feature Details",
        description: "Click on a feature to see detailed implementation information and test steps."
      },
      {
        title: "Export Feature Data",
        description: "Use the Export button to download a CSV file of all features and their status."
      }
    ],
    quickTips: [
      "Use the system breakdown page to track development progress",
      "Check the database status column to identify features that need database work",
      "Review the proposed improvements tab for upcoming feature enhancements"
    ],
    faq: [
      {
        question: "How often is the system breakdown updated?",
        answer: "The system breakdown is updated automatically whenever new features are implemented or existing ones are modified."
      },
      {
        question: "Can I suggest new features through this interface?",
        answer: "Yes, use the Proposed Improvements tab to review and suggest new feature ideas for future development."
      }
    ]
  }
];

export const featureSections: DocSection[] = [
  {
    id: "user-management",
    title: "User Management",
    description: "Managing users, roles, and permissions",
    category: "users",
    features: userManagementFeatures
  },
  {
    id: "analytics",
    title: "Analytics & Reporting",
    description: "Track metrics and generate insights",
    category: "analytics",
    features: analyticsFeatures
  },
  {
    id: "content-management",
    title: "Content Management",
    description: "Tools for managing and moderating user content",
    category: "content",
    features: contentManagementFeatures
  },
  {
    id: "system-settings",
    title: "System Settings",
    description: "Configure global parameters and appearance",
    category: "settings",
    features: systemSettingsFeatures
  },
  {
    id: "admin-features",
    title: "Admin Features",
    description: "Core administrative functionality",
    category: "overview",
    features: adminDocFeatures
  },
  {
    id: "establishment-features",
    title: "Establishment Features",
    description: "Features for venue and business management",
    category: "overview",
    features: establishmentDocFeatures
  },
  {
    id: "individual-features",
    title: "User Features",
    description: "Features available to regular users",
    category: "overview",
    features: individualDocFeatures
  },
  {
    id: "system-tools",
    title: "System Tools",
    description: "Advanced tools for system management",
    category: "tools",
    features: systemBreakdownFeatures
  }
];

// Helper function to find a feature by ID
export function getFeatureById(id: string): DocFeature | undefined {
  for (const section of featureSections) {
    const feature = section.features.find(f => f.id === id);
    if (feature) return feature;
  }
  return undefined;
}

// Helper function to get all features
export function getAllFeatures(): DocFeature[] {
  return featureSections.flatMap(section => section.features);
}
