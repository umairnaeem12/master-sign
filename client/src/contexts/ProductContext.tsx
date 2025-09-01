import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/products';

interface ProductContextType {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  clearSelectedProduct: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
  };

  const value = {
    selectedProduct,
    setSelectedProduct,
    clearSelectedProduct,
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};
