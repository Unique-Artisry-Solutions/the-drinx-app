
// Main hook that combines all the smaller hooks
import { useEstablishmentProfileData } from './useEstablishmentProfileData';
import { useEstablishmentPromotions } from './useEstablishmentPromotions';
import { useEstablishmentDrinks } from './useEstablishmentDrinks';
import { useEstablishmentBarCrawls } from './useEstablishmentBarCrawls';
import { useVisitorStats } from './useVisitorStats';

export const useEstablishmentProfile = () => {
  const profileState = useEstablishmentProfileData();
  const promotionsState = useEstablishmentPromotions();
  const drinksState = useEstablishmentDrinks();
  const visitorStats = useVisitorStats();
  const barCrawlsState = useEstablishmentBarCrawls();

  return {
    profileState,
    promotionsState,
    drinksState,
    visitorStats,
    barCrawlsState
  };
};
