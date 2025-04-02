
export interface MocktailSuggestion {
  id: string;
  userId: string;
  userName: string;
  establishmentId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  feedback?: string;
}

export interface DrinkIngredient {
  name: string;
  quantity: string;
}

export interface Drink {
  id: string;
  name: string;
  description: string;
  price: string;
  ingredients: string[];
  photoUrl?: string;
  isPopular?: boolean;
  isNew?: boolean;
  isSuggested?: boolean;
  suggestedBy?: string;
}
