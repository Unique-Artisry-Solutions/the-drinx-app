
import React from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { useSwigCircuitCreation } from '@/hooks/swigCircuit/useSwigCircuitCreation';
import CreateSwigCircuitHeader from '@/components/swigCircuit/CreateSwigCircuitHeader';
import StepsNavigation from '@/components/swigCircuit/StepsNavigation';
import BasicsTab from '@/components/swigCircuit/tabs/BasicsTab';
import ThemeTab from '@/components/swigCircuit/tabs/ThemeTab';
import VenuesTab from '@/components/swigCircuit/tabs/VenuesTab';
import DrinksTab from '@/components/swigCircuit/tabs/DrinksTab';
import PairingsTab from '@/components/swigCircuit/tabs/PairingsTab';

const CreateSwigCircuitPage: React.FC = () => {
  const swigCircuit = useSwigCircuitCreation();

  const tabs = [
    { id: "basics", label: "Basics" },
    { id: "theme", label: "Theme" },
    { id: "venues", label: "Venues" },
    { id: "drinks", label: "Drinks" },
    { id: "pairings", label: "Pairings" },
    { id: "tickets", label: "Tickets" },
    { id: "projections", label: "Projections" }
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === swigCircuit.currentTab);
    if (currentIndex < tabs.length - 1) {
      swigCircuit.setCurrentTab(tabs[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === swigCircuit.currentTab);
    if (currentIndex > 0) {
      swigCircuit.setCurrentTab(tabs[currentIndex - 1].id);
    }
  };

  const renderTabContent = () => {
    switch (swigCircuit.currentTab) {
      case "basics":
        return (
          <BasicsTab
            name={swigCircuit.name}
            setName={swigCircuit.setName}
            startDate={swigCircuit.startDate}
            setStartDate={swigCircuit.setStartDate}
            endDate={swigCircuit.endDate}
            setEndDate={swigCircuit.setEndDate}
            description={swigCircuit.description}
            setDescription={swigCircuit.setDescription}
            imageFile={swigCircuit.imageFile}
            setImageFile={swigCircuit.setImageFile}
            previewUrl={swigCircuit.previewUrl}
            setPreviewUrl={swigCircuit.setPreviewUrl}
            onContinue={handleNext}
          />
        );

      case "theme":
        return (
          <ThemeTab
            selectedTheme={swigCircuit.selectedTheme}
            setSelectedTheme={swigCircuit.setSelectedTheme}
            onBack={handleBack}
            onContinue={handleNext}
          />
        );

      case "venues":
        return (
          <VenuesTab
            selectedEstablishments={swigCircuit.selectedEstablishments}
            onSaveEstablishments={swigCircuit.handleSaveEstablishments}
            maxDistance={swigCircuit.maxDistance}
            setMaxDistance={swigCircuit.setMaxDistance}
            onBack={handleBack}
            onContinue={handleNext}
          />
        );

      case "drinks":
        return (
          <DrinksTab
            drinkHighlights={swigCircuit.drinkHighlights}
            setDrinkHighlights={swigCircuit.setDrinkHighlights}
            onBack={handleBack}
            onContinue={handleNext}
          />
        );

      case "pairings":
        return (
          <PairingsTab
            pairings={swigCircuit.pairings}
            setPairings={swigCircuit.setPairings}
            onBack={handleBack}
            onContinue={handleNext}
          />
        );

      default:
        return (
          <Card className="p-6">
            <div className="text-center text-muted-foreground">
              This section is coming soon...
            </div>
          </Card>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <CreateSwigCircuitHeader />
        
        <div className="flex flex-col lg:flex-row gap-6">
          <StepsNavigation
            currentTab={swigCircuit.currentTab}
            setCurrentTab={swigCircuit.setCurrentTab}
            tabs={tabs}
            isTabComplete={swigCircuit.isTabComplete}
          />
          
          <div className="flex-1">
            <form onSubmit={swigCircuit.handleSubmit}>
              {renderTabContent()}
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateSwigCircuitPage;
