
import { useState, useEffect } from 'react';
import { Release, ReleaseProgress, ReleaseSortField, ReleaseSortOrder } from '../types/releaseTypes';
import { v4 as uuidv4 } from 'uuid';

// Sample data for demonstration purposes
const mockReleases: Release[] = [
  {
    id: '1',
    version: '1.0.0',
    name: 'Initial Release',
    type: 'major',
    status: 'released',
    plannedReleaseDate: '2023-12-01',
    actualReleaseDate: '2023-12-15',
    description: 'First stable release',
    features: [
      { id: 'f1', name: 'Core Functionality', status: 'completed', description: 'Basic app structure' }
    ],
    releaseNotes: ['Initial version'],
    createdAt: '2023-10-15T00:00:00Z',
    updatedAt: '2023-12-15T00:00:00Z',
    team: ['Alice', 'Bob'],
    tags: ['stable', 'mvp'],
    releaseBranch: 'main'
  },
  // Add more mock releases as needed
];

// Mock release progress data
const mockProgress: ReleaseProgress[] = [
  { releaseId: '1', completion: 100, featuresCompleted: 5, totalFeatures: 5 },
  // Add more progress entries as needed
];

export function useReleaseManagement() {
  const [releases, setReleases] = useState<Release[]>(mockReleases);
  const [releaseProgress, setReleaseProgress] = useState<ReleaseProgress[]>(mockProgress);
  
  // Function to add a new release
  const createRelease = (release: Release) => {
    setReleases(prev => [...prev, release]);
  };
  
  // Function to update an existing release
  const updateRelease = (updatedRelease: Release) => {
    setReleases(prev => 
      prev.map(release => 
        release.id === updatedRelease.id ? updatedRelease : release
      )
    );
  };
  
  // Function to delete a release
  const deleteRelease = (releaseId: string) => {
    setReleases(prev => prev.filter(release => release.id !== releaseId));
    setReleaseProgress(prev => prev.filter(progress => progress.releaseId !== releaseId));
  };

  // Fixed: selectRelease now explicitly takes a string ID
  const selectRelease = (releaseId: string) => {
    console.log(`Release selected: ${releaseId}`);
    // You could do more with this function, like triggering analytics
  };
  
  return {
    releases,
    releaseProgress,
    createRelease,
    updateRelease,
    deleteRelease,
    selectRelease
  };
}
