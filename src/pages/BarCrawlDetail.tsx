
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import BackButton from '@/components/navigation/BackButton';
import BarCrawlHeader from '@/components/barCrawl/BarCrawlHeader';
import CrawlRouteCard from '@/components/barCrawl/CrawlRouteCard';
import EstablishmentGrid from '@/components/barCrawl/EstablishmentGrid';

interface BarCrawlEstablishment {
  id: string;
  name: string;
  address: string;
  distance?: string;
  cocktailCount?: number;
  image?: string;
  phone?: string;
  website?: string;
  hours?: string[];
  latitude: number;
  longitude: number;
}

interface BarCrawl {
  id: string;
  name: string;
  stops: number;
  organizer: string;
  date: string;
  establishments: BarCrawlEstablishment[];
  description?: string;
}

const BarCrawlDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [barCrawl, setBarCrawl] = useState<BarCrawl | null>(null);

  useEffect(() => {
    const fetchBarCrawl = () => {
      setTimeout(() => {
        const crawl = sampleBarCrawls.find(c => c.id === id);
        
        if (crawl) {
          const establishments = sampleEstablishments.slice(0, crawl.stops);
          
          setBarCrawl({
            ...crawl,
            date: crawl.date || new Date().toISOString().split('T')[0],
            establishments
          });
        }
        
        setLoading(false);
      }, 1000);
    };
    
    fetchBarCrawl();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in max-w-7xl mx-auto">
          <Skeleton className="h-12 w-2/3 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!barCrawl) {
    return (
      <Layout>
        <div className="py-4 animate-fade-in max-w-7xl mx-auto">
          <BackButton />
          <h1 className="text-2xl font-bold mb-2">Bar Crawl Not Found</h1>
          <p className="mb-4 text-gray-600">
            The bar crawl you're looking for doesn't exist or may have been removed.
          </p>
          <Button asChild variant="default">
            <Link to="/explore">
              Explore Bar Crawls
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-7xl mx-auto">
        <BackButton />
        
        <BarCrawlHeader
          name={barCrawl.name}
          organizer={barCrawl.organizer}
          date={barCrawl.date}
          stops={barCrawl.stops}
          description={barCrawl.description}
          id={barCrawl.id}
        />
        
        <CrawlRouteCard establishments={barCrawl.establishments} />
        
        <h2 className="text-xl font-semibold mb-3">Establishments</h2>
        <EstablishmentGrid establishments={barCrawl.establishments} />
      </div>
    </Layout>
  );
};

export default BarCrawlDetail;
