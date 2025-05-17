
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DesktopLayout from '@/components/layout/DesktopLayout';
import { supabase } from '@/lib/supabase';

const EstablishmentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEstablishment = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('establishments')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        setEstablishment(data);
      } catch (error) {
        console.error('Error fetching establishment:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstablishment();
  }, [id]);

  if (loading) {
    return (
      <DesktopLayout>
        <div className="container mx-auto p-4">
          <p>Loading establishment details...</p>
        </div>
      </DesktopLayout>
    );
  }

  if (!establishment) {
    return (
      <DesktopLayout>
        <div className="container mx-auto p-4">
          <p>Establishment not found</p>
        </div>
      </DesktopLayout>
    );
  }

  return (
    <DesktopLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{establishment.name}</h1>
        <div className="grid gap-4">
          <div>
            <h2 className="text-xl font-semibold">Location</h2>
            <p>{establishment.address}</p>
          </div>
          {establishment.phone && (
            <div>
              <h2 className="text-xl font-semibold">Contact</h2>
              <p>{establishment.phone}</p>
            </div>
          )}
          {establishment.website && (
            <div>
              <h2 className="text-xl font-semibold">Website</h2>
              <p>
                <a 
                  href={establishment.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {establishment.website}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </DesktopLayout>
  );
};

export default EstablishmentPage;
