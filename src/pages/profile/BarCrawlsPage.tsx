
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import BarCrawlTab from '@/components/profile/BarCrawlTab';
import { Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';
import BackButton from '@/components/navigation/BackButton';

const BarCrawlsPage: React.FC = () => {
  const [barCrawlList, setBarCrawlList] = useState<Establishment[]>(sampleEstablishments.slice(0, 3));
  const { toast } = useToast();

  const shareBarCrawl = () => {
    toast({
      title: 'Bar Crawl Shared',
      description: 'Your bar crawl list has been shared with users in your area!',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="mb-6">
          <BackButton className="mb-2" />
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-medium text-material-on-background">Bar Crawls</h1>
              <p className="text-material-on-surface-variant">
                Manage your bar crawl plans
              </p>
            </div>
          </div>
        </div>
        
        <BarCrawlTab 
          barCrawlList={barCrawlList} 
          shareBarCrawl={shareBarCrawl} 
        />
      </div>
    </Layout>
  );
};

export default BarCrawlsPage;
