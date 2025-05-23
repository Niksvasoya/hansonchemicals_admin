import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { useChemicalProducts } from '../../context/ChemicalProductContext';
import { ChemicalProduct } from '../../types';
import ProductForm from './ProductForm';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
    onUpdated: () => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({ isOpen, onClose  , onUpdated,
}) => {
  const { addProduct } = useChemicalProducts();
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ChemicalProduct, string>>>({});
  const [apiError, setApiError] = useState<string>('');

  const initialProductState: Omit<ChemicalProduct, 'id'> = {
    category: '',
    subCategory: '',
    product: '',
    cas: '',
    description: '',
    sds: null,
    tds: null,
  };

  const [newProduct, setNewProduct] = useState<Omit<ChemicalProduct, 'id'>>(initialProductState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
    
    // Clear error when field is edited
    if (formErrors[name as keyof ChemicalProduct]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    
    const { name, files } = e.target;
    setNewProduct({ ...newProduct, [name]: files[0] });
    
    // Clear error when field is edited
    if (formErrors[name as keyof ChemicalProduct]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ChemicalProduct, string>> = {};
    
    if (!newProduct.category) errors.category = 'Category is required';
    if (!newProduct.subCategory) errors.subCategory = 'Sub Category is required';
    if (!newProduct.product) errors.product = 'Product name is required';
    if (!newProduct.cas) errors.cas = 'CAS number is required';
    if (!newProduct.description) errors.description = 'Description is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      const formData = new FormData();
      formData.append('category', newProduct.category);
      formData.append('subCategory', newProduct.subCategory);
      formData.append('product', newProduct.product);
      formData.append('cas', newProduct.cas);
      formData.append('description', newProduct.description);
      
      if (newProduct.sds instanceof File) {
        formData.append('sds', newProduct.sds);
      }
      if (newProduct.tds instanceof File) {
        formData.append('tds', newProduct.tds);
      }

      const response = await fetch(`https://cdfc-2405-201-200e-88b8-1b6-d0cf-ad60-2131.ngrok-free.app/api/admin/add-product`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        addProduct({
          ...newProduct,
          id: result.data._id,
          sds: result.data.sds,
          tds: result.data.tds,
        });
        setNewProduct(initialProductState);
        setApiError('');
        onClose();
        onUpdated(); // refresh list in table
      } else {
        setApiError(result.message || 'Failed to add product');
      }
    } catch (error) {
      setApiError('Error adding product. Please try again.');
    }
  };

  return (
    <Transition show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={onClose}>
        <div className="min-h-screen px-4 text-center">
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            ​
          </span>
          
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Add New Chemical Product
                </Dialog.Title>
                <button
                  type="button"
                  className="bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
              
              {apiError && <p className="text-red-600 text-sm mb-4">{apiError}</p>}
              
              <ProductForm
                product={newProduct}
                errors={formErrors}
                onChange={handleChange}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
                submitButtonText="Add Product"
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default AddProductModal;