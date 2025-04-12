
import React from 'react';
import Layout from '@/components/Layout';
import { useUserLocation } from '@/hooks/useUserLocation';
import { useEstablishments } from '@/hooks/useEstablishments';
import { useSwigCircuitCreation } from '@/hooks/swigCircuit/useSwigCircuitCreation';
import CreateSwigCircuitHeader from '@/components/swigCircuit/CreateSwigCircuitHeader';
import StepsNavigation from '@/components/swigCircuit/StepsNavigation';
import BasicsTab from '@/components/swigCircuit/tabs/BasicsTab';
import ThemeTab from '@/components/swigCircuit/tabs/ThemeTab';
import VenuesTab from '@/components/swigCircuit/tabs/VenuesTab';
import DrinksTab from '@/components/swigCircuit/tabs/DrinksTab';
import PairingsTab from '@/components/swigCircuit/tabs/PairingsTab';
import { useAuth } from '@/contexts/auth';

const CreateSwigCircuitPage: React.FC = () => {
  const { user } = useAuth();
  
  const {
    name,
    setName,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    description,
    setDescription,
    imageFile,
    setImageFile,
    previewUrl,
    setPreviewUrl,
    currentTab,
    setCurrentTab,
    selectedTheme,
    setSelectedTheme,
    maxDistance,
    setMaxDistance,
    drinkHighlights,
    setDrinkHighlights,
    pairings,
    setPairings,
    selectedEstablishments,
    handleSaveEstablishments,
    isTabComplete,
    handleSubmit,
    isSubmitting
  } = useSwigCircuitCreation();

  const { userLocation, isLoading: isLocating } = useUserLocation();
  
  const { 
    establishments: availableEstablishments, 
    isLoading: isLoadingEstablishments,
    updateMaxDistance
  } = useEstablishments({
    latitude: userLocation?.latitude,
    longitude: userLocation?.longitude,
    maxDistance
  });

  const handleDistanceChange = (distance: number) => {
    setMaxDistance(distance);
    updateMaxDistance(distance);
  };

  const tabs = [
    { id: "basics", label: "Basics" },
    { id: "theme", label: "Theme" },
    { id: "venues", label: "Venues" },
    { id: "drinks", label: "Drinks" },
    { id: "pairings", label: "Pairings" },
  ];

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-4xl mx-auto">
        <CreateSwigCircuitHeader />
        
        {!user && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
            <p className="text-yellow-800">
              <strong>Note:</strong> You are not logged in. For testing, your Swig Circuit will be saved to local storage.
            </p>
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-4">
          <StepsNavigation 
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            tabs={tabs}
            isTabComplete={isTabComplete}
          />
          
          {currentTab === "basics" && (
            <BasicsTab 
              name={name}
              setName={setName}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              description={description}
              setDescription={setDescription}
              imageFile={imageFile}
              setImageFile={setImageFile}
              previewUrl={previewUrl}
              setPreviewUrl={setPreviewUrl}
              onContinue={() => setCurrentTab("theme")}
            />
          )}
          
          {currentTab === "theme" && (
            <ThemeTab 
              selectedTheme={selectedTheme}
              setSelectedTheme={setSelectedTheme}
              onBack={() => setCurrentTab("basics")}
              onContinue={() => setCurrentTab("venues")}
            />
          )}
          
          {currentTab === "venues" && (
            <VenuesTab 
              maxDistance={maxDistance}
              onDistanceChange={handleDistanceChange}
              isLocating={isLocating}
              userLocation={userLocation}
              isLoadingEstablishments={isLoadingEstablishments}
              availableEstablishments={availableEstablishments}
              selectedEstablishments={selectedEstablishments}
              onSaveEstablishments={handleSaveEstablishments}
              onBack={() => setCurrentTab("theme")}
              onContinue={() => setCurrentTab("drinks")}
            />
          )}
          
          {currentTab === "drinks" && (
            <DrinksTab 
              drinkHighlights={drinkHighlights}
              setDrinkHighlights={setDrinkHighlights}
              onBack={() => setCurrentTab("venues")}
              onContinue={() => setCurrentTab("pairings")}
            />
          )}
          
          {currentTab === "pairings" && (
            <PairingsTab 
              pairings={pairings}
              setPairings={setPairings}
              onBack={() => setCurrentTab("drinks")}
              onSubmit={handleSubmit}
              isSubmitDisabled={!name || !startDate || !selectedTheme || selectedEstablishments.length < 2}
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default CreateSwigCircuitPage;
