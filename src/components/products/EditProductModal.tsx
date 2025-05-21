// src/components/products/EditProductModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { ChemicalProduct } from '../../types';
import ProductForm from './ProductForm';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** product we’re editing – may be undefined until the user clicks a row */
  product?: ChemicalProduct | null;
  /** callback so the table can refresh after a successful update */
  onUpdated: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onUpdated,
}) => {
  /* ---------- local state ---------- */
  const [formData, setFormData] = useState<Omit<ChemicalProduct, 'id'>>({
    category: '',
    subCategory: '',
    product: '',
    cas: '',
    description: '',
    sds: null,
    tds: null,
  });
  const [formErrors, setFormErrors] =
    useState<Partial<Record<keyof ChemicalProduct, string>>>({});
  const [apiError, setApiError] = useState('');

  /* ---------- populate the form when product changes ---------- */
  useEffect(() => {
    if (product) {
      const { id, ...rest } = product;
      setFormData(rest);
    }
  }, [product]);

  /* ---------- generic change handlers ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name as keyof ChemicalProduct]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const { name, files } = e.target;
      setFormData(prev => ({ ...prev, [name]: files![0] as any }));
      if (formErrors[name as keyof ChemicalProduct]) {
        setFormErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  /* ---------- validation ---------- */
  const validate = () => {
    const err: typeof formErrors = {};
    if (!formData.category) err.category = 'Category is required';
    if (!formData.subCategory) err.subCategory = 'Sub-category is required';
    if (!formData.product) err.product = 'Product is required';
    if (!formData.cas) err.cas = 'CAS is required';
    if (!formData.description) err.description = 'Description is required';
    setFormErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------- submit ---------- */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return; // should never happen
    if (!validate()) return;

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v as any);
      });
      console.log(product)
      const res = await fetch(
        `https://bd8d1ee5-b7ca-40ff-a0f2-84288502d68a-00-306siaupcy3me.sisko.replit.dev/api/admin/update-product/${product._id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          body: fd,
        },
      );
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      onUpdated(); // refresh list in table
      onClose();
    } catch (err: any) {
      setApiError(err.message || 'Update failed');
    }
  };

  /* ---------- UI ---------- */
  return (
    <Transition as={React.Fragment} show={isOpen}>
      <Dialog onClose={onClose} className="fixed inset-0 z-50 overflow-y-auto">
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
            <Dialog.Overlay className="fixed inset-0 bg-black/30" />
          </Transition.Child>

          <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
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
              {/* header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Edit Product</h3>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <X size={20} />
                </button>
              </div>

              {apiError && <p className="mb-4 text-sm text-red-600">{apiError}</p>}

              <ProductForm
                product={formData}
                errors={formErrors}
                onChange={handleChange}
                onFileChange={handleFileChange}
                onSubmit={handleSubmit}
                submitButtonText="Update"
              />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditProductModal;
