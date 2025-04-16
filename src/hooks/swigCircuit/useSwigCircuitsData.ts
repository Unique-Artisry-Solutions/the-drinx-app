
import { useState, useEffect } from 'react';
import { sampleBarCrawls, sampleEstablishments } from '@/data/sampleData';

export const useSwigCircuitsData = () => {
  const [circuits, setCircuits] = useState<any[]>([]);
  const [filteredCircuits, setFilteredCircuits] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

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

  return {
    circuits,
    filteredCircuits,
    searchTerm,
    isLoading,
    handleSearch,
    filterByCategory
  };
};

export default useSwigCircuitsData;
