
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from '@/components/establishment/ProfileTab';
import PromotionsTab from '@/components/establishment/PromotionsTab';
import MocktailMenuTab from '@/components/establishment/MocktailMenuTab';
import VisitorStatsTab from '@/components/establishment/VisitorStatsTab';
import BarCrawlsTab from '@/components/establishment/BarCrawlsTab';
import { Drink } from '@/components/establishment/DrinkProfileModal';

const EstablishmentProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [promotions, setPromotions] = useState<{id: string; code: string; description: string}[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDescription, setNewPromoDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [visitorStats, setVisitorStats] = useState({
    totalVisits: 0,
    uniqueVisitors: 0,
    returningVisitors: 0
  });
  
  const [barCrawls, setBarCrawls] = useState<{
    id: string;
    name: string;
    date: string;
    participants: number;
    organizer: string;
    startDate: string;
    endDate: string;
    status: 'accepted' | 'pending';
    otherEstablishments: string[];
  }[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setName("Your Establishment");
      setEmail(localStorage.getItem('user_email') || '');
      setDescription("We serve the best mocktails in town!");
      setAddress("123 Main St, Anytown USA");
      setPhone("555-123-4567");
      setWebsite("www.yourestablishment.com");
      
      setPromotions([
        {id: '1', code: 'WELCOME10', description: '10% off for first time visitors'},
        {id: '2', code: 'MOCKTAIL2023', description: 'Buy one get one free on signature mocktails'}
      ]);
      
      // Initial mocktail menu items
      setDrinks([
        {
          id: '1',
          name: 'Blue Lagoon',
          description: 'A refreshing blend of blue curaçao syrup, lemon juice, and sprite, garnished with a lemon wheel and cherry.',
          price: '$8.99',
          ingredients: ['Blue Curaçao Syrup', 'Lemon Juice', 'Sprite'],
          photoUrl: 'https://placehold.co/300x200'
        },
        {
          id: '2',
          name: 'Tropical Paradise',
          description: 'A tropical mix of pineapple juice, coconut cream, and orange juice, garnished with a pineapple wedge.',
          price: '$9.99',
          ingredients: ['Pineapple Juice', 'Coconut Cream', 'Orange Juice'],
          photoUrl: 'https://placehold.co/300x200'
        }
      ]);
      
      setVisitorStats({
        totalVisits: 278,
        uniqueVisitors: 153,
        returningVisitors: 62
      });
      
      setBarCrawls([
        {
          id: '1',
          name: 'Downtown Mocktail Tour',
          date: '2023-11-15',
          participants: 12,
          organizer: 'John Smith',
          startDate: '2023-11-15',
          endDate: '2023-11-15',
          status: 'accepted',
          otherEstablishments: []
        },
        {
          id: '2',
          name: 'Weekend Spirits-Free Adventure',
          date: '2023-11-20',
          participants: 8,
          organizer: 'Sarah Johnson',
          startDate: '2023-11-20',
          endDate: '2023-11-20',
          status: 'accepted',
          otherEstablishments: []
        },
        {
          id: '3',
          name: 'Holiday Mocktail Crawl',
          date: '2023-12-15',
          participants: 15,
          organizer: 'Mike Wilson',
          startDate: '2023-12-15',
          endDate: '2023-12-16',
          status: 'pending',
          otherEstablishments: ['The Juice Bar', 'Herbal Infusions', 'Tropical Blends']
        }
      ]);
    }, 500);
  }, []);

  const handleSaveProfile = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      toast({
        title: 'Profile updated',
        description: 'Your establishment profile has been updated successfully',
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleAddPromotion = () => {
    if (!newPromoCode || !newPromoDescription) {
      toast({
        title: 'Missing information',
        description: 'Please provide both a code and description for your promotion',
        variant: 'destructive'
      });
      return;
    }
    
    const newPromo = {
      id: Date.now().toString(),
      code: newPromoCode,
      description: newPromoDescription
    };
    
    setPromotions([...promotions, newPromo]);
    setNewPromoCode('');
    setNewPromoDescription('');
    
    toast({
      title: 'Promotion added',
      description: `Your promotion "${newPromoCode}" has been added successfully`,
    });
  };

  const handleDeletePromotion = (id: string) => {
    setPromotions(promotions.filter(promo => promo.id !== id));
    
    toast({
      title: 'Promotion removed',
      description: 'The promotion has been removed successfully',
    });
  };

  const handleAddDrink = (drink: Drink) => {
    setDrinks([...drinks, drink]);
  };

  const handleUpdateDrink = (updatedDrink: Drink) => {
    setDrinks(drinks.map(drink => 
      drink.id === updatedDrink.id ? updatedDrink : drink
    ));
  };

  const handleDeleteDrink = (id: string) => {
    setDrinks(drinks.filter(drink => drink.id !== id));
    
    toast({
      title: 'Mocktail removed',
      description: 'The mocktail has been removed from your menu',
    });
  };

  const handleEndParticipation = (crawlId: string) => {
    setBarCrawls(barCrawls.filter(crawl => crawl.id !== crawlId));
    
    toast({
      title: 'Participation ended',
      description: 'You have successfully ended your participation in this bar crawl',
    });
  };

  const handleAcceptRequest = (crawlId: string) => {
    setBarCrawls(barCrawls.map(crawl => 
      crawl.id === crawlId 
        ? { ...crawl, status: 'accepted' as const } 
        : crawl
    ));
    
    toast({
      title: 'Request accepted',
      description: 'You have successfully accepted the bar crawl request',
    });
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-medium text-material-on-background">Establishment Profile</h1>
            <p className="text-material-on-surface-variant">
              Manage your establishment information and offerings
            </p>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="menu">Mocktail Menu</TabsTrigger>
            <TabsTrigger value="visitors">Visitor Stats</TabsTrigger>
            <TabsTrigger value="barCrawls">Bar Crawl Requests</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab 
              name={name}
              email={email}
              description={description}
              address={address}
              phone={phone}
              website={website}
              isLoading={isLoading}
              setName={setName}
              setEmail={setEmail}
              setDescription={setDescription}
              setAddress={setAddress}
              setPhone={setPhone}
              setWebsite={setWebsite}
              handleSaveProfile={handleSaveProfile}
            />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionsTab 
              promotions={promotions}
              newPromoCode={newPromoCode}
              newPromoDescription={newPromoDescription}
              setNewPromoCode={setNewPromoCode}
              setNewPromoDescription={setNewPromoDescription}
              handleAddPromotion={handleAddPromotion}
              handleDeletePromotion={handleDeletePromotion}
            />
          </TabsContent>

          <TabsContent value="menu">
            <MocktailMenuTab 
              drinks={drinks}
              onAddDrink={handleAddDrink}
              onUpdateDrink={handleUpdateDrink}
              onDeleteDrink={handleDeleteDrink}
            />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorStatsTab visitorStats={visitorStats} />
          </TabsContent>

          <TabsContent value="barCrawls">
            <BarCrawlsTab 
              barCrawls={barCrawls}
              handleEndParticipation={handleEndParticipation}
              handleAcceptRequest={handleAcceptRequest}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default EstablishmentProfilePage;
