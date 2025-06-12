
import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import FollowButton from '@/components/common/FollowButton';
import { MapPin, Calendar, Users, Star } from 'lucide-react';

interface Promoter {
  id: string;
  username: string;
  display_name?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
  created_at: string;
}

const PromoterDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: promoter, isLoading } = useQuery({
    queryKey: ['promoter', id],
    queryFn: async () => {
      if (!id) throw new Error('No promoter ID provided');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Promoter;
    },
    enabled: !!id
  });

  const { data: followerCount = 0 } = useQuery({
    queryKey: ['promoter-followers', id],
    queryFn: async () => {
      if (!id) return 0;
      
      const { count } = await supabase
        .from('promoter_followers')
        .select('*', { count: 'exact' })
        .eq('promoter_id', id)
        .eq('follow_status', 'active');
      
      return count || 0;
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="h-40 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded"></div>
              <div className="h-40 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!promoter) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Promoter Not Found</h1>
            <p className="text-muted-foreground">The promoter you're looking for doesn't exist.</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {promoter.avatar_url && (
                <img
                  src={promoter.avatar_url}
                  alt={promoter.display_name || promoter.username}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold">
                  {promoter.display_name || promoter.username}
                </h1>
                {promoter.display_name && (
                  <p className="text-muted-foreground">@{promoter.username}</p>
                )}
              </div>
            </div>
            
            <FollowButton
              promoterId={promoter.id}
              promoterName={promoter.display_name || promoter.username}
              showFollowerCount={true}
            />
          </div>

          {promoter.bio && (
            <p className="text-lg text-muted-foreground mb-4">{promoter.bio}</p>
          )}

          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            {promoter.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {promoter.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Joined {new Date(promoter.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {followerCount} followers
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {promoter.bio || 'No bio available'}
              </p>
              {promoter.website && (
                <div className="mt-4">
                  <a
                    href={promoter.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Events</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                No recent events to display
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Followers</span>
                <Badge variant="secondary">{followerCount}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Events</span>
                <Badge variant="secondary">0</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rating</span>
                <Badge variant="secondary">N/A</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterDetailsPage;
