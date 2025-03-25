
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';

const AddPage = () => {
  const [formType, setFormType] = useState<'establishment' | 'cocktail'>('establishment');
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

  const [cocktail, setCocktail] = useState({
    name: '',
    price: '',
    description: '',
    ingredients: '',
    establishmentId: '',
  });

  const handleEstablishmentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEstablishment(prev => ({ ...prev, [name]: value }));
  };

  const handleCocktailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCocktail(prev => ({ ...prev, [name]: value }));
  };

  const handleEstablishmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to an API
    console.log('Establishment submitted:', establishment);
    
    toast({
      title: "Establishment submitted",
      description: "Your establishment has been submitted for review.",
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
  };

  const handleCocktailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to an API
    console.log('Cocktail submitted:', cocktail);
    
    toast({
      title: "Cocktail submitted",
      description: "Your cocktail has been submitted for review.",
    });
    
    // Reset form
    setCocktail({
      name: '',
      price: '',
      description: '',
      ingredients: '',
      establishmentId: '',
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-medium text-material-on-background">Add to Directory</h1>
          <p className="text-material-on-surface-variant">
            Contribute to our database of spirit-free cocktails
          </p>
        </div>

        <div className="bg-white rounded-xl p-5 elevation-2 mb-6">
          <div className="flex border-b border-material-outline mb-4">
            <button
              onClick={() => setFormType('establishment')}
              className={`flex-1 py-2 text-center ${formType === 'establishment' ? 'text-material-primary border-b-2 border-material-primary' : 'text-material-on-surface-variant'}`}
            >
              Add Establishment
            </button>
            <button
              onClick={() => setFormType('cocktail')}
              className={`flex-1 py-2 text-center ${formType === 'cocktail' ? 'text-material-primary border-b-2 border-material-primary' : 'text-material-on-surface-variant'}`}
            >
              Add Cocktail
            </button>
          </div>

          {formType === 'establishment' ? (
            <form onSubmit={handleEstablishmentSubmit} className="space-y-4">
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

              <button
                type="submit"
                className="w-full bg-material-primary text-material-on-primary rounded-lg py-3 font-medium transition-all hover:bg-opacity-90"
              >
                Submit Establishment
              </button>
            </form>
          ) : (
            <form onSubmit={handleCocktailSubmit} className="space-y-4">
              <div>
                <label htmlFor="establishmentId" className="block text-sm font-medium text-material-on-surface mb-1">
                  Establishment *
                </label>
                <select
                  id="establishmentId"
                  name="establishmentId"
                  value={cocktail.establishmentId}
                  onChange={handleCocktailChange}
                  className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                  required
                >
                  <option value="">Select an establishment</option>
                  {/* In a real app, these would be populated from the API */}
                  <option value="1">The Mocktail Bar</option>
                  <option value="2">Alcohol-Free Lounge</option>
                  <option value="3">Spirit-Free Cafe</option>
                </select>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-material-on-surface mb-1">
                  Cocktail Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={cocktail.name}
                  onChange={handleCocktailChange}
                  className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-material-on-surface mb-1">
                  Price *
                </label>
                <input
                  type="text"
                  id="price"
                  name="price"
                  value={cocktail.price}
                  onChange={handleCocktailChange}
                  placeholder="$0.00"
                  className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-material-on-surface mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={cocktail.description}
                  onChange={handleCocktailChange}
                  className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                  rows={3}
                  required
                ></textarea>
              </div>

              <div>
                <label htmlFor="ingredients" className="block text-sm font-medium text-material-on-surface mb-1">
                  Ingredients *
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  value={cocktail.ingredients}
                  onChange={handleCocktailChange}
                  placeholder="List ingredients separated by commas"
                  className="w-full p-3 border border-material-outline rounded-lg focus:outline-none focus:ring-2 focus:ring-material-primary"
                  rows={3}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-material-primary text-material-on-primary rounded-lg py-3 font-medium transition-all hover:bg-opacity-90"
              >
                Submit Cocktail
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AddPage;
