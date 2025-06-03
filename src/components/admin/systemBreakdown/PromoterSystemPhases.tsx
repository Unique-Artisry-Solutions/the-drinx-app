
import React from 'react';
import Phase1Ideation from './phases/Phase1Ideation';
import Phase2Planning from './phases/Phase2Planning';
import Phase3Design from './phases/Phase3Design';
import Phase4Development from './phases/Phase4Development';
import Phase5Refinement from './phases/Phase5Refinement';
import Phase6Testing from './phases/Phase6Testing';

const PromoterSystemPhases: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Promoter System Development Phases</h2>
      <Phase1Ideation />
      <Phase2Planning />
      <Phase3Design />
      <Phase4Development />
      <Phase5Refinement />
      <Phase6Testing />
    </div>
  );
};

export default PromoterSystemPhases;
