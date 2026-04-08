
import React from 'react';

export interface DrinkHighlight {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
}

export interface DrinkHighlightsProps {
  drinkHighlights: DrinkHighlight[];
  onHighlightsChange?: (highlights: DrinkHighlight[]) => void;
}

const DrinkHighlights: React.FC<DrinkHighlightsProps> = ({ drinkHighlights, onHighlightsChange }) => {
  if (!drinkHighlights || drinkHighlights.length === 0) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No featured drinks available for this Swig Circuit.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {drinkHighlights.map((drink) => (
        <div key={drink.id} className="bg-white rounded-lg overflow-hidden shadow-sm border">
          {drink.image_url && (
            <img 
              src={drink.image_url} 
              alt={drink.name} 
              className="w-full h-32 object-cover"
            />
          )}
          <div className="p-4">
            <h3 className="font-medium text-lg">{drink.name}</h3>
            {drink.description && (
              <p className="text-gray-600 text-sm mt-1">{drink.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DrinkHighlights;
