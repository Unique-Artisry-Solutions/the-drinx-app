
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

const CreateBarCrawlPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

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
      establishments: [],
      organizer: localStorage.getItem('user_name') || 'User',
      status: 'planned',
      created_at: new Date().toISOString(),
    });
    localStorage.setItem('user_bar_crawls', JSON.stringify(barCrawls));
    
    toast({
      title: 'Swig Circuit Created',
      description: 'Your new Swig Circuit has been created successfully!',
    });
    
    // Redirect to the swig circuit management page
    navigate(`/profile/my-creations/${newBarCrawlId}`);
  };

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-3xl mx-auto">
        <BackButton />
        <h1 className="text-2xl font-medium text-material-on-background mb-4">Create Swig Circuit</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-spiritless-pink" />
              New Swig Circuit Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
              
              <div className="space-y-2">
                <Label>Establishments</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">You can add establishments after creating the Swig Circuit</p>
                
                <div className="bg-muted/50 backdrop-blur-sm p-3 rounded-lg border border-border/50">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/80">No establishments selected</span>
                    <Button type="button" variant="outline" size="sm" asChild>
                      <Link to="/map">Browse Map</Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="submit" className="bg-spiritless-pink hover:bg-spiritless-pink/90">
                  Create Swig Circuit
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateBarCrawlPage;
