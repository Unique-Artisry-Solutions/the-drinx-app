
export interface ComponentGroup {
  id: string;
  name: string;
  description: string;
  components: Component[];
}

export interface Component {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
}
