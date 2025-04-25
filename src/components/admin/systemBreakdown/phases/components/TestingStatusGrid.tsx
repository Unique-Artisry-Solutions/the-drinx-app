
import React from 'react';
import { Cpu, Shield, Rocket, CircleDashed, Clock, Check } from 'lucide-react';

export const TestingStatusGrid: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-50 p-4 rounded-lg flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="h-4 w-4 text-slate-700" />
          <h3 className="font-medium text-sm">Performance Testing</h3>
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="text-xs">Testing event system with simulated load of 10,000 concurrent users</div>
          </div>
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
            <div className="text-xs">Database optimization for high-volume ticket sales</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="h-4 w-4 text-slate-700" />
          <h3 className="font-medium text-sm">Security Testing</h3>
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-xs">Payment system security audit completed</div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-xs">Promoter authentication penetration testing passed</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-lg flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Rocket className="h-4 w-4 text-slate-700" />
          <h3 className="font-medium text-sm">Rollout Plan</h3>
        </div>
        <div className="space-y-2 flex-1">
          <div className="flex items-start gap-2">
            <Check className="h-4 w-4 text-green-500 mt-0.5" />
            <div className="text-xs">Alpha release to internal team</div>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
            <div className="text-xs">Beta program with select promoters in progress</div>
          </div>
          <div className="flex items-start gap-2">
            <CircleDashed className="h-4 w-4 text-gray-400 mt-0.5" />
            <div className="text-xs">Public launch planned for Q4</div>
          </div>
        </div>
      </div>
    </div>
  );
};
