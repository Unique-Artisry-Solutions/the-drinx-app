
import { useState, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  Release, 
  ReleaseStatus,
  ReleaseSortField, 
  ReleaseSortOrder, 
  ReleaseFeature,
  ReleaseNote
} from '../types/releaseTypes';
import { sampleReleases } from '../data/releasesData';

export const useReleaseManagement = () => {
  const { toast } = useToast();
  const [releases, setReleases] = useState<Release[]>(sampleReleases);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<ReleaseSortField>('version');
  const [sortOrder, setSortOrder] = useState<ReleaseSortOrder>('desc');
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | 'all'>('all');

  // Get selected release
  const selectedRelease = useMemo(() => {
    return releases.find(release => release.id === selectedReleaseId);
  }, [releases, selectedReleaseId]);

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

  // Create a new release
  const createRelease = (newRelease: Omit<Release, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const id = `release-${releases.length + 1}`;
    
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
  };

  // Update an existing release
  const updateRelease = (id: string, updatedData: Partial<Release>) => {
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
  };

  // Delete a release
  const deleteRelease = (id: string) => {
    setReleases(prev => prev.filter(release => release.id !== id));
    if (selectedReleaseId === id) {
      setSelectedReleaseId(null);
    }
    
    toast({
      title: "Release Deleted",
      description: `The release has been removed.`
    });
  };

  // Update release status
  const updateReleaseStatus = (id: string, status: ReleaseStatus) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === id
          ? { 
              ...release, 
              status,
              updatedAt: new Date().toISOString(),
              actualReleaseDate: status === 'released' ? new Date().toISOString().split('T')[0] : release.actualReleaseDate
            }
          : release
      )
    );
    
    toast({
      title: "Status Updated",
      description: `Release status changed to ${status.replace('_', ' ')}.`
    });
  };

  // Add feature to release
  const addFeatureToRelease = (releaseId: string, feature: Omit<ReleaseFeature, 'id'>) => {
    const featureId = `feature-${Date.now()}`;
    
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
  };

  // Update feature in release
  const updateFeatureInRelease = (releaseId: string, featureId: string, updatedData: Partial<ReleaseFeature>) => {
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
  };

  // Remove feature from release
  const removeFeatureFromRelease = (releaseId: string, featureId: string) => {
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
  };

  // Add release note
  const addReleaseNote = (releaseId: string, note: ReleaseNote) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === releaseId
          ? { 
              ...release, 
              releaseNotes: [...release.releaseNotes, note],
              updatedAt: new Date().toISOString()
            }
          : release
      )
    );
    
    toast({
      title: "Release Note Added",
      description: `"${note.title}" has been added to the release notes.`
    });
  };

  // Update release note
  const updateReleaseNote = (releaseId: string, index: number, updatedNote: ReleaseNote) => {
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
  };

  // Remove release note
  const removeReleaseNote = (releaseId: string, index: number) => {
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
  };

  // Generate release notes from features
  const generateReleaseNotesFromFeatures = (releaseId: string) => {
    const release = releases.find(r => r.id === releaseId);
    if (!release) return;
    
    const newNotes: ReleaseNote[] = release.features
      .filter(feature => feature.status === 'completed')
      .map(feature => ({
        type: 'feature',
        title: feature.name,
        description: feature.description,
        userFacing: true
      }));
    
    if (newNotes.length > 0) {
      setReleases(prev => 
        prev.map(r => 
          r.id === releaseId
            ? { 
                ...r, 
                releaseNotes: [...r.releaseNotes, ...newNotes],
                updatedAt: new Date().toISOString()
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
  };

  // Export release notes as markdown
  const exportReleaseNotesAsMarkdown = (releaseId: string) => {
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
  };

  return {
    releases,
    sortedAndFilteredReleases,
    selectedRelease,
    selectedReleaseId,
    sortField,
    sortOrder,
    filterStatus,
    setSelectedReleaseId,
    setSortField,
    setSortOrder,
    setFilterStatus,
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
