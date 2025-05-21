import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ChemicalProduct } from '../types';

// Sample data
const initialProducts: ChemicalProduct[] = [
  {
    id: '1',
    category: 'Solvents',
    subCategory: 'Alcohols',
    product: 'Ethanol',
    cas: '64-17-5',
    description: 'High purity ethanol for laboratory use',
    sds: 'ethanol_sds.pdf',
    tds: 'ethanol_tds.pdf',
  },
  {
    id: '2',
    category: 'Acids',
    subCategory: 'Carboxylic Acids',
    product: 'Acetic Acid',
    cas: '64-19-7',
    description: 'Glacial acetic acid, 99.8% purity',
    sds: 'acetic_acid_sds.pdf',
    tds: 'acetic_acid_tds.pdf',
  },
  {
    id: '3',
    category: 'Bases',
    subCategory: 'Hydroxides',
    product: 'Sodium Hydroxide',
    cas: '1310-73-2',
    description: 'Sodium hydroxide pellets, 98% purity',
    sds: 'naoh_sds.pdf',
    tds: 'naoh_tds.pdf',
  },
];

interface ChemicalProductContextType {
  products: ChemicalProduct[];
  addProduct: (product: Omit<ChemicalProduct, 'id'>) => void;
  deleteProduct: (id: string) => void;
}

const ChemicalProductContext = createContext<ChemicalProductContextType | undefined>(undefined);

export const useChemicalProducts = () => {
  const context = useContext(ChemicalProductContext);
  if (!context) {
    throw new Error('useChemicalProducts must be used within a ChemicalProductProvider');
  }
  return context;
};

export const ChemicalProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ChemicalProduct[]>(initialProducts);

  const addProduct = (product: Omit<ChemicalProduct, 'id'>) => {
    const newProduct: ChemicalProduct = {
      ...product,
      id: Date.now().toString(),
    };
    setProducts([...products, newProduct]);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <ChemicalProductContext.Provider value={{ products, addProduct, deleteProduct }}>
      {children}
    </ChemicalProductContext.Provider>
  );
};