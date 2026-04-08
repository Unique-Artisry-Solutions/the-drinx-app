
import { Establishment } from '@/types/ProfileTypes';
import { DrinkHighlight } from '@/components/swigCircuit/DrinkHighlights';
import { Pairing } from '@/components/swigCircuit/PairingOptions';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  description: string;
  limit?: number;
  benefits: string[];
  isVip?: boolean;
  vipPerks?: {
    skipLines?: boolean;
    prioritySeating?: boolean;
    freeDrinks?: number;
    exclusiveAccess?: boolean;
    merchandise?: boolean;
    meetAndGreet?: boolean;
    customPerks?: string[];
  };
}

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
  ticketTiers: TicketTier[];
  projectedAttendance: number;
  projectedRevenue: number;
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
  addTicketTier: (tier: TicketTier) => void;
  updateTicketTier: (index: number, tier: TicketTier) => void;
  removeTicketTier: (index: number) => void;
  setTicketTiers: (tiers: TicketTier[]) => void;
  setProjectedAttendance: (attendance: number) => void;
  setProjectedRevenue: (revenue: number) => void;
  isTabComplete: (tabName: string) => boolean;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isSubmitting: boolean;
  calculateProjections: () => void;
}
