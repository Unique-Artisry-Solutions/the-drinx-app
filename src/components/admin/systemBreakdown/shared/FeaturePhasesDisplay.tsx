
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FeatureItem } from '../types';
import { Check, Clock, CircleDashed, AlertTriangle } from 'lucide-react';

interface FeaturePhase {
  name: string;
  description: string;
  status: 'completed' | 'in_progress' | 'not_started' | 'blocked';
  tasks: {
    name: string;
    completed: boolean;
  }[];
}

interface FeaturePhasesDisplayProps {
  feature: FeatureItem;
}

export const FeaturePhasesDisplay: React.FC<FeaturePhasesDisplayProps> = ({ feature }) => {
  // Generate phases based on feature data
  const phases: FeaturePhase[] = generatePhases(feature);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <CircleDashed className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColorClass = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Implementation Phases</h4>
      <div className="grid grid-cols-1 gap-3">
        {phases.map((phase, index) => (
          <Card key={index} className="overflow-hidden">
            <div className={`px-4 py-2 flex items-center justify-between ${getStatusColorClass(phase.status)}`}>
              <div className="flex items-center gap-2">
                {getStatusIcon(phase.status)}
                <h5 className="font-medium text-sm">{phase.name}</h5>
              </div>
              <Badge className={getStatusColorClass(phase.status)}>
                {phase.status.replace('_', ' ').charAt(0).toUpperCase() + phase.status.slice(1).replace('_', ' ')}
              </Badge>
            </div>
            <CardContent className="p-3">
              <p className="text-xs text-gray-600 mb-2">{phase.description}</p>
              <div className="space-y-1">
                {phase.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="flex items-start gap-2">
                    {task.completed ? (
                      <Check className="h-3.5 w-3.5 text-green-500 mt-0.5" />
                    ) : (
                      <CircleDashed className="h-3.5 w-3.5 text-gray-300 mt-0.5" />
                    )}
                    <span className={`text-xs ${task.completed ? 'text-gray-700' : 'text-gray-500'}`}>
                      {task.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Helper function to generate phases based on feature data
const generatePhases = (feature: FeatureItem): FeaturePhase[] => {
  const dbStatus = feature.dbStatus || feature.databaseStatus || 'not_started';
  const uiStatus = feature.status;
  
  // Parse tasks from database analysis if available
  const dbTasks = feature.databaseAnalysis ? 
    parseTasksFromDatabaseAnalysis(feature.databaseAnalysis) :
    generateDefaultDatabaseTasks(dbStatus);
  
  // Generate default UI tasks based on status
  const uiTasks = generateDefaultUITasks(uiStatus);
  
  // Determine phase statuses
  const planningStatus = determinePhaseStatus('planning', feature);
  const dbPhaseStatus = determinePhaseStatus('database', feature, dbStatus);
  const uiPhaseStatus = determinePhaseStatus('ui', feature, uiStatus);
  const testingStatus = determinePhaseStatus('testing', feature);
  
  return [
    {
      name: "Phase 1: Planning & Requirements",
      description: "Defining feature scope, requirements, and implementation plan",
      status: planningStatus,
      tasks: [
        { name: "Feature specification", completed: true },
        { name: "Requirement analysis", completed: true },
        { name: "Implementation planning", completed: planningStatus === 'completed' },
        { name: "Resource allocation", completed: planningStatus === 'completed' }
      ]
    },
    {
      name: "Phase 2: Database Implementation",
      description: "Database schema design, implementation, and optimization",
      status: dbPhaseStatus,
      tasks: dbTasks
    },
    {
      name: "Phase 3: UI Implementation",
      description: "User interface design, component creation, and state management",
      status: uiPhaseStatus,
      tasks: uiTasks
    },
    {
      name: "Phase 4: Testing & Finalization",
      description: "Testing, bug fixes, and final deployment",
      status: testingStatus,
      tasks: [
        { name: "Unit tests", completed: testingStatus === 'completed' },
        { name: "Integration tests", completed: testingStatus === 'completed' },
        { name: "User acceptance testing", completed: testingStatus === 'completed' },
        { name: "Documentation", completed: testingStatus === 'completed' }
      ]
    }
  ];
};

// Parse tasks from database analysis text
const parseTasksFromDatabaseAnalysis = (analysisText: string): { name: string; completed: boolean }[] => {
  const tasks: { name: string; completed: boolean }[] = [];
  const lines = analysisText.split('\n');
  
  for (const line of lines) {
    if (line.includes('- [x]')) {
      tasks.push({
        name: line.replace('- [x]', '').trim(),
        completed: true
      });
    } else if (line.includes('- [ ]')) {
      tasks.push({
        name: line.replace('- [ ]', '').trim(),
        completed: false
      });
    } else if (line.match(/^\d+\.\s+/)) {
      // For numbered lists without checkboxes
      tasks.push({
        name: line.replace(/^\d+\.\s+/, '').trim(),
        completed: false
      });
    }
  }
  
  // If no tasks were found using the patterns above, create some basic ones
  if (tasks.length === 0) {
    const basicTasks = [
      "Create database tables",
      "Define relationships",
      "Implement API endpoints",
      "Optimize queries"
    ];
    
    basicTasks.forEach(taskName => {
      tasks.push({
        name: taskName,
        completed: false
      });
    });
  }
  
  return tasks;
};

// Generate default database tasks when no specific analysis is available
const generateDefaultDatabaseTasks = (dbStatus: string): { name: string; completed: boolean }[] => {
  const allCompleted = dbStatus === 'complete' || dbStatus === 'implemented';
  const someCompleted = dbStatus === 'in_progress';
  
  return [
    { name: "Database schema design", completed: allCompleted || someCompleted },
    { name: "Table creation", completed: allCompleted || someCompleted },
    { name: "Relationship mapping", completed: allCompleted },
    { name: "API integration", completed: allCompleted }
  ];
};

// Generate default UI tasks based on status
const generateDefaultUITasks = (uiStatus: string): { name: string; completed: boolean }[] => {
  const allCompleted = uiStatus === 'implemented';
  const someCompleted = uiStatus === 'partial' || uiStatus === 'in_progress';
  
  return [
    { name: "Component design", completed: allCompleted || someCompleted },
    { name: "State management", completed: allCompleted || someCompleted },
    { name: "UI implementation", completed: allCompleted },
    { name: "Responsive design", completed: allCompleted }
  ];
};

// Determine overall phase status
const determinePhaseStatus = (
  phaseType: 'planning' | 'database' | 'ui' | 'testing', 
  feature: FeatureItem,
  specificStatus?: string
): 'completed' | 'in_progress' | 'not_started' | 'blocked' => {
  // Planning is always completed if the feature exists
  if (phaseType === 'planning') return 'completed';
  
  // For database phase
  if (phaseType === 'database') {
    if (!specificStatus) return 'not_started';
    if (specificStatus === 'complete' || specificStatus === 'implemented') return 'completed';
    if (specificStatus === 'in_progress') return 'in_progress';
    if (specificStatus === 'blocked') return 'blocked';
    return 'not_started';
  }
  
  // For UI phase
  if (phaseType === 'ui') {
    if (!specificStatus) return 'not_started';
    if (specificStatus === 'implemented') return 'completed';
    if (specificStatus === 'partial' || specificStatus === 'in_progress') return 'in_progress';
    if (specificStatus === 'blocked') return 'blocked';
    return 'not_started';
  }
  
  // For testing phase
  if (phaseType === 'testing') {
    // Testing is complete only if feature is fully implemented
    if (feature.status === 'implemented') return 'completed';
    // Testing in progress if feature is partially implemented or in progress
    if (feature.status === 'partial' || feature.status === 'in_progress') return 'in_progress';
    return 'not_started';
  }
  
  return 'not_started';
};
