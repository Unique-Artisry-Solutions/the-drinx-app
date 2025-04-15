
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Route, Search, MapPin, Filter, PlusCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';
import { useAuth } from '@/contexts/auth';
import { useTheme } from '@/contexts/ThemeContext';

const SwigCircuitsPage: React.FC = () => {
  const [circuits, setCircuits] = useState<any[]>([]);
  const [filteredCircuits, setFilteredCircuits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Simulate data fetching
    setTimeout(() => {
      // Create sample circuits from sample data
      const formattedCircuits = sampleBarCrawls.map(crawl => {
        return {
          ...crawl,
          establishments: sampleEstablishments.slice(0, crawl.stops),
          participants: Math.floor(Math.random() * 20) + 5,
          theme: ['Urban Exploration', 'Weekend Getaway', 'Cocktail Masters', 'Local Gems'][Math.floor(Math.random() * 4)]
        };
      });
      setCircuits(formattedCircuits);
      setFilteredCircuits(formattedCircuits);
      setIsLoading(false);
    }, 600);
  }, []);

  // Handle search
  useEffect(() => {
    if (searchTerm) {
      const filtered = circuits.filter(circuit => 
        circuit.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        circuit.theme?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCircuits(filtered);
    } else {
      setFilteredCircuits(circuits);
    }
  }, [searchTerm, circuits]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filter by category
  const filterByCategory = (category: string) => {
    if (category === 'all') {
      setFilteredCircuits(circuits);
    } else {
      const filtered = circuits.filter(circuit => 
        circuit.theme?.toLowerCase() === category.toLowerCase()
      );
      setFilteredCircuits(filtered);
    }
  };

  // Get theme color based on category
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration':
        return 'from-blue-500 to-blue-600';
      case 'Weekend Getaway':
        return 'from-purple-500 to-purple-600';
      case 'Cocktail Masters':
        return 'from-amber-500 to-amber-600';
      case 'Local Gems':
        return 'from-green-500 to-green-600';
      default:
        return 'from-spiritless-pink to-spiritless-orange';
    }
  };

  // Get theme border color
  const getThemeBorderColor = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration':
        return 'border-blue-500';
      case 'Weekend Getaway':
        return 'border-purple-500';
      case 'Cocktail Masters':
        return 'border-amber-500';
      case 'Local Gems':
        return 'border-green-500';
      default:
        return 'border-spiritless-pink';
    }
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-material-on-background">
                <Route className="inline mr-2 h-8 w-8 text-spiritless-pink" />
                Swig Circuits
              </h1>
              <p className="text-material-on-surface-variant">
                Discover and join exciting alcohol-free swig circuits in your area
              </p>
            </div>
            
            {user && (
              <Button asChild className="bg-spiritless-pink hover:bg-spiritless-pink/90 shadow-md">
                <Link to="/create-bar-crawl" className="flex items-center gap-2">
                  <PlusCircle size={18} />
                  Create Circuit
                </Link>
              </Button>
            )}
          </div>
          
          <div className="bg-gradient-to-r from-spiritless-pink/20 to-spiritless-green/20 p-5 rounded-lg border border-spiritless-pink/30 mb-8 shadow-md">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Search circuits by name or theme..." 
                  className="pl-10 bg-white/80 backdrop-blur-sm border-transparent focus:border-spiritless-pink/50 focus-visible:ring-offset-1" 
                  value={searchTerm} 
                  onChange={handleSearch}
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-white/80 backdrop-blur-sm">
                <Filter size={16} />
                Filters
              </Button>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="mb-6 bg-gray-100/80 dark:bg-gray-800/80 p-1 backdrop-blur-sm">
            <TabsTrigger 
              value="all" 
              onClick={() => filterByCategory('all')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              All Circuits
            </TabsTrigger>
            <TabsTrigger 
              value="urban" 
              onClick={() => filterByCategory('Urban Exploration')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Urban Exploration
            </TabsTrigger>
            <TabsTrigger 
              value="weekend" 
              onClick={() => filterByCategory('Weekend Getaway')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Weekend
            </TabsTrigger>
            <TabsTrigger 
              value="cocktail" 
              onClick={() => filterByCategory('Cocktail Masters')}
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:shadow-sm"
            >
              Cocktail Masters
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map(item => (
                  <Card key={item} className="animate-pulse shadow-md overflow-hidden h-64">
                    <div className="h-2 bg-gray-200 dark:bg-gray-700"></div>
                    <CardContent className="h-full bg-gray-50 dark:bg-gray-800/50"></CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCircuits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCircuits.map(circuit => (
                  <Link 
                    key={circuit.id} 
                    to={`/bar-crawl/${circuit.id}`} 
                    className="block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Card className={`overflow-hidden border-l-4 ${getThemeBorderColor(circuit.theme)} shadow-md h-full`}>
                      <div className={`h-2 bg-gradient-to-r ${getThemeColor(circuit.theme)}`}></div>
                      <CardContent className="p-6 h-full flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-semibold text-lg truncate">{circuit.name}</h3>
                          <Badge className="bg-gray-100 text-gray-800 font-medium">{circuit.stops} stops</Badge>
                        </div>
                        
                        <div className="mb-4">
                          <Badge 
                            variant="outline" 
                            className={`${
                              circuit.theme === 'Urban Exploration' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              circuit.theme === 'Weekend Getaway' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              circuit.theme === 'Cocktail Masters' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                              'bg-green-50 text-green-700 border-green-200'
                            } font-medium`}
                          >
                            {circuit.theme}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-3 mt-auto">
                          <div className="flex items-center text-sm text-material-on-surface-variant">
                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span>{new Date(circuit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-material-on-surface-variant">
                            <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                            <span>{circuit.participants} participants</span>
                          </div>
                          
                          {circuit.establishments && circuit.establishments[0] && (
                            <div className="flex items-center text-sm text-material-on-surface-variant">
                              <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                              <span className="truncate">Starting: {circuit.establishments[0].name}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white dark:bg-gray-800/30 rounded-lg shadow-sm">
                <Route className="mx-auto h-12 w-12 text-gray-300 mb-2" />
                <h3 className="text-lg font-medium">No circuits found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>
          
          {/* Other tab contents will show the same content through the filter function */}
          <TabsContent value="urban" className="mt-0">
            {/* Content gets filtered by the tab click handler */}
          </TabsContent>
          <TabsContent value="weekend" className="mt-0">
            {/* Content gets filtered by the tab click handler */}
          </TabsContent>
          <TabsContent value="cocktail" className="mt-0">
            {/* Content gets filtered by the tab click handler */}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SwigCircuitsPage;
