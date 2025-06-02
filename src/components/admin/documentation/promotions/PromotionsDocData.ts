
import { DocSection, PromotionDoc, PromotionTypeDoc } from '../types';

export const promotionsDocData: DocSection = {
  id: "promotions",
  title: "Promotion Management",
  description: "Create and manage promotions, discounts, and special offers for your establishments",
  category: "promotions",
  features: [
    {
      id: "promotion-creation",
      title: "Promotion Creation",
      description: "Create and configure various types of promotions with flexible options",
      category: "promotions",
      status: "implemented",
      path: "/establishment/promotions",
      steps: [
        {
          title: "Access Promotions Page",
          description: "Navigate to the Promotions section in your establishment dashboard"
        },
        {
          title: "Create New Promotion",
          description: "Click the 'Create New Promotion' button and fill in the details"
        },
        {
          title: "Set Promotion Type",
          description: "Choose from percentage discount, fixed amount, or free item"
        },
        {
          title: "Configure Validity Period",
          description: "Set start and end dates for the promotion"
        },
        {
          title: "Add Restrictions",
          description: "Optionally set minimum purchase, maximum discount, or usage limits"
        },
        {
          title: "Activate Promotion",
          description: "Toggle the promotion active status and save changes"
        }
      ],
      quickTips: [
        "Use short, memorable promotion codes for better customer recall",
        "Limited-time offers create urgency and drive quicker conversions",
        "Test different discount levels to find the optimal balance between conversion and profit margin",
        "Promote your offers across all communication channels including social media and email"
      ],
      bestPractices: [
        "Align promotions with your business goals and target audience",
        "Set clear terms and conditions to avoid customer confusion",
        "Schedule promotions during slower periods to boost traffic",
        "Track and analyze promotion performance to refine future strategies"
      ],
      troubleshooting: [
        {
          problem: "Promotion not appearing for customers",
          solution: "Check that the promotion is marked as active and the start date has passed"
        },
        {
          problem: "Discount not applying correctly",
          solution: "Verify the promotion settings, especially discount type and value"
        },
        {
          problem: "Promotion being overused",
          solution: "Set usage limits or customer-specific restrictions to prevent abuse"
        }
      ],
      promotionTypes: [
        {
          id: "percentage-discount",
          name: "Percentage Discount",
          description: "Reduces the price by a percentage of the original price",
          example: "20% off all mocktails during happy hour",
          bestFor: ["Driving higher average order values", "Seasonal promotions", "New customer acquisition"]
        },
        {
          id: "fixed-amount",
          name: "Fixed Amount Discount",
          description: "Reduces the price by a specific dollar amount",
          example: "$5 off your purchase of $25 or more",
          bestFor: ["Clear value communication", "Gift with purchase promotions", "Minimum order value incentives"]
        },
        {
          id: "free-item",
          name: "Free Item",
          description: "Offers a complimentary item with qualifying purchase",
          example: "Free mocktail with any food purchase",
          bestFor: ["Product sampling", "Introducing new menu items", "Building customer loyalty"]
        }
      ],
      strategies: [
        {
          name: "Happy Hour Promotions",
          description: "Time-limited discounts during typically slower business hours",
          implementation: "Set specific hours for the promotion, create percentage-based discounts, limit to specific days of the week, promote through social media channels",
          metrics: ["Traffic increase during promotion hours", "Revenue comparison to non-promotion periods", "Customer retention rate"]
        },
        {
          name: "Loyalty Rewards",
          description: "Special promotions for repeat customers",
          implementation: "Create customer-specific promotion codes, set up progressive rewards based on visit frequency, implement tiered discount structure, send personalized notifications",
          metrics: ["Repeat visit frequency", "Customer lifetime value", "Promotion redemption rate"]
        },
        {
          name: "Seasonal Campaigns",
          description: "Promotions tied to holidays, events, or seasons",
          implementation: "Schedule promotions to align with seasonal events, create themed discount packages, use limited-time language to drive urgency, refresh creative assets to match the theme",
          metrics: ["Year-over-year seasonal comparison", "Social media engagement", "New vs. returning customer ratio"]
        }
      ],
      integrations: [
        "Customer loyalty program integration",
        "Email marketing platform for promotion announcements",
        "Social media sharing capabilities",
        "Analytics dashboard for performance tracking"
      ],
      securityMeasures: [
        "Unique, single-use promotion codes to prevent fraud",
        "IP-based abuse detection",
        "Usage limits per customer",
        "Automatic deactivation after expiration date",
        "Audit trail of promotion redemptions"
      ],
      analyticsCapabilities: [
        "Real-time redemption tracking",
        "Customer segment performance analysis",
        "Revenue impact assessment",
        "A/B testing of different promotion strategies",
        "ROI calculation based on customer acquisition cost"
      ]
    } as PromotionDoc,
    // Rest of features as regular DocFeatures (not PromotionDocs)
    {
      id: "promotion-management",
      title: "Promotion Management",
      description: "Edit, update, and track existing promotions",
      category: "promotions",
      status: "implemented",
      steps: [
        {
          title: "View All Promotions",
          description: "Access the promotions list to see all active and inactive offers"
        },
        {
          title: "Edit Promotion Details",
          description: "Click on a promotion to modify its settings or parameters"
        },
        {
          title: "Toggle Promotion Status",
          description: "Activate or deactivate promotions as needed"
        },
        {
          title: "Extend or Shorten Duration",
          description: "Modify the end date to adjust promotion length"
        },
        {
          title: "Update Usage Limits",
          description: "Change the maximum number of redemptions allowed"
        }
      ],
      quickTips: [
        "Regularly review promotion performance and adjust as needed",
        "Deactivate underperforming promotions to focus on successful ones",
        "Create variations of successful promotions for different customer segments",
        "Use A/B testing to compare different promotion strategies"
      ],
      bestPractices: [
        "Maintain a calendar of planned promotions to avoid conflicts",
        "Review promotion performance weekly to make data-driven decisions",
        "Archive rather than delete old promotions to preserve performance data",
        "Document successful promotion strategies for future reference"
      ]
    },
    {
      id: "promotion-analytics",
      title: "Promotion Analytics",
      description: "Track and analyze the performance of promotions",
      category: "promotions",
      status: "implemented",
      steps: [
        {
          title: "Access Analytics Dashboard",
          description: "Navigate to the analytics section of your promotion management area"
        },
        {
          title: "Select Date Range",
          description: "Choose the time period for your analysis"
        },
        {
          title: "View Key Metrics",
          description: "Review redemption count, revenue impact, and customer acquisition data"
        },
        {
          title: "Compare Promotions",
          description: "Analyze performance across different promotion types or time periods"
        },
        {
          title: "Export Reports",
          description: "Download data for further analysis or presentation"
        }
      ],
      quickTips: [
        "Focus on customer acquisition cost and lifetime value metrics",
        "Track both immediate revenue impact and long-term customer retention",
        "Analyze promotion performance by customer segment",
        "Use cohort analysis to understand long-term effects of promotions"
      ],
      bestPractices: [
        "Establish baseline metrics before launching promotions",
        "Set clear KPIs for each promotion campaign",
        "Use attribution modeling to understand promotion effectiveness",
        "Combine promotion data with other business metrics for context"
      ]
    },
    {
      id: "promotion-security",
      title: "Promotion Security",
      description: "Implement security measures to prevent promotion abuse",
      category: "promotions",
      status: "implemented",
      steps: [
        {
          title: "Set Usage Limits",
          description: "Configure maximum redemptions per promotion or per customer"
        },
        {
          title: "Implement Verification",
          description: "Use verification methods like one-time codes or customer authentication"
        },
        {
          title: "Monitor Usage Patterns",
          description: "Track promotion usage for suspicious activities"
        },
        {
          title: "Configure Fraud Alerts",
          description: "Set up notifications for potential promotion abuse"
        }
      ],
      bestPractices: [
        "Use single-use promotion codes when possible",
        "Implement IP-based restrictions for digital promotions",
        "Require account authentication for high-value promotions",
        "Create an audit trail of all promotion redemptions"
      ],
      troubleshooting: [
        {
          problem: "Suspected promotion code sharing",
          solution: "Implement unique, single-use codes tied to customer accounts"
        },
        {
          problem: "Excessive redemptions from single source",
          solution: "Add IP-based restrictions and usage limits"
        },
        {
          problem: "Expired promotions still being redeemed",
          solution: "Verify system date handling and automatic deactivation"
        }
      ]
    },
    {
      id: "promotion-notifications",
      title: "Promotion Notifications",
      description: "Automated alerts for promotion status and performance",
      category: "promotions",
      status: "implemented",
      steps: [
        {
          title: "Configure Notification Settings",
          description: "Select which events should trigger notifications"
        },
        {
          title: "Set Up Expiration Alerts",
          description: "Get notified before promotions expire"
        },
        {
          title: "Usage Limit Warnings",
          description: "Receive alerts when promotions approach usage limits"
        },
        {
          title: "Performance Notifications",
          description: "Get insights on high or underperforming promotions"
        }
      ],
      quickTips: [
        "Use notifications to plan timely follow-up promotions",
        "Set threshold-based alerts for unusual promotion activity",
        "Configure digest reports for regular promotion status updates",
        "Enable mobile notifications for time-sensitive promotion issues"
      ]
    }
  ]
};
