
import { ImprovementItem } from './types';

export const improvementsData: ImprovementItem[] = [
  {
    id: "imp-1",
    title: "AI-Powered Mocktail Recommendations",
    description: "Implement an AI system that suggests personalized mocktail recommendations based on user preferences and past ordering history.",
    impact: "high",
    effort: "high",
    status: "proposed",
    category: "User Experience",
    votes: 48,
    submittedBy: "Sarah Johnson",
    submittedDate: "2023-06-15",
    type: "new-feature",
    implementationSteps: [
      "Create AI recommendation model",
      "Integrate user preference tracking",
      "Design recommendation UI",
      "Implement feedback mechanism"
    ],
    estimatedEffort: "4-5 weeks of development time",
    businessImpact: "Expected to increase user engagement by 25%",
    technicalRequirements: "Machine learning expertise, recommendation system architecture",
    affectedAreas: ["individual"]
  },
  {
    id: "imp-2",
    title: "Ingredient Pairing Suggestions",
    description: "Develop a feature that recommends complementary ingredients for custom mocktail creations.",
    impact: "medium",
    effort: "medium",
    status: "approved",
    category: "Recipe Management",
    votes: 32,
    submittedBy: "Michael Chen",
    submittedDate: "2023-07-02",
    type: "enhancement",
    implementationSteps: [
      "Create ingredient compatibility database",
      "Develop pairing algorithm",
      "Design user interface for suggestions",
      "Implement feedback loop"
    ],
    estimatedEffort: "3 weeks of development time",
    businessImpact: "Will improve custom creation success rate",
    technicalRequirements: "Database of ingredient pairings, frontend components",
    lovableCompatible: true,
    affectedAreas: ["individual", "establishment"]
  },
  {
    id: "imp-3",
    title: "Establishment Calendar Integration",
    description: "Allow establishments to integrate with popular calendar platforms to promote events and specials.",
    impact: "medium",
    effort: "low",
    status: "in_progress",
    category: "Integration",
    votes: 27,
    submittedBy: "Alex Rivera",
    submittedDate: "2023-07-10",
    type: "enhancement",
    implementationSteps: [
      "Research calendar API integration options",
      "Create calendar event schemas",
      "Build integration UI",
      "Test with Google Calendar, Apple Calendar"
    ],
    estimatedEffort: "2 weeks of development time",
    businessImpact: "Will increase event attendance by an estimated 15%",
    technicalRequirements: "Calendar API integrations for major platforms",
    currentStatus: "OAuth implementation in progress",
    affectedAreas: ["establishment"]
  },
  {
    id: "imp-4",
    title: "Seasonal Ingredient Tracking",
    description: "Create a system to track and highlight seasonal ingredients for mocktails.",
    impact: "medium",
    effort: "medium",
    status: "proposed",
    category: "Inventory Management",
    votes: 22,
    submittedBy: "Emma Wilson",
    submittedDate: "2023-07-18",
    type: "new-feature",
    implementationSteps: [
      "Create seasonal ingredient database",
      "Implement regional availability tracking",
      "Design UI for seasonal highlights",
      "Add notification system for availability"
    ],
    estimatedEffort: "4 weeks of development time",
    businessImpact: "Will improve seasonal menu planning",
    technicalRequirements: "Database of seasonal ingredients by region",
    lovableCompatible: true,
    affectedAreas: ["establishment"]
  },
  {
    id: "imp-5",
    title: "Mocktail Trends Analysis",
    description: "Provide insights on trending mocktail ingredients, flavors, and presentation styles.",
    impact: "high",
    effort: "medium",
    status: "approved",
    category: "Analytics",
    votes: 36,
    submittedBy: "David Park",
    submittedDate: "2023-07-05",
    type: "new-feature",
    implementationSteps: [
      "Implement data collection system",
      "Create trend analysis algorithms",
      "Design trend visualization dashboard",
      "Build reporting functionality"
    ],
    estimatedEffort: "5 weeks of development time",
    businessImpact: "Will help establishments stay competitive with market trends",
    technicalRequirements: "Data analytics pipeline, visualization components",
    currentStatus: "Database schema design completed",
    affectedAreas: ["establishment", "admin"]
  }
];
