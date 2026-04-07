
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SwigCircuit, Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';

export const useSwigCircuitManagement = (swigCircuitId: string) => {
  const [swigCircuit, setSwigCircuit] = useState<SwigCircuit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [inviteeEmail, setInviteeEmail] = useState('');
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [availableEstablishments, setAvailableEstablishments] = useState<Establishment[]>([]);
  
  const { toast } = useToast();
  
  // Load the bar crawl data
  useEffect(() => {
    const loadSwigCircuit = () => {
      try {
        const swigCircuits = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
        const foundSwigCircuit = swigCircuits.find((bc: any) => bc.id === swigCircuitId);
        
        if (foundSwigCircuit) {
          setSwigCircuit(foundSwigCircuit);
          setName(foundSwigCircuit.name);
          setDescription(foundSwigCircuit.description || '');
          setStartDate(foundSwigCircuit.startDate);
          setEndDate(foundSwigCircuit.endDate);
        }
        
        // Load sample establishments that are not already in the bar crawl
        const swigCircuitEstIds = foundSwigCircuit?.establishments?.map((est: Establishment) => est.id) || [];
        const availableEsts = sampleEstablishments.filter(est => !swigCircuitEstIds.includes(est.id));
        setAvailableEstablishments(availableEsts);
      } catch (error) {
        console.error('Error loading bar crawl:', error);
        toast({
          title: 'Error',
          description: 'Failed to load bar crawl data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSwigCircuit();
  }, [swigCircuitId, toast]);

  const saveSwigCircuitChanges = () => {
    if (!swigCircuit) return;
    
    try {
      const swigCircuits = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedSwigCircuits = swigCircuits.map((bc: any) => {
        if (bc.id === swigCircuitId) {
          return {
            ...bc,
            name,
            description,
            startDate,
            endDate,
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedSwigCircuits));
      
      // Update local state
      setSwigCircuit({
        ...swigCircuit,
        name,
        description,
        startDate,
        endDate,
      });
      
      toast({
        title: 'Changes Saved',
        description: 'Your bar crawl has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving bar crawl changes:', error);
      toast({
        title: 'Error',
        description: 'Failed to save bar crawl changes',
        variant: 'destructive',
      });
    }
  };

  const addEstablishment = (establishment: Establishment) => {
    if (!swigCircuit) return;
    
    try {
      const swigCircuits = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedSwigCircuits = swigCircuits.map((bc: any) => {
        if (bc.id === swigCircuitId) {
          return {
            ...bc,
            establishments: [...bc.establishments, establishment]
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedSwigCircuits));
      
      // Update local state
      setSwigCircuit({
        ...swigCircuit,
        establishments: [...swigCircuit.establishments, establishment]
      });
      
      // Remove from available establishments
      setAvailableEstablishments(availableEstablishments.filter(est => est.id !== establishment.id));
      
      toast({
        title: 'Establishment Added',
        description: `${establishment.name} has been added to your bar crawl.`,
      });
    } catch (error) {
      console.error('Error adding establishment:', error);
      toast({
        title: 'Error',
        description: 'Failed to add establishment',
        variant: 'destructive',
      });
    }
  };

  const removeEstablishment = (establishmentId: string) => {
    if (!swigCircuit) return;
    
    try {
      const establishmentToRemove = swigCircuit.establishments.find(est => est.id === establishmentId);
      
      const swigCircuits = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedSwigCircuits = swigCircuits.map((bc: any) => {
        if (bc.id === swigCircuitId) {
          return {
            ...bc,
            establishments: bc.establishments.filter((est: any) => est.id !== establishmentId)
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedSwigCircuits));
      
      // Update local state
      setSwigCircuit({
        ...swigCircuit,
        establishments: swigCircuit.establishments.filter(est => est.id !== establishmentId)
      });
      
      // Add back to available establishments if it exists
      if (establishmentToRemove) {
        setAvailableEstablishments([...availableEstablishments, establishmentToRemove]);
      }
      
      toast({
        title: 'Establishment Removed',
        description: 'The establishment has been removed from your bar crawl.',
      });
    } catch (error) {
      console.error('Error removing establishment:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove establishment',
        variant: 'destructive',
      });
    }
  };

  const inviteUser = () => {
    if (!inviteeEmail || !swigCircuit) return;
    
    // In a real app, this would send an email invitation
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${inviteeEmail}`,
    });
    
    setInviteeEmail('');
    setShowInviteForm(false);
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/swig-circuit/${swigCircuitId}`;
    navigator.clipboard.writeText(shareLink);
    
    toast({
      title: 'Link Copied',
      description: 'Share link has been copied to clipboard',
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareLink = `${window.location.origin}/swig-circuit/${swigCircuitId}`;
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(`Join my bar crawl: ${name}`)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL, so we'll just copy the link
        navigator.clipboard.writeText(shareLink);
        toast({
          title: 'Link Copied',
          description: 'Share on Instagram by pasting this link in your post or bio',
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  return {
    swigCircuit,
    isLoading,
    name,
    setName,
    description,
    setDescription,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    inviteeEmail,
    setInviteeEmail,
    showInviteForm,
    setShowInviteForm,
    availableEstablishments,
    saveSwigCircuitChanges,
    addEstablishment,
    removeEstablishment,
    inviteUser,
    copyShareLink,
    shareToSocialMedia
  };
};
