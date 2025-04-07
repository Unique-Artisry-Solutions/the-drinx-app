
import { Establishment } from '@/types/ProfileTypes';
import { DrinkHighlight } from '@/components/barCrawl/DrinkHighlights';
import { Pairing } from '@/components/barCrawl/PairingOptions';

export interface SwigCircuitFormState {
  name: string;
  startDate: string;
  endDate: string;
  description: string;
  imageFile: File | null;
  previewUrl: string;
  currentTab: string;
  selectedTheme: string;
  maxDistance: number;
  drinkHighlights: DrinkHighlight[];
  pairings: Pairing[];
  selectedEstablishments: Establishment[];
}

export interface UseSwigCircuitCreationReturn extends SwigCircuitFormState {
  setName: (name: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setDescription: (description: string) => void;
  setImageFile: (file: File | null) => void;
  setPreviewUrl: (url: string) => void;
  setCurrentTab: (tab: string) => void;
  setSelectedTheme: (theme: string) => void;
  setMaxDistance: (distance: number) => void;
  setDrinkHighlights: (highlights: DrinkHighlight[]) => void;
  setPairings: (pairings: Pairing[]) => void;
  setSelectedEstablishments: (establishments: Establishment[]) => void;
  handleSaveEstablishments: (establishments: Establishment[]) => void;
  isTabComplete: (tabName: string) => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
}
