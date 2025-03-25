
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface CocktailItem {
  name: string;
  price: string;
  description: string;
  ingredients: string;
}

const AddPage = () => {
  const { toast } = useToast();
  
  const [establishment, setEstablishment] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    website: '',
    description: '',
  });

  const [cocktails, setCocktails] = useState<CocktailItem[]>([
    { name: '', price: '', description: '', ingredients: '' }
  ]);

  const handleEstablishmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEstablishment(prev => ({ ...prev, [name]: value }));
  };

  const handleCocktailChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedCocktails = [...cocktails];
    updatedCocktails[index] = { ...updatedCocktails[index], [name]: value };
    setCocktails(updatedCocktails);
  };

  const addCocktail = () => {
    setCocktails([...cocktails, { name: '', price: '', description: '', ingredients: '' }]);
  };

  const removeCocktail = (index: number) => {
    if (cocktails.length > 1) {
      const updatedCocktails = cocktails.filter((_, i) => i !== index);
      setCocktails(updatedCocktails);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would send the data to an API
    console.log('Establishment submitted:', { ...establishment, cocktails });
    
    toast({
      title: "Submission successful",
      description: "Your establishment and cocktails have been submitted for review.",
    });
    
    // Reset form
    setEstablishment({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      website: '',
      description: '',
    });
    setCocktails([{ name: '', price: '', description: '', ingredients: '' }]);
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-material-on-background">Add Your Establishment</h1>
          <p className="text-material-on-surface-variant">
            Add your establishment and spirit-free cocktails to our directory
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 elevation-2 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="establishment" className="w-full">
              <TabsList className="w-full mb-4 grid grid-cols-2">
                <TabsTrigger value="establishment">Establishment Details</TabsTrigger>
                <TabsTrigger value="menu">Cocktail Menu</TabsTrigger>
              </TabsList>
              
              <TabsContent value="establishment" className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-material-on-surface mb-1">
                    Establishment Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={establishment.name}
                    onChange={handleEstablishmentChange}
                    className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-material-on-surface mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={establishment.address}
                    onChange={handleEstablishmentChange}
                    className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-material-on-surface mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={establishment.city}
                      onChange={handleEstablishmentChange}
                      className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-material-on-surface mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={establishment.state}
                      onChange={handleEstablishmentChange}
                      className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-material-on-surface mb-1">
                      Zip Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={establishment.zipCode}
                      onChange={handleEstablishmentChange}
                      className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-material-on-surface mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={establishment.phone}
                      onChange={handleEstablishmentChange}
                      className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-material-on-surface mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={establishment.website}
                    onChange={handleEstablishmentChange}
                    className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-material-on-surface mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={establishment.description}
                    onChange={handleEstablishmentChange}
                    className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                    rows={4}
                  ></textarea>
                </div>
              </TabsContent>
              
              <TabsContent value="menu" className="space-y-6">
                <div className="bg-material-surface-2 p-4 rounded-lg mb-2">
                  <p className="text-sm text-material-on-surface-variant mb-2">
                    Add your spirit-free cocktails to your menu. At least one cocktail is required.
                  </p>
                </div>
                
                {cocktails.map((cocktail, index) => (
                  <div key={index} className="p-4 border border-material-outline rounded-lg space-y-4">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium">Cocktail #{index + 1}</h3>
                      {cocktails.length > 1 && (
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm" 
                          onClick={() => removeCocktail(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Remove
                        </Button>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor={`cocktail-name-${index}`} className="block text-sm font-medium text-material-on-surface mb-1">
                        Cocktail Name *
                      </label>
                      <input
                        type="text"
                        id={`cocktail-name-${index}`}
                        name="name"
                        value={cocktail.name}
                        onChange={(e) => handleCocktailChange(index, e)}
                        className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`cocktail-price-${index}`} className="block text-sm font-medium text-material-on-surface mb-1">
                        Price *
                      </label>
                      <input
                        type="text"
                        id={`cocktail-price-${index}`}
                        name="price"
                        value={cocktail.price}
                        onChange={(e) => handleCocktailChange(index, e)}
                        placeholder="$0.00"
                        className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor={`cocktail-description-${index}`} className="block text-sm font-medium text-material-on-surface mb-1">
                        Description *
                      </label>
                      <textarea
                        id={`cocktail-description-${index}`}
                        name="description"
                        value={cocktail.description}
                        onChange={(e) => handleCocktailChange(index, e)}
                        className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                        rows={3}
                        required
                      ></textarea>
                    </div>

                    <div>
                      <label htmlFor={`cocktail-ingredients-${index}`} className="block text-sm font-medium text-material-on-surface mb-1">
                        Ingredients *
                      </label>
                      <textarea
                        id={`cocktail-ingredients-${index}`}
                        name="ingredients"
                        value={cocktail.ingredients}
                        onChange={(e) => handleCocktailChange(index, e)}
                        placeholder="List ingredients separated by commas"
                        className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                        rows={3}
                        required
                      ></textarea>
                    </div>
                  </div>
                ))}
                
                <Button 
                  type="button" 
                  onClick={addCocktail} 
                  variant="outline" 
                  className="w-full mt-4"
                >
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Another Cocktail
                </Button>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 border-t border-material-outline">
              <Button
                type="submit"
                className="w-full bg-material-primary text-material-on-primary rounded-lg py-3 font-medium transition-all hover:bg-opacity-90"
              >
                Submit Establishment & Cocktails
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
