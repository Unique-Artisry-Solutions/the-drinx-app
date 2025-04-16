
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Users, Route, Search, MapPin, Filter, PlusCircle, Clock, Star, Triangle, ArrowRight } from 'lucide-react';
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
          theme: ['Urban Exploration', 'Weekend Getaway', 'Cocktail Masters', 'Local Gems'][Math.floor(Math.random() * 4)],
          difficulty: ['Easy', 'Moderate', 'Challenging'][Math.floor(Math.random() * 3)],
          duration: Math.floor(Math.random() * 4) + 2 + ' hours'
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
  
  // Get theme image pattern based on theme
  const getThemeImage = (theme: string) => {
    switch (theme) {
      case 'Urban Exploration':
        return "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234299e1' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      case 'Weekend Getaway':
        return "url(\"data:image/svg+xml,%3Csvg width='48' height='32' viewBox='0 0 48 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a78bfa' fill-opacity='0.15'%3E%3Cpath d='M27 32c0-3.314 2.686-6 6-6 5.523 0 10-4.477 10-10S38.523 6 33 6c-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 6.627 0 12 5.373 12 12s-5.373 12-12 12c-2.21 0-4 1.79-4 4h-2zm-6 0c0-3.314-2.686-6-6-6-5.523 0-10-4.477-10-10S9.477 6 15 6c3.314 0 6-2.686 6-6h-2c0 2.21-1.79 4-4 4C8.373 4 3 9.373 3 16s5.373 12 12 12c2.21 0 4 1.79 4 4h2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      case 'Cocktail Masters':
        return "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='0.15'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      case 'Local Gems':
        return "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2322c55e' fill-opacity='0.15'%3E%3Cpath d='M0 0h20L0 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
      default:
        return "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23FF719A' fill-opacity='0.15'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")";
    }
  };
  
  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Moderate':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Challenging':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  // Get difficulty icon
  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return <Star className="mr-1 h-3 w-3" />;
      case 'Moderate':
        return <><Star className="mr-0 h-3 w-3" /><Star className="mr-1 h-3 w-3" /></>;
      case 'Challenging':
        return <><Star className="mr-0 h-3 w-3" /><Star className="mr-0 h-3 w-3" /><Star className="mr-1 h-3 w-3" /></>;
      default:
        return <Star className="mr-1 h-3 w-3" />;
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
                    <Card className={`overflow-hidden border-b-4 ${getThemeBorderColor(circuit.theme)} shadow-md h-full`}>
                      <div className={`h-28 bg-gradient-to-r ${getThemeColor(circuit.theme)} relative overflow-hidden`} style={{ backgroundImage: getThemeImage(circuit.theme) }}>
                        <div className="absolute inset-0 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start w-full">
                            <Badge variant="outline" className="bg-white/90 text-gray-800 font-medium shadow-sm backdrop-blur-sm">
                              {circuit.stops} stops
                            </Badge>
                            <Badge className={`${getDifficultyColor(circuit.difficulty)} flex items-center shadow-sm backdrop-blur-sm`}>
                              {getDifficultyIcon(circuit.difficulty)}
                              {circuit.difficulty}
                            </Badge>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white drop-shadow-md bg-black/30 p-2 rounded backdrop-blur-sm">{circuit.name}</h3>
                        </div>
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="mb-3">
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
                        
                        {/* Route Preview */}
                        <div className="mb-3 flex items-center">
                          <div className="flex-1 flex items-center">
                            {circuit.establishments.slice(0, 3).map((est: any, i: number) => (
                              <div key={i} className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center -ml-2 first:ml-0 border-2 border-white ${i === 0 ? 'z-30' : i === 1 ? 'z-20' : 'z-10'}`}>
                                {est.image ? (
                                  <img src={est.image} alt={est.name} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                  <MapPin size={14} className="text-gray-400" />
                                )}
                              </div>
                            ))}
                            {circuit.establishments.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center -ml-2 border-2 border-white text-xs font-medium text-gray-500">
                                +{circuit.establishments.length - 3}
                              </div>
                            )}
                            <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 mt-auto text-sm">
                          <div className="flex items-center text-material-on-surface-variant">
                            <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span>{new Date(circuit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          
                          <div className="flex items-center text-material-on-surface-variant">
                            <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span>{circuit.duration}</span>
                          </div>
                          
                          <div className="flex items-center text-material-on-surface-variant">
                            <Users className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span>{circuit.participants} participants</span>
                          </div>
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
