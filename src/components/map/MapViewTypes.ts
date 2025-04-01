
export interface Establishment {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  cocktailCount: number;
}

export interface MapViewProps {
  establishments: Establishment[];
  userLocation: { latitude: number; longitude: number } | null;
  onRefreshLocation: () => void;
  isLoadingLocation: boolean;
  singleEstablishmentView?: boolean;
  onMarkerClick?: (establishmentId: string) => void;
  height?: string;
  mapboxToken?: string;
}
