export interface BoxEdges {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface BoxModelData {
  margin: BoxEdges;
  border: BoxEdges;
  padding: BoxEdges;
  content: {
    width: number;
    height: number;
  };
}

export interface ContrastResult {
  foreground: string;
  background: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
  isEstimated?: boolean;
  note?: string;
}

export interface HierarchyNode {
  tagName: string;
  id: string;
  classList: string[];
  selector: string;
}

export interface ElementInfo {
  tagName: string;
  id: string;
  classList: string[];
  selector: string;
  xpath?: string;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  boxModel: BoxModelData;
  computedStyles: Record<string, string>;
  inlineStyles: Record<string, string>;
  appliedCustomStyles?: Record<string, string>;
  textContent: string;
  parentHierarchy: HierarchyNode[];
  childrenCount: number;
  colors: {
    color: string;
    backgroundColor: string;
    borderColor: string;
  };
  contrast?: ContrastResult;
  isInteractive?: boolean;
}
