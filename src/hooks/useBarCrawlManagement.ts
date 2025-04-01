
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { BarCrawl, Establishment } from '@/types/ProfileTypes';
import { sampleEstablishments } from '@/data/sampleData';

export const useBarCrawlManagement = (barCrawlId: string) => {
  const [barCrawl, setBarCrawl] = useState<BarCrawl | null>(null);
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
    const loadBarCrawl = () => {
      try {
        const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
        const foundBarCrawl = barCrawls.find((bc: any) => bc.id === barCrawlId);
        
        if (foundBarCrawl) {
          setBarCrawl(foundBarCrawl);
          setName(foundBarCrawl.name);
          setDescription(foundBarCrawl.description || '');
          setStartDate(foundBarCrawl.startDate);
          setEndDate(foundBarCrawl.endDate);
        }
        
        // Load sample establishments that are not already in the bar crawl
        const barCrawlEstIds = foundBarCrawl?.establishments?.map((est: Establishment) => est.id) || [];
        const availableEsts = sampleEstablishments.filter(est => !barCrawlEstIds.includes(est.id));
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
    
    loadBarCrawl();
  }, [barCrawlId, toast]);

  const saveBarCrawlChanges = () => {
    if (!barCrawl) return;
    
    try {
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedBarCrawls = barCrawls.map((bc: any) => {
        if (bc.id === barCrawlId) {
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
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      
      // Update local state
      setBarCrawl({
        ...barCrawl,
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
    if (!barCrawl) return;
    
    try {
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedBarCrawls = barCrawls.map((bc: any) => {
        if (bc.id === barCrawlId) {
          return {
            ...bc,
            establishments: [...bc.establishments, establishment]
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      
      // Update local state
      setBarCrawl({
        ...barCrawl,
        establishments: [...barCrawl.establishments, establishment]
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
    if (!barCrawl) return;
    
    try {
      const establishmentToRemove = barCrawl.establishments.find(est => est.id === establishmentId);
      
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const updatedBarCrawls = barCrawls.map((bc: any) => {
        if (bc.id === barCrawlId) {
          return {
            ...bc,
            establishments: bc.establishments.filter((est: any) => est.id !== establishmentId)
          };
        }
        return bc;
      });
      
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      
      // Update local state
      setBarCrawl({
        ...barCrawl,
        establishments: barCrawl.establishments.filter(est => est.id !== establishmentId)
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
    if (!inviteeEmail || !barCrawl) return;
    
    // In a real app, this would send an email invitation
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${inviteeEmail}`,
    });
    
    setInviteeEmail('');
    setShowInviteForm(false);
  };

  const copyShareLink = () => {
    const shareLink = `${window.location.origin}/bar-crawl/${barCrawlId}`;
    navigator.clipboard.writeText(shareLink);
    
    toast({
      title: 'Link Copied',
      description: 'Share link has been copied to clipboard',
    });
  };

  const shareToSocialMedia = (platform: string) => {
    const shareLink = `${window.location.origin}/bar-crawl/${barCrawlId}`;
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
    barCrawl,
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
    saveBarCrawlChanges,
    addEstablishment,
    removeEstablishment,
    inviteUser,
    copyShareLink,
    shareToSocialMedia
  };
};
