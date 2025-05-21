export interface ChemicalProduct {
  id: string;
  category: string;
  subCategory: string;
  product: string;
  cas: string;
  description: string;
  sds?: string;
  tds?: string;
}

export interface SortConfig {
  key: keyof ChemicalProduct | '';
  direction: 'asc' | 'desc';
}
