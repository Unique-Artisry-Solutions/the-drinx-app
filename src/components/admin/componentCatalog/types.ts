
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

export interface ComponentCatalogItem {
  id: string;
  name: string;
  description: string;
  filePath: string;
  type: 'component' | 'page';
  selectors: string[];
  preview?: string;
}

export interface PageComponentsMap {
  [pagePath: string]: ComponentCatalogItem[];
}
