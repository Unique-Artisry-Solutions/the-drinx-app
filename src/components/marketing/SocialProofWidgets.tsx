
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Star, MessageSquare, Share2, Heart, TrendingUp } from 'lucide-react';

interface SocialProofData {
  attendeeCount: number;
  rating: number;
  reviewCount: number;
  socialMentions: number;
  shareCount: number;
  recentAttendees: Array<{
    name: string;
    avatar: string;
    joinedAt: string;
  }>;
  testimonials: Array<{
    text: string;
    author: string;
    rating: number;
  }>;
}

interface SocialProofWidgetsProps {
  eventId: string;
  eventName: string;
}

const SocialProofWidgets: React.FC<SocialProofWidgetsProps> = ({
  eventId,
  eventName
}) => {
  const [socialData, setSocialData] = useState<SocialProofData>({
    attendeeCount: 247,
    rating: 4.8,
    reviewCount: 89,
    socialMentions: 156,
    shareCount: 342,
    recentAttendees: [
      { name: "Sarah M.", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1c5?w=32&h=32&fit=crop&crop=face", joinedAt: "2 mins ago" },
      { name: "Alex K.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face", joinedAt: "5 mins ago" },
      { name: "Jamie L.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face", joinedAt: "8 mins ago" }
    ],
    testimonials: [
      { text: "Amazing event! The mocktails were incredible and the atmosphere was perfect.", author: "Maria Rodriguez", rating: 5 },
      { text: "Great venue and fantastic organization. Will definitely attend again!", author: "David Chen", rating: 5 },
      { text: "Loved the creative drink selections and the social aspect.", author: "Emma Wilson", rating: 4 }
    ]
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSocialData(prev => ({
        ...prev,
        attendeeCount: prev.attendeeCount + Math.floor(Math.random() * 3),
        socialMentions: prev.socialMentions + Math.floor(Math.random() * 2),
        shareCount: prev.shareCount + Math.floor(Math.random() * 5)
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  return (
    <div className="space-y-4">
      {/* Live Activity Widget */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="text-sm font-medium text-green-800">
                  {socialData.attendeeCount} people are interested
                </p>
                <p className="text-xs text-green-600">
                  +{Math.floor(Math.random() * 5) + 1} joined in the last hour
                </p>
              </div>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Social Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
            <div className="text-2xl font-bold">{formatNumber(socialData.attendeeCount)}</div>
            <div className="text-xs text-gray-500">Attendees</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{socialData.rating}</div>
            <div className="text-xs text-gray-500">{socialData.reviewCount} reviews</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MessageSquare className="h-6 w-6 mx-auto mb-2 text-purple-500" />
            <div className="text-2xl font-bold">{formatNumber(socialData.socialMentions)}</div>
            <div className="text-xs text-gray-500">Mentions</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Share2 className="h-6 w-6 mx-auto mb-2 text-green-500" />
            <div className="text-2xl font-bold">{formatNumber(socialData.shareCount)}</div>
            <div className="text-xs text-gray-500">Shares</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attendees */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" />
            Recent Sign-ups
          </h4>
          <div className="space-y-2">
            {socialData.recentAttendees.map((attendee, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={attendee.avatar}
                    alt={attendee.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{attendee.name}</span>
                  <span className="text-xs text-gray-500">joined</span>
                </div>
                <span className="text-xs text-gray-400">{attendee.joinedAt}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testimonials Widget */}
      <Card>
        <CardContent className="p-4">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Heart className="h-4 w-4" />
            What People Are Saying
          </h4>
          <div className="space-y-3">
            {socialData.testimonials.slice(0, 2).map((testimonial, index) => (
              <div key={index} className="border-l-2 border-blue-200 pl-3">
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-700 mb-1">"{testimonial.text}"</p>
                <p className="text-xs text-gray-500">- {testimonial.author}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              ✓ Verified Event
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              ✓ Safe & Secure
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              ✓ 98% Satisfaction Rate
            </Badge>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              ✓ Award Winning
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialProofWidgets;
