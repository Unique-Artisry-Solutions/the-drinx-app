
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, Shield, Users, Star } from 'lucide-react';

const ProposedImprovementsTab: React.FC = () => {
  const improvements = [
    {
      id: 1,
      title: "Enhanced Search & Discovery",
      description: "Implement AI-powered search with filters, location-based recommendations, and smart suggestions",
      impact: "high",
      effort: "medium",
      category: "User Experience",
      votes: 23,
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Real-time Notifications",
      description: "Push notifications for event updates, promotions, and social interactions",
      impact: "medium",
      effort: "low",
      category: "Engagement",
      votes: 18,
      icon: <Zap className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Advanced Security Features",
      description: "Two-factor authentication, role-based permissions, and audit logging",
      impact: "high",
      effort: "high",
      category: "Security",
      votes: 15,
      icon: <Shield className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Social Features Enhancement",
      description: "Friend connections, group events, social feeds, and community features",
      impact: "medium",
      effort: "high",
      category: "Social",
      votes: 12,
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 5,
      title: "Premium Tier Features",
      description: "Advanced analytics, priority support, custom branding, and exclusive features",
      impact: "medium",
      effort: "medium",
      category: "Monetization",
      votes: 9,
      icon: <Star className="h-5 w-5" />
    }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-amber-100 text-amber-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'high':
        return 'bg-purple-100 text-purple-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Proposed Improvements</h2>
        <p className="text-gray-600">
          System improvement suggestions and enhancement proposals based on user feedback and analysis.
        </p>
      </div>

      <div className="grid gap-4">
        {improvements.map((improvement) => (
          <Card key={improvement.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                {improvement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold">{improvement.title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{improvement.votes} votes</span>
                    <Button variant="outline" size="sm">
                      Vote
                    </Button>
                  </div>
                </div>
                <p className="text-gray-600 mb-3">{improvement.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{improvement.category}</Badge>
                  <Badge className={getImpactColor(improvement.impact)}>
                    {improvement.impact} impact
                  </Badge>
                  <Badge className={getEffortColor(improvement.effort)}>
                    {improvement.effort} effort
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">Total Proposals</h4>
          <div className="text-3xl font-bold text-blue-600">{improvements.length}</div>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">High Impact</h4>
          <div className="text-3xl font-bold text-red-600">
            {improvements.filter(i => i.impact === 'high').length}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">Total Votes</h4>
          <div className="text-3xl font-bold text-green-600">
            {improvements.reduce((sum, i) => sum + i.votes, 0)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProposedImprovementsTab;
