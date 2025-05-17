
import { useState, useCallback } from 'react';
import { FeatureItem } from '../types';
import { Release, ReleaseSortField, ReleaseSortOrder, ReleaseFeature, ReleaseStatus, ReleaseNote } from '../types/releaseTypes';
import { releasesData } from '../data/releasesData';
import { mapFeaturesToReleaseFeatures } from '../utils/releaseUtils';
import { useToast } from '@/components/ui/use-toast';
import { format, addMonths } from 'date-fns';

export const useReleaseManagement = () => {
  const { toast } = useToast();
  const [releases, setReleases] = useState<Release[]>(releasesData);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>(
    releases.length > 0 ? releases[0].id : ''
  );
  const [sortField, setSortField] = useState<ReleaseSortField>('version');
  const [sortOrder, setSortOrder] = useState<ReleaseSortOrder>('desc');
  const [filter, setFilter] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | 'all'>('all');
  const [dateFormat, setDateFormat] = useState<string>('yyyy-MM-dd');

  // Get the selected release
  const selectedRelease = releases.find(release => release.id === selectedReleaseId) || releases[0];

  // Calculate release progress
  const calculateReleaseProgress = (release: Release) => {
    const totalFeatures = release.features.length;
    if (totalFeatures === 0) return { percentComplete: 0, completedFeatures: 0, totalFeatures: 0 };
    
    const completedFeatures = release.features.filter(f => f.status === 'completed').length;
    return {
      percentComplete: Math.round((completedFeatures / totalFeatures) * 100),
      completedFeatures,
      totalFeatures
    };
  };

  // Filter and sort releases
  const sortedAndFilteredReleases = [...releases]
    .filter(release => {
      // Filter by search text
      const textMatch = !filter || 
        release.name.toLowerCase().includes(filter.toLowerCase()) ||
        release.description.toLowerCase().includes(filter.toLowerCase());
      
      // Filter by status
      const statusMatch = filterStatus === 'all' || release.status === filterStatus;
      
      return textMatch && statusMatch;
    })
    .sort((a, b) => {
      // Handle sorting by date fields
      if (sortField === 'plannedReleaseDate') {
        const dateA = a.plannedReleaseDate ? new Date(a.plannedReleaseDate) : new Date(0);
        const dateB = b.plannedReleaseDate ? new Date(b.plannedReleaseDate) : new Date(0);
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

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return format(new Date(dateString), dateFormat);
  };
  
  // Get next version number
  const getNextVersionNumber = () => {
    const versions = releases.map(r => r.version);
    const majorVersions = versions
      .map(v => parseInt(v.split('.')[0], 10))
      .filter(v => !isNaN(v));
    
    const nextMajor = majorVersions.length > 0 ? Math.max(...majorVersions) + 1 : 1;
    return `${nextMajor}.0.0`;
  };

  // Create a new release
  const createRelease = useCallback((releaseData: Partial<Release>) => {
    const newRelease: Release = {
      id: `release-${Date.now()}`,
      name: releaseData.name || 'New Release',
      version: releaseData.version || getNextVersionNumber(),
      type: releaseData.type || 'minor',
      status: releaseData.status || 'planned',
      plannedReleaseDate: releaseData.plannedReleaseDate || addMonths(new Date(), 1).toISOString(),
      description: releaseData.description || '',
      features: releaseData.features || [],
      releaseNotes: releaseData.releaseNotes || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: releaseData.tags || []
    };
    
    setReleases(prev => [...prev, newRelease]);
    setSelectedReleaseId(newRelease.id);
    
    return newRelease;
  }, []);
  
  // Create a release from features
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
    const releaseName = `Release ${format(today, 'yyyy-MM-dd')}`;
    const releaseDate = addMonths(today, 1).toISOString();
    
    // Map features to release features
    const releaseFeatures = mapFeaturesToReleaseFeatures(implementedFeatures, releaseDate);
    
    // Generate release notes from features
    const releaseNotes = implementedFeatures.map(feature => ({
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'feature' as const,
      title: feature.name,
      description: feature.description,
      userFacing: true,
      author: 'System',
      createdAt: new Date().toISOString()
    }));
    
    // Create the new release
    const newRelease = createRelease({
      name: releaseName,
      version: getNextVersionNumber(),
      type: 'minor',
      plannedReleaseDate: releaseDate,
      description: `Automated release containing ${implementedFeatures.length} implemented features`,
      status: 'planned',
      features: releaseFeatures,
      releaseNotes: releaseNotes,
      tags: ['auto-generated']
    });
    
    toast({
      title: "Release Created",
      description: `Created release ${newRelease.name} with ${implementedFeatures.length} features`,
    });
    
    // Return to caller
    return newRelease;
  }, [createRelease, toast]);

  // Update a release
  const updateRelease = useCallback((id: string, releaseData: Partial<Release>) => {
    setReleases(prev => prev.map(release => {
      if (release.id === id) {
        return { 
          ...release, 
          ...releaseData,
          updatedAt: new Date().toISOString()
        };
      }
      return release;
    }));
  }, []);
  
  // Update release status
  const updateReleaseStatus = useCallback((id: string, status: ReleaseStatus) => {
    updateRelease(id, { status });
    
    toast({
      title: "Release Status Updated",
      description: `Release status changed to ${status}`,
    });
  }, [updateRelease, toast]);

  // Add feature to release
  const addFeatureToRelease = useCallback((releaseId: string, feature: ReleaseFeature) => {
    setReleases(prev => prev.map(release => {
      if (release.id === releaseId) {
        return {
          ...release,
          features: [...release.features, feature],
          updatedAt: new Date().toISOString()
        };
      }
      return release;
    }));
  }, []);
  
  // Update feature in release
  const updateFeatureInRelease = useCallback((releaseId: string, featureId: string, updatedFeature: Partial<ReleaseFeature>) => {
    setReleases(prev => prev.map(release => {
      if (release.id === releaseId) {
        return {
          ...release,
          features: release.features.map(feature => 
            feature.id === featureId ? { ...feature, ...updatedFeature } : feature
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return release;
    }));
  }, []);
  
  // Remove feature from release
  const removeFeatureFromRelease = useCallback((releaseId: string, featureId: string) => {
    setReleases(prev => prev.map(release => {
      if (release.id === releaseId) {
        return {
          ...release,
          features: release.features.filter(feature => feature.id !== featureId),
          updatedAt: new Date().toISOString()
        };
      }
      return release;
    }));
  }, []);
  
  // Add release note
  const addReleaseNote = useCallback((releaseId: string, note: ReleaseNote) => {
    setReleases(prev => prev.map(release => {
      if (release.id === releaseId) {
        return {
          ...release,
          releaseNotes: [...release.releaseNotes, note],
          updatedAt: new Date().toISOString()
        };
      }
      return release;
    }));
  }, []);
  
  // Update release note
  const updateReleaseNote = useCallback((releaseId: string, noteId: string, updatedNote: Partial<ReleaseNote>) => {
    setReleases(prev => prev.map(release => {
      if (release.id === releaseId) {
        return {
          ...release,
          releaseNotes: release.releaseNotes.map(note => 
            note.id === noteId ? { ...note, ...updatedNote } : note
          ),
          updatedAt: new Date().toISOString()
        };
      }
      return release;
    }));
  }, []);
  
  // Remove release note
  const removeReleaseNote = useCallback((releaseId: string, noteId: string) => {
    setReleases(prev => prev.map(release => {
      if (release.id === releaseId) {
        return {
          ...release,
          releaseNotes: release.releaseNotes.filter(note => note.id !== noteId),
          updatedAt: new Date().toISOString()
        };
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
  
  // Generate release notes from features
  const generateReleaseNotesFromFeatures = useCallback((releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;
    
    // Generate notes based on features
    const newNotes = release.features.map(feature => ({
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'feature' as const,
      title: feature.name,
      description: feature.description || 'New feature added',
      userFacing: true,
      author: 'System',
      createdAt: new Date().toISOString()
    }));
    
    // Update release with new notes
    updateRelease(releaseId, {
      releaseNotes: [...release.releaseNotes, ...newNotes]
    });
    
    toast({
      title: "Release Notes Generated",
      description: `Added ${newNotes.length} notes based on features`,
    });
  }, [releases, updateRelease, toast]);
  
  // Export release notes as markdown
  const exportReleaseNotesAsMarkdown = useCallback((releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;
    
    const featuresList = release.features.map(f => `- ${f.name}: ${f.description || 'No description'}`).join('\n');
    const notesList = release.releaseNotes.map(n => `- ${n.title}: ${n.description || 'No description'}`).join('\n');
    
    const markdown = `# ${release.name} (${release.version})
Released: ${release.actualReleaseDate ? formatDate(release.actualReleaseDate) : 'Planned: ' + formatDate(release.plannedReleaseDate)}
Status: ${release.status}

${release.description}

## Features
${featuresList}

## Release Notes
${notesList}
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
  }, [releases, formatDate]);

  // Compute release progress for each release
  const releaseProgress = releases.map(release => ({
    id: release.id,
    version: release.version,
    ...calculateReleaseProgress(release)
  }));

  return {
    releases,
    sortedAndFilteredReleases,
    selectedRelease,
    selectedReleaseId,
    sortField,
    sortOrder,
    filter,
    filterStatus,
    dateFormat,
    releaseProgress,
    setSelectedReleaseId,
    setSortField,
    setSortOrder,
    setFilter,
    setFilterStatus,
    setDateFormat,
    createRelease,
    updateRelease,
    updateReleaseStatus,
    deleteRelease,
    createReleaseFromFeatures,
    addFeatureToRelease,
    updateFeatureInRelease,
    removeFeatureFromRelease,
    addReleaseNote,
    updateReleaseNote,
    removeReleaseNote,
    generateReleaseNotesFromFeatures,
    exportReleaseNotesAsMarkdown,
    formatDate,
    getNextVersionNumber
  };
};
