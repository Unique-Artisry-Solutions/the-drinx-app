
export type ComponentType = 'page' | 'section' | 'element' | 'layout' | 'navigation';

export interface ComponentIdentifier {
  id: string;
  name: string;
  type: ComponentType;
  path: string;
  selector?: string;
}

export interface ComponentGroup {
  name: string;
  description: string;
  components: ComponentCatalogItem[];
}

export interface ComponentCatalogItem {
  id: string;
  name: string;
  description: string;
  type: ComponentType;
  filePath: string;
  selectors: string[];
  props?: Record<string, any>;
  children?: ComponentCatalogItem[];
  lovablePrompt?: string;
  preview?: string; // URL to preview image or SVG/JSX representation
}

export interface PageComponentsMap {
  [pagePath: string]: {
    pageName: string;
    description: string;
    components: ComponentGroup[];
  };
}
