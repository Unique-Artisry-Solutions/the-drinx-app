import React from 'react';
import Phase1Ideation from '../phases/Phase1Ideation';
import Phase2Planning from '../phases/Phase2Planning';
import Phase3Design from '../phases/Phase3Design';
import Phase4Development from '../phases/Phase4Development';
import Phase5Refinement from '../phases/Phase5Refinement';
import Phase6Testing from '../phases/Phase6Testing';

const PhasesList: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Phase 1: Ideation */}
      <Phase1Ideation />
      
      {/* Phase 2: Planning */}
      <Phase2Planning />
      
      {/* Phase 3: Design */}
      <Phase3Design />
      
      {/* Phase 4: Development */}
      <Phase4Development />
      
      {/* Phase 5: Refinement */}
      <Phase5Refinement />
      
      {/* Phase 6: Testing and Rollout */}
      <Phase6Testing />
    </div>
  );
};

export default PhasesList;
