
export interface Task {
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  description?: string;
  effort?: number;
  impact?: number;
}

export interface Feature {
  id: string;
  name: string;
  category: string;
  description: string;
  implementation_status: 'planned' | 'in_progress' | 'completed' | 'blocked';
  tasks: Task[];
  dependencies?: string[];
  ui_components?: string[];
  api_endpoints?: string[];
  technical_details?: string;
  business_value?: string[];
}
