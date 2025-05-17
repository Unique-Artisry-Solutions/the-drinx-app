
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

  // Changed to accept a Release object instead of just an ID
  const selectRelease = (release: Release) => {
    console.log(`Release selected: ${release.id}`);
    // You could do more with this function, like triggering analytics
  };

  // Add createReleaseFromFeatures function to resolve error in SystemBreakdownPage
  const createReleaseFromFeatures = (features: any[]) => {
    const newRelease: Release = {
      id: uuidv4(),
      version: `1.0.${releases.length}`,
      name: `Release from Features (${new Date().toLocaleDateString()})`,
      type: 'minor',
      status: 'planned',
      description: `Automatically created release from ${features.length} selected features`,
      features: features.map(f => ({
        id: f.id || uuidv4(),
        name: f.name,
        status: 'pending',
        description: f.description || ''
      })),
      releaseNotes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      plannedReleaseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      team: [],
      tags: ['auto-generated'],
      releaseBranch: 'develop'
    };
    
    createRelease(newRelease);
    return newRelease.id;
  };
  
  return {
    releases,
    releaseProgress,
    createRelease,
    updateRelease,
    deleteRelease,
    selectRelease,
    createReleaseFromFeatures
  };
}
