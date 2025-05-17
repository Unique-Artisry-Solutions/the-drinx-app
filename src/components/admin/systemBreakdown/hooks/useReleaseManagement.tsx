
import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { format, addMonths } from 'date-fns';
import {
  Release,
  ReleaseFeature,
  ReleaseProgress,
  ReleaseSortField,
  ReleaseSortOrder,
  ReleaseStatus,
  ReleaseType
} from '../types/releaseTypes';
import { FeatureItem } from '../types';
import { mapFeaturesToReleaseFeatures } from '../utils/releaseUtils';

export const useReleaseManagement = () => {
  const { toast } = useToast();
  const [releases, setReleases] = useState<Release[]>([]);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>("");
  const [sortField, setSortField] = useState<ReleaseSortField>('plannedReleaseDate');
  const [sortOrder, setSortOrder] = useState<ReleaseSortOrder>('desc');
  const [filter, setFilter] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<ReleaseStatus | "all">("all");
  
  // Get a single release by ID
  const getRelease = (id: string): Release | undefined => {
    return releases.find(release => release.id === id);
  };

  // Get the currently selected release
  const selectedRelease = getRelease(selectedReleaseId);
  
  // Sort and filter releases
  const sortedAndFilteredReleases = (() => {
    // First filter
    let filtered = [...releases];
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(r => r.status === filterStatus);
    }
    
    if (filter) {
      const lowerFilter = filter.toLowerCase();
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(lowerFilter) || 
        r.version.toLowerCase().includes(lowerFilter)
      );
    }
    
    // Then sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'version':
          comparison = a.version.localeCompare(b.version);
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'plannedReleaseDate':
          // Handle potentially undefined dates
          const dateA = a.plannedReleaseDate ? new Date(a.plannedReleaseDate).getTime() : 0;
          const dateB = b.plannedReleaseDate ? new Date(b.plannedReleaseDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  })();

  // Create a new release
  const createRelease = useCallback((release: Release) => {
    setReleases(prev => [...prev, release]);
  }, []);

  // Create a release from features
  const createReleaseFromFeatures = useCallback((features: FeatureItem[], name: string, version: string, type: ReleaseType = 'minor') => {
    try {
      // Generate planned release date - 1 month from now
      const releaseDate = format(addMonths(new Date(), 1), 'yyyy-MM-dd');

      // Map features to release features
      const releaseFeatures = mapFeaturesToReleaseFeatures(features, releaseDate);
      
      // Create the new release object
      const newRelease: Release = {
        id: uuidv4(),
        version: version,
        name: name,
        type: type,
        status: 'planned',
        plannedReleaseDate: releaseDate,
        description: `Release ${version} containing ${features.length} features`,
        features: releaseFeatures,
        releaseNotes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        team: [],
        tags: []
      };
      
      // Add the new release
      setReleases(prev => [...prev, newRelease]);
      
      toast({
        title: "Release created",
        description: `Release ${version} has been created with ${features.length} features`,
      });
      
      return newRelease;
    } catch (error) {
      toast({
        title: "Error creating release",
        description: "Failed to create release from features",
        variant: "destructive"
      });
      return null;
    }
  }, [toast]);

  // Update an existing release
  const updateRelease = useCallback((updatedRelease: Release) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === updatedRelease.id ? updatedRelease : release
      )
    );
  }, []);

  // Update a release status
  const updateReleaseStatus = useCallback((releaseId: string, newStatus: ReleaseStatus) => {
    try {
      setReleases(prev => 
        prev.map(release => {
          if (release.id === releaseId) {
            return {
              ...release,
              status: newStatus,
              updatedAt: new Date().toISOString()
            };
          }
          return release;
        })
      );
      
      toast({
        title: "Status updated",
        description: `Release status updated to ${newStatus}`
      });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: "Failed to update release status",
        variant: "destructive"
      });
    }
  }, [toast]);

  // Delete a release
  const deleteRelease = useCallback((releaseId: string) => {
    setReleases(prev => prev.filter(release => release.id !== releaseId));
    
    // If we deleted the selected release, clear the selection
    if (selectedReleaseId === releaseId) {
      setSelectedReleaseId("");
    }
  }, [selectedReleaseId]);

  // Select a release
  const selectRelease = useCallback((releaseId: string) => {
    setSelectedReleaseId(releaseId);
  }, []);

  // Clear the selected release
  const clearSelectedRelease = useCallback(() => {
    setSelectedReleaseId("");
  }, []);

  // Update release sorting configuration
  const updateSort = useCallback((field: ReleaseSortField, order: ReleaseSortOrder) => {
    setSortField(field);
    setSortOrder(order);
  }, []);

  // Update release filter
  const updateFilter = useCallback((filterText: string) => {
    setFilter(filterText);
  }, []);
  
  // Update release status filter
  const updateStatusFilter = useCallback((status: ReleaseStatus | "all") => {
    setFilterStatus(status);
  }, []);

  // Generate a new version number based on existing releases
  const getNextVersionNumber = useCallback(() => {
    if (releases.length === 0) {
      return "1.0.0";
    }
    
    // Try to find the highest version number
    try {
      const versionNumbers = releases
        .map(r => r.version)
        .map(v => {
          // Remove any 'v' prefix
          if (v.toLowerCase().startsWith('v')) {
            v = v.substring(1);
          }
          
          // Split version into components
          const parts = v.split('.').map(p => parseInt(p, 10));
          return {
            major: parts[0] || 0,
            minor: parts[1] || 0,
            patch: parts[2] || 0
          };
        });
      
      // Find the latest version
      const latest = versionNumbers.reduce((latest, current) => {
        if (current.major > latest.major) return current;
        if (current.major === latest.major && current.minor > latest.minor) return current;
        if (current.major === latest.major && current.minor === latest.minor && current.patch > latest.patch) return current;
        return latest;
      }, { major: 0, minor: 0, patch: 0 });
      
      // Increment the minor version
      return `${latest.major}.${latest.minor + 1}.0`;
    } catch (error) {
      toast({
        title: "Error generating version",
        description: "Using default version 1.0.0",
        variant: "destructive"
      });
      return "1.0.0";
    }
  }, [releases, toast]);

  // Add a feature to a release
  const addFeatureToRelease = useCallback((releaseId: string, feature: ReleaseFeature) => {
    try {
      setReleases(prev => 
        prev.map(release => {
          if (release.id === releaseId) {
            return {
              ...release,
              features: [...release.features, feature],
              updatedAt: new Date().toISOString()
            };
          }
          return release;
        })
      );
      
      toast({
        title: "Feature added",
        description: `Feature "${feature.name}" added to release`
      });
      return true;
    } catch (error) {
      toast({
        title: "Error adding feature",
        description: "Failed to add feature to release",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  // Create release progress data for display
  const releaseProgress: ReleaseProgress[] = releases.map(release => {
    const totalFeatures = release.features.length;
    const completedFeatures = release.features.filter(f => f.status === 'completed').length;
    const inProgressFeatures = release.features.filter(f => f.status === 'in_progress').length;
    const pendingFeatures = release.features.filter(f => f.status === 'pending').length;
    const deferredFeatures = release.features.filter(f => f.status === 'deferred').length;
    const percentComplete = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0;
    
    return {
      id: release.id,
      version: release.version,
      totalFeatures,
      completedFeatures,
      inProgressFeatures,
      pendingFeatures,
      deferredFeatures,
      percentComplete
    };
  });

  return {
    releases,
    sortedAndFilteredReleases,
    selectedRelease,
    selectedReleaseId,
    sortField,
    sortOrder,
    filter,
    filterStatus,
    releaseProgress,
    getRelease,
    createRelease,
    createReleaseFromFeatures,
    updateRelease,
    updateReleaseStatus,
    deleteRelease,
    selectRelease,
    clearSelectedRelease,
    updateSort,
    updateFilter,
    updateStatusFilter,
    getNextVersionNumber,
    addFeatureToRelease
  };
};
