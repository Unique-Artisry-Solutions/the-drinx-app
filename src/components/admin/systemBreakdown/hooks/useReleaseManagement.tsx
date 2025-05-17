
import { useState, useCallback } from 'react';
import { Release, ReleaseSortField, ReleaseSortOrder, FeatureItem } from '../types';
import { releasesData } from '../data/releasesData';
import { mapFeaturesToReleaseFeatures } from '../utils/releaseUtils';
import { useToast } from '@/components/ui/use-toast';

export const useReleaseManagement = () => {
  const { toast } = useToast();
  const [releases, setReleases] = useState<Release[]>(releasesData);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(
    releases.length > 0 ? releases[0].id : ''
  );
  const [sortField, setSortField] = useState<ReleaseSortField>('releaseDate');
  const [sortOrder, setSortOrder] = useState<ReleaseSortOrder>('desc');
  const [filter, setFilter] = useState<string>('');

  // Get the selected release
  const selectedRelease = releases.find(release => release.id === selectedReleaseId) || releases[0];

  // Filter and sort releases
  const sortedAndFilteredReleases = [...releases]
    .filter(release => {
      if (!filter) return true;
      return (
        release.name.toLowerCase().includes(filter.toLowerCase()) ||
        release.description.toLowerCase().includes(filter.toLowerCase())
      );
    })
    .sort((a, b) => {
      // Handle sorting
      if (sortField === 'releaseDate') {
        const dateA = new Date(a.releaseDate);
        const dateB = new Date(b.releaseDate);
        return sortOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      }
      
      // Handle other sort fields
      const valueA = a[sortField];
      const valueB = b[sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
      
      return 0;
    });

  // Create a new release
  const createRelease = useCallback((releaseData: Partial<Release>) => {
    const newRelease: Release = {
      id: `release-${Date.now()}`,
      name: releaseData.name || 'New Release',
      version: releaseData.version || '1.0.0',
      releaseDate: releaseData.releaseDate || new Date().toISOString(),
      description: releaseData.description || '',
      status: releaseData.status || 'draft',
      features: releaseData.features || [],
      notes: releaseData.notes || '',
      author: releaseData.author || 'System',
      tags: releaseData.tags || []
    };
    
    setReleases(prev => [...prev, newRelease]);
    setSelectedReleaseId(newRelease.id);
    
    return newRelease;
  }, []);
  
  // Create a release from features - add the missing function
  const createReleaseFromFeatures = useCallback((features: FeatureItem[]) => {
    // Filter only implemented features
    const implementedFeatures = features.filter(f => f.status === 'implemented');
    
    if (implementedFeatures.length === 0) {
      toast({
        title: "No implemented features",
        description: "There are no implemented features to create a release from.",
        variant: "destructive"
      });
      return;
    }
    
    // Create a release name based on the current date
    const today = new Date();
    const releaseName = `Release ${today.toISOString().split('T')[0]}`;
    const releaseVersion = `1.0.${releases.length}`;
    
    // Map features to release features
    const releaseFeatures = mapFeaturesToReleaseFeatures(implementedFeatures);
    
    // Create the new release
    const newRelease = createRelease({
      name: releaseName,
      version: releaseVersion,
      releaseDate: today.toISOString(),
      description: `Automated release containing ${implementedFeatures.length} implemented features`,
      status: 'planned',
      features: releaseFeatures,
      notes: `This release was automatically generated from ${implementedFeatures.length} implemented features.`,
      tags: ['auto-generated']
    });
    
    toast({
      title: "Release Created",
      description: `Created release ${newRelease.name} with ${implementedFeatures.length} features`,
    });
    
    // Return to caller
    return newRelease;
  }, [createRelease, releases.length, toast]);

  // Update a release
  const updateRelease = useCallback((id: string, releaseData: Partial<Release>) => {
    setReleases(prev => prev.map(release => {
      if (release.id === id) {
        return { ...release, ...releaseData };
      }
      return release;
    }));
  }, []);

  // Delete a release
  const deleteRelease = useCallback((id: string) => {
    setReleases(prev => prev.filter(release => release.id !== id));
    
    // If the deleted release was selected, select the first release
    if (id === selectedReleaseId) {
      setSelectedReleaseId(releases[0]?.id || '');
    }
  }, [releases, selectedReleaseId]);
  
  // Export release notes as markdown
  const exportReleaseNotesAsMarkdown = useCallback((releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;
    
    const featuresList = release.features.map(f => `- ${f.name}: ${f.description}`).join('\n');
    
    const markdown = `# ${release.name} (${release.version})
Released: ${new Date(release.releaseDate).toLocaleDateString()}
Status: ${release.status}

${release.description}

## Features
${featuresList}

## Release Notes
${release.notes}
`;

    // Create a blob and download
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${release.name}-release-notes.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [releases]);

  return {
    releases,
    sortedAndFilteredReleases,
    selectedRelease,
    selectedReleaseId,
    sortField,
    sortOrder,
    filter,
    setSelectedReleaseId,
    setSortField,
    setSortOrder,
    setFilter,
    createRelease,
    updateRelease,
    deleteRelease,
    createReleaseFromFeatures,
    exportReleaseNotesAsMarkdown
  };
};
