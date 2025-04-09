
import { useState, useMemo, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { format, addDays, parseISO, isValid, formatISO } from 'date-fns';
import { 
  Release, 
  ReleaseStatus,
  ReleaseSortField, 
  ReleaseSortOrder, 
  ReleaseFeature,
  ReleaseNote,
  ReleaseProgress
} from '../types/releaseTypes';
import { sampleReleases } from '../data/releasesData';
import { v4 as uuidv4 } from 'uuid';

export const useReleaseManagement = () => {
  const { toast } = useToast();
  const [releases, setReleases] = useState<Release[]>(sampleReleases);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<ReleaseSortField>('version');
  const [sortOrder, setSortOrder] = useState<ReleaseSortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | 'all'>('all');
  const [dateFormat, setDateFormat] = useState<string>('yyyy-MM-dd');

  // Get selected release
  const selectedRelease = useMemo(() => {
    return releases.find(release => release.id === selectedReleaseId);
  }, [releases, selectedReleaseId]);

  // Calculate release progress
  const releaseProgress = useMemo((): ReleaseProgress | null => {
    if (!selectedRelease) return null;
    
    const totalFeatures = selectedRelease.features.length;
    const completedFeatures = selectedRelease.features.filter(f => f.status === 'completed').length;
    const inProgressFeatures = selectedRelease.features.filter(f => f.status === 'in_progress').length;
    const pendingFeatures = selectedRelease.features.filter(f => f.status === 'pending').length;
    const deferredFeatures = selectedRelease.features.filter(f => f.status === 'deferred').length;
    
    const percentComplete = totalFeatures > 0 
      ? Math.round((completedFeatures / totalFeatures) * 100) 
      : 0;
    
    return {
      totalFeatures,
      completedFeatures,
      inProgressFeatures,
      pendingFeatures,
      deferredFeatures,
      percentComplete
    };
  }, [selectedRelease]);

  // Format date according to the selected format
  const formatDate = useCallback((dateString?: string): string => {
    if (!dateString) return 'Not scheduled';
    
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, dateFormat) : 'Invalid date';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  }, [dateFormat]);

  // Sort and filter releases
  const sortedAndFilteredReleases = useMemo(() => {
    let filteredReleases = [...releases];
    
    // Apply status filter
    if (filterStatus !== 'all') {
      filteredReleases = filteredReleases.filter(release => release.status === filterStatus);
    }
    
    // Sort releases
    return filteredReleases.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'version':
          // Split version strings into parts and compare
          const aParts = a.version.split('.').map(Number);
          const bParts = b.version.split('.').map(Number);
          
          for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = i < aParts.length ? aParts[i] : 0;
            const bPart = i < bParts.length ? bParts[i] : 0;
            
            if (aPart !== bPart) {
              comparison = aPart - bPart;
              break;
            }
          }
          break;
          
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
          
        case 'status':
          // Custom status ordering: planned -> in_development -> ready_for_qa -> in_qa -> ready_for_release -> released
          const statusOrder: Record<ReleaseStatus, number> = {
            'planned': 1,
            'in_development': 2,
            'ready_for_qa': 3,
            'in_qa': 4,
            'ready_for_release': 5,
            'released': 6
          };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
          
        case 'plannedReleaseDate':
          const aDate = a.plannedReleaseDate ? new Date(a.plannedReleaseDate).getTime() : 0;
          const bDate = b.plannedReleaseDate ? new Date(b.plannedReleaseDate).getTime() : 0;
          comparison = aDate - bDate;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [releases, sortField, sortOrder, filterStatus]);

  // Get next version number based on current releases and release type
  const getNextVersionNumber = useCallback((releaseType: 'major' | 'minor' | 'patch'): string => {
    if (releases.length === 0) return '1.0.0';
    
    const latestVersion = releases
      .map(r => r.version)
      .sort((a, b) => {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = i < aParts.length ? aParts[i] : 0;
          const bPart = i < bParts.length ? bParts[i] : 0;
          
          if (aPart !== bPart) {
            return bPart - aPart; // Descending order
          }
        }
        return 0;
      })[0];
    
    const [major, minor, patch] = latestVersion.split('.').map(Number);
    
    switch (releaseType) {
      case 'major':
        return `${major + 1}.0.0`;
      case 'minor':
        return `${major}.${minor + 1}.0`;
      case 'patch':
        return `${major}.${minor}.${patch + 1}`;
    }
  }, [releases]);

  // Create a new release
  const createRelease = useCallback((newRelease: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = `release-${uuidv4().slice(0, 8)}`;
    
    const release: Release = {
      ...newRelease,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    setReleases(prev => [...prev, release]);
    toast({
      title: "Release Created",
      description: `Version ${newRelease.version} has been created successfully.`
    });
    return id;
  }, [toast]);

  // Update an existing release
  const updateRelease = useCallback((id: string, updatedData: Partial<Release>) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === id
          ? { 
              ...release, 
              ...updatedData, 
              updatedAt: new Date().toISOString() 
            }
          : release
      )
    );
    
    toast({
      title: "Release Updated",
      description: `Changes to the release have been saved.`
    });
  }, [toast]);

  // Delete a release
  const deleteRelease = useCallback((id: string) => {
    setReleases(prev => prev.filter(release => release.id !== id));
    if (selectedReleaseId === id) {
      setSelectedReleaseId(null);
    }
    
    toast({
      title: "Release Deleted",
      description: `The release has been removed.`
    });
  }, [selectedReleaseId, toast]);

  // Update release status with automatic date updates
  const updateReleaseStatus = useCallback((id: string, status: ReleaseStatus) => {
    setReleases(prev => 
      prev.map(release => {
        if (release.id !== id) return release;
        
        // Handle date updates based on status changes
        let updatedRelease = { ...release, status, updatedAt: new Date().toISOString() };
        
        // If status is changing to released and no actual release date is set
        if (status === 'released' && !release.actualReleaseDate) {
          updatedRelease.actualReleaseDate = new Date().toISOString().split('T')[0];
        }
        
        // If status is changing to ready_for_release and no planned date is set, suggest one in 7 days
        if (status === 'ready_for_release' && !release.plannedReleaseDate) {
          const suggestedDate = addDays(new Date(), 7);
          updatedRelease.plannedReleaseDate = formatISO(suggestedDate, { representation: 'date' });
        }
        
        return updatedRelease;
      })
    );
    
    toast({
      title: "Status Updated",
      description: `Release status changed to ${status.replace(/_/g, ' ')}.`
    });
  }, [toast]);

  // Add feature to release
  const addFeatureToRelease = useCallback((releaseId: string, feature: Omit<ReleaseFeature, 'id'>) => {
    const featureId = `feature-${uuidv4().slice(0, 8)}`;
    
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              features: [...release.features, { id: featureId, ...feature }],
              updatedAt: new Date().toISOString()
            }
          : release
      )
    );
    
    toast({
      title: "Feature Added",
      description: `"${feature.name}" has been added to the release.`
    });
  }, [toast]);

  // Update feature in release
  const updateFeatureInRelease = useCallback((releaseId: string, featureId: string, updatedData: Partial<ReleaseFeature>) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              features: release.features.map(feature => 
                feature.id === featureId
                  ? { ...feature, ...updatedData }
                  : feature
              ),
              updatedAt: new Date().toISOString()
            }
          : release
      )
    );
    
    toast({
      title: "Feature Updated",
      description: `Feature changes have been saved.`
    });
  }, [toast]);

  // Remove feature from release
  const removeFeatureFromRelease = useCallback((releaseId: string, featureId: string) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              features: release.features.filter(feature => feature.id !== featureId),
              updatedAt: new Date().toISOString()
            }
          : release
      )
    );
    
    toast({
      title: "Feature Removed",
      description: `Feature has been removed from the release.`
    });
  }, [toast]);

  // Add release note
  const addReleaseNote = useCallback((releaseId: string, note: ReleaseNote) => {
    const now = new Date().toISOString();
    const noteWithTimestamp = {
      ...note,
      createdAt: now
    };
    
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              releaseNotes: [...release.releaseNotes, noteWithTimestamp],
              updatedAt: now
            }
          : release
      )
    );
    
    toast({
      title: "Release Note Added",
      description: `"${note.title}" has been added to the release notes.`
    });
  }, [toast]);

  // Update release note
  const updateReleaseNote = useCallback((releaseId: string, index: number, updatedNote: ReleaseNote) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              releaseNotes: release.releaseNotes.map((note, i) => 
                i === index ? updatedNote : note
              ),
              updatedAt: new Date().toISOString()
            }
          : release
      )
    );
    
    toast({
      title: "Release Note Updated",
      description: `Release note has been updated.`
    });
  }, [toast]);

  // Remove release note
  const removeReleaseNote = useCallback((releaseId: string, index: number) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              releaseNotes: release.releaseNotes.filter((_, i) => i !== index),
              updatedAt: new Date().toISOString()
            }
          : release
      )
    );
    
    toast({
      title: "Release Note Removed",
      description: `Release note has been removed.`
    });
  }, [toast]);

  // Generate release notes from features
  const generateReleaseNotesFromFeatures = useCallback((releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;
    
    const now = new Date().toISOString();
    const newNotes: ReleaseNote[] = release.features
      .filter(feature => feature.status === 'completed')
      .map(feature => ({
        type: 'feature',
        title: feature.name,
        description: feature.description,
        userFacing: true,
        createdAt: now
      }));
    
    if (newNotes.length > 0) {
      setReleases(prev => 
        prev.map(r => 
          r.id === releaseId
            ? { 
                ...r, 
                releaseNotes: [...r.releaseNotes, ...newNotes],
                updatedAt: now
              }
            : r
        )
      );
      
      toast({
        title: "Release Notes Generated",
        description: `${newNotes.length} notes created from completed features.`
      });
    } else {
      toast({
        title: "No Release Notes Generated",
        description: "No completed features found to generate notes from."
      });
    }
  }, [releases, toast]);

  // Export release notes as markdown
  const exportReleaseNotesAsMarkdown = useCallback((releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;
    
    let markdown = `# Release Notes: ${release.name} (v${release.version})\n\n`;
    
    if (release.description) {
      markdown += `${release.description}\n\n`;
    }
    
    if (release.releaseNotes.length > 0) {
      const userFacingNotes = release.releaseNotes.filter(note => note.userFacing);
      if (userFacingNotes.length > 0) {
        markdown += `## New Features and Improvements\n\n`;
        
        ['feature', 'improvement', 'bugfix', 'security', 'other'].forEach(type => {
          const notesOfType = userFacingNotes.filter(note => note.type === type);
          
          if (notesOfType.length > 0) {
            markdown += `### ${type.charAt(0).toUpperCase() + type.slice(1)}s\n\n`;
            
            notesOfType.forEach(note => {
              markdown += `- **${note.title}**: ${note.description}\n`;
            });
            
            markdown += '\n';
          }
        });
      }
      
      // Technical notes section
      const technicalNotes = release.releaseNotes.filter(note => !note.userFacing || note.technicalDetails);
      if (technicalNotes.length > 0) {
        markdown += `## Technical Details\n\n`;
        
        technicalNotes.forEach(note => {
          markdown += `- **${note.title}**: ${note.technicalDetails || note.description}\n`;
        });
      }
    }
    
    // Add release metadata
    markdown += `\n## Release Information\n\n`;
    markdown += `- **Version:** ${release.version}\n`;
    markdown += `- **Type:** ${release.type}\n`;
    markdown += `- **Status:** ${release.status.replace(/_/g, ' ')}\n`;
    
    if (release.plannedReleaseDate) {
      markdown += `- **Planned Release Date:** ${formatDate(release.plannedReleaseDate)}\n`;
    }
    
    if (release.actualReleaseDate) {
      markdown += `- **Actual Release Date:** ${formatDate(release.actualReleaseDate)}\n`;
    }
    
    if (release.releaseBranch) {
      markdown += `- **Release Branch:** ${release.releaseBranch}\n`;
    }
    
    // Feature summary
    if (release.features.length > 0) {
      markdown += `\n## Feature Summary\n\n`;
      markdown += `| Feature | Status | Description |\n`;
      markdown += `| --- | --- | --- |\n`;
      
      release.features.forEach(feature => {
        markdown += `| ${feature.name} | ${feature.status} | ${feature.description} |\n`;
      });
    }
    
    // Download as file
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `release-notes-v${release.version.replace(/\./g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Release Notes Exported",
      description: `Markdown file has been downloaded.`
    });
  }, [releases, formatDate, toast]);

  return {
    releases,
    sortedAndFilteredReleases,
    selectedRelease,
    selectedReleaseId,
    sortField,
    sortOrder,
    filterStatus,
    releaseProgress,
    dateFormat,
    formatDate,
    setSelectedReleaseId,
    setSortField,
    setSortOrder,
    setFilterStatus,
    setDateFormat,
    getNextVersionNumber,
    createRelease,
    updateRelease,
    deleteRelease,
    updateReleaseStatus,
    addFeatureToRelease,
    updateFeatureInRelease,
    removeFeatureFromRelease,
    addReleaseNote,
    updateReleaseNote,
    removeReleaseNote,
    generateReleaseNotesFromFeatures,
    exportReleaseNotesAsMarkdown
  };
};
