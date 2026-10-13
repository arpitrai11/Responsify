export type ChangeCategory = 'css' | 'text' | 'image' | 'viewport';
export type ChangeStatus = 'applied' | 'reverted' | 'failed';

export interface ChangeRecord {
  id: string;
  timestamp: number;
  targetSelector: string;
  category: ChangeCategory;
  propertyOrField: string;
  previousValue: string;
  newValue: string;
  viewportLabel?: string;
  status: ChangeStatus;
  elementTag?: string;
}

export interface ChangeFilter {
  category?: ChangeCategory | 'all';
  search?: string;
  status?: ChangeStatus | 'all';
}
