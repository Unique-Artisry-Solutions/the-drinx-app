
import { Button } from '@/components/ui/button';
import { useBarCrawlSelection } from '@/hooks/barCrawl/useBarCrawlSelection';

interface BarCrawlControlProps {
  selectedEstablishments: string[];
  onEstablishmentToggle: (id: string) => void;
  onEstablishmentsUpdate: (establishments: string[]) => void;
}

const BarCrawlControl: React.FC<BarCrawlControlProps> = ({
  selectedEstablishments,
  onEstablishmentToggle,
  onEstablishmentsUpdate,
  // establishments, // Commented out to preserve future functionality
}) => {
  const { isLoading, selectEstablishment } = useBarCrawlSelection();

  const handleSelect = (id: string) => {
    selectEstablishment(id);
    onEstablishmentToggle(id);
  };

  const handleUpdate = () => {
    onEstablishmentsUpdate(selectedEstablishments);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Selected Establishments</h3>
        <Button onClick={handleUpdate} disabled={isLoading}>
          Update Selection
        </Button>
      </div>
      
      <div className="grid gap-2">
        {selectedEstablishments.map((id) => (
          <div key={id} className="flex items-center justify-between p-2 border rounded">
            <span>Establishment {id}</span>
            <Button size="sm" variant="outline" onClick={() => handleSelect(id)}>
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarCrawlControl;
