
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, ImagePlus } from 'lucide-react';
import BackButton from '@/components/navigation/BackButton';
import { Textarea } from '@/components/ui/textarea';
import { format, addDays } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ThemeSelection from '@/components/barCrawl/ThemeSelection';
import VenueDiversity from '@/components/barCrawl/VenueDiversity';
import InteractiveElements, { InteractiveElement } from '@/components/barCrawl/InteractiveElements';
import SocialSharingOptions from '@/components/barCrawl/SocialSharingOptions';
import FeedbackMechanism from '@/components/barCrawl/FeedbackMechanism';
import DrinkHighlights, { DrinkHighlight } from '@/components/barCrawl/DrinkHighlights';
import PairingOptions, { Pairing } from '@/components/barCrawl/PairingOptions';
import BarCrawlControl from '@/components/BarCrawlControl';
import { Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';

const CreateBarCrawlPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentTab, setCurrentTab] = useState("basics");
  
  // New state for enhanced features
  const [selectedTheme, setSelectedTheme] = useState('');
  const [diversityPreference, setDiversityPreference] = useState(50);
  const [selectedElements, setSelectedElements] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [feedbackOptions, setFeedbackOptions] = useState<string[]>(['ratings', 'checkins']);
  const [drinkHighlights, setDrinkHighlights] = useState<DrinkHighlight[]>([]);
  const [pairings, setPairings] = useState<Pairing[]>([]);
  const [selectedEstablishments, setSelectedEstablishments] = useState<Establishment[]>([]);

  // Auto-calculate end date based on start date (7 days later)
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = addDays(start, 7);
      setEndDate(format(end, 'yyyy-MM-dd'));
    }
  }, [startDate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleElementToggle = (elementId: string) => {
    if (selectedElements.includes(elementId)) {
      setSelectedElements(selectedElements.filter(id => id !== elementId));
    } else {
      setSelectedElements([...selectedElements, elementId]);
    }
  };

  const handleFeedbackToggle = (option: string) => {
    if (feedbackOptions.includes(option)) {
      setFeedbackOptions(feedbackOptions.filter(o => o !== option));
    } else {
      setFeedbackOptions([...feedbackOptions, option]);
    }
  };

  const handleSaveEstablishments = (establishments: Establishment[]) => {
    setSelectedEstablishments(establishments);
    toast({
      title: 'Establishments Updated',
      description: `${establishments.length} establishments added to your Swig Circuit.`,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !startDate || !endDate) {
      toast({
        title: 'Missing fields',
        description: 'Please fill out all required fields',
        variant: 'destructive',
      });
      return;
    }

    if (selectedEstablishments.length < 2) {
      toast({
        title: 'Not enough establishments',
        description: 'Please select at least 2 establishments for your Swig Circuit.',
        variant: 'destructive',
      });
      return;
    }

    // Generate a mock ID for the new swig circuit
    const newBarCrawlId = `bc-${Date.now()}`;
    
    // Store swig circuit data in localStorage (in a real app, this would be saved to a database)
    const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    barCrawls.push({
      id: newBarCrawlId,
      name,
      startDate,
      endDate,
      description,
      imageUrl: previewUrl || 'https://placehold.co/600x300',
      establishments: selectedEstablishments,
      organizer: localStorage.getItem('user_name') || 'User',
      status: 'planned',
      created_at: new Date().toISOString(),
      // New enhanced properties
      theme: selectedTheme,
      diversityPreference,
      interactiveElements: selectedElements,
      hashtags,
      feedbackOptions,
      drinkHighlights,
      pairings
    });
    localStorage.setItem('user_bar_crawls', JSON.stringify(barCrawls));
    
    toast({
      title: 'Swig Circuit Created',
      description: 'Your new Swig Circuit has been created successfully!',
    });
    
    // Redirect to the swig circuit management page
    navigate(`/profile/my-creations/${newBarCrawlId}`);
  };

  const isTabComplete = (tabName: string): boolean => {
    switch (tabName) {
      case "basics":
        return !!name && !!startDate;
      case "theme":
        return !!selectedTheme;
      case "venues":
        return selectedEstablishments.length >= 2;
      case "drinks":
        return drinkHighlights.length > 0;
      case "experience":
        return selectedElements.length > 0;
      case "social":
        return hashtags.length > 0;
      default:
        return false;
    }
  };

  const getCompletionStatus = (tabName: string): React.ReactNode => {
    if (isTabComplete(tabName)) {
      return <span className="ml-2 text-xs bg-green-500/20 text-green-700 px-1.5 py-0.5 rounded-full">Complete</span>;
    }
    return <span className="ml-2 text-xs bg-amber-500/20 text-amber-700 px-1.5 py-0.5 rounded-full">Pending</span>;
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-4xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-medium text-material-on-background mb-4">Create Swig Circuit</h1>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm overflow-auto">
            <TabsList className="w-full grid grid-cols-3 md:grid-cols-7 gap-1">
              <TabsTrigger value="basics" className="text-xs md:text-sm">
                Basics {getCompletionStatus("basics")}
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs md:text-sm">
                Theme {getCompletionStatus("theme")}
              </TabsTrigger>
              <TabsTrigger value="venues" className="text-xs md:text-sm">
                Venues {getCompletionStatus("venues")}
              </TabsTrigger>
              <TabsTrigger value="drinks" className="text-xs md:text-sm">
                Drinks {getCompletionStatus("drinks")}
              </TabsTrigger>
              <TabsTrigger value="pairings" className="text-xs md:text-sm">
                Pairings
              </TabsTrigger>
              <TabsTrigger value="experience" className="text-xs md:text-sm">
                Experience {getCompletionStatus("experience")}
              </TabsTrigger>
              <TabsTrigger value="social" className="text-xs md:text-sm">
                Social {getCompletionStatus("social")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Basic Information */}
          <TabsContent value="basics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-spiritless-pink" />
                  Basic Swig Circuit Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="crawlName">Swig Circuit Name</Label>
                    <Input 
                      id="crawlName" 
                      placeholder="Weekend Mocktail Tour" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUpload">Swig Circuit Image</Label>
                    <div className="relative border rounded-md overflow-hidden">
                      {previewUrl ? (
                        <div className="aspect-video relative">
                          <img 
                            src={previewUrl} 
                            alt="Swig Circuit preview" 
                            className="w-full h-full object-cover" 
                          />
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            className="absolute top-2 right-2 bg-white/80"
                            onClick={() => {
                              setPreviewUrl('');
                              setImageFile(null);
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-6 cursor-pointer bg-gray-50 dark:bg-gray-800 aspect-video">
                          <ImagePlus className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image</span>
                          <input 
                            type="file" 
                            id="imageUpload" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input 
                        id="startDate" 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date (7 days maximum)</Label>
                      <Input 
                        id="endDate" 
                        type="date" 
                        value={endDate}
                        readOnly 
                        className="bg-muted cursor-not-allowed"
                        title="End date is automatically set to 7 days after the start date"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Maximum duration is 7 days
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your Swig Circuit experience" 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      type="button" 
                      onClick={() => setCurrentTab("theme")}
                      disabled={!name || !startDate}
                      className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                    >
                      Continue to Theme Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Theme Selection */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle>Theme & Atmosphere</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeSelection 
                  selectedTheme={selectedTheme} 
                  onThemeSelect={setSelectedTheme} 
                />
                
                <VenueDiversity 
                  diversityPreference={diversityPreference}
                  onDiversityChange={setDiversityPreference}
                />
                
                <div className="flex justify-between space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab("basics")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setCurrentTab("venues")}
                    disabled={!selectedTheme}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Continue to Venue Selection
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Venue Selection */}
          <TabsContent value="venues">
            <Card>
              <CardHeader>
                <CardTitle>Select Venues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  Choose at least 2 establishments to include in your Swig Circuit.
                </p>
                
                <BarCrawlControl 
                  establishments={sampleEstablishments}
                  onSaveBarCrawl={handleSaveEstablishments}
                />
                
                {selectedEstablishments.length > 0 && (
                  <div className="bg-muted/30 p-3 rounded border">
                    <h3 className="font-medium mb-2">Selected Venues ({selectedEstablishments.length})</h3>
                    <div className="space-y-2">
                      {selectedEstablishments.map((est, index) => (
                        <div key={est.id} className="bg-background p-2 rounded flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="bg-material-primary text-white w-6 h-6 rounded-full flex items-center justify-center mr-2">
                              {index + 1}
                            </div>
                            <span>{est.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab("theme")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setCurrentTab("drinks")}
                    disabled={selectedEstablishments.length < 2}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Continue to Drink Highlights
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Drink Highlights */}
          <TabsContent value="drinks">
            <Card>
              <CardHeader>
                <CardTitle>Featured Drinks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DrinkHighlights 
                  highlights={drinkHighlights}
                  onHighlightsChange={setDrinkHighlights}
                />
                
                <div className="flex justify-between space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab("venues")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setCurrentTab("pairings")}
                    disabled={drinkHighlights.length === 0}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Continue to Pairings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Food Pairings */}
          <TabsContent value="pairings">
            <Card>
              <CardHeader>
                <CardTitle>Food & Drink Pairings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <PairingOptions
                  pairings={pairings}
                  onPairingsChange={setPairings}
                />
                
                <div className="flex justify-between space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab("drinks")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setCurrentTab("experience")}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Continue to Interactive Experiences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Interactive Experiences */}
          <TabsContent value="experience">
            <Card>
              <CardHeader>
                <CardTitle>Interactive Experiences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InteractiveElements
                  selectedElements={selectedElements}
                  onElementToggle={handleElementToggle}
                />
                
                <FeedbackMechanism
                  enabledOptions={feedbackOptions}
                  onToggleOption={handleFeedbackToggle}
                />
                
                <div className="flex justify-between space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab("pairings")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => setCurrentTab("social")}
                    disabled={selectedElements.length === 0}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Continue to Social Sharing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Sharing */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Sharing & Promotion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <SocialSharingOptions
                  hashtags={hashtags}
                  onHashtagsChange={setHashtags}
                />
                
                <div className="flex justify-between space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setCurrentTab("experience")}
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit" 
                    onClick={handleSubmit}
                    disabled={!name || !startDate || !selectedTheme || selectedEstablishments.length < 2}
                    className="bg-spiritless-pink hover:bg-spiritless-pink/90"
                  >
                    Create Swig Circuit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CreateBarCrawlPage;
