import React, { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { ChemicalProduct } from '../../types';

interface ProductFormProps {
  product: Partial<ChemicalProduct>;
  errors: Partial<Record<keyof ChemicalProduct, string>>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText: string;
}

interface Category {
  _id: string;
  name: string;
}

interface SubCategory {
  _id: string;
  name: string;
}

const ProductForm: React.FC<ProductFormProps> = ({
  product,
  errors,
  onChange,
  onFileChange,
  onSubmit,
  submitButtonText,
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://cdfc-2405-201-200e-88b8-1b6-d0cf-ad60-2131.ngrok-free.app/api/admin/get-all-product-categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setCategories(result.data);
        } else {
          setError('Failed to load categories');
        }
      } catch (err) {
        setError('Error fetching categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    const fetchSubCategories = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://cdfc-2405-201-200e-88b8-1b6-d0cf-ad60-2131.ngrok-free.app/api/admin/get-all-product-sub-categories`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setSubCategories(result.data);
        } else {
          setError('Failed to load subcategories');
        }
      } catch (err) {
        setError('Error fetching subcategories');
      } finally {
        setLoading(false);
      }
    };

    if (product.category) {
      fetchSubCategories();
    } else {
      setSubCategories([]);
    }
  }, [product.category]);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <p className="text-red-600 text-sm">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={product.category || ''}
            onChange={onChange}
            disabled={loading}
            className={`mt-1 block w-full py-2 px-3 border ${
              errors.category ? 'border-red-300' : 'border-gray-300'
            } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
              loading ? 'bg-gray-100 cursor-not-allowed' : ''
            }`}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        <div>
  <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700">
    Sub Category *
  </label>
  <input
    list="subCategoryOptions"
    id="subCategory"
    name="subCategory"
    value={product.subCategory || ''}
    onChange={onChange}
    disabled={!product.category || loading}
    className={`mt-1 block w-full py-2 px-3 border ${
      errors.subCategory ? 'border-red-300' : 'border-gray-300'
    } bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
      !product.category || loading ? 'bg-gray-100 cursor-not-allowed' : ''
    }`}
    placeholder="Select or type Sub Category"
  />
  <datalist id="subCategoryOptions">
    {subCategories.map((subCategory) => (
      <option key={subCategory._id} value={subCategory.name} />
    ))}
  </datalist>
  {errors.subCategory && <p className="mt-1 text-sm text-red-600">{errors.subCategory}</p>}
</div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">
            Product Name *
          </label>
          <input
            type="text"
            name="product"
            id="product"
            value={product.product || ''}
            onChange={onChange}
            className={`mt-1 block w-full py-2 px-3 border ${
              errors.product ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.product && <p className="mt-1 text-sm text-red-600">{errors.product}</p>}
        </div>

        <div>
          <label htmlFor="cas" className="block text-sm font-medium text-gray-700">
            CAS Number *
          </label>
          <input
            type="text"
            name="cas"
            id="cas"
            value={product.cas || ''}
            onChange={onChange}
            className={`mt-1 block w-full py-2 px-3 border ${
              errors.cas ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
          />
          {errors.cas && <p className="mt-1 text-sm text-red-600">{errors.cas}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          value={product.description || ''}
          onChange={onChange}
          className={`mt-1 block w-full py-2 px-3 border ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sds" className="block text-sm font-medium text-gray-700">
            Safety Data Sheet (SDS)
          </label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="sds"
              className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer`}
            >
              <Upload size={18} className="mr-2" />
              {product.sds instanceof File ? product.sds.name : 'Upload SDS PDF'}
            </label>
            <input
              id="sds"
              name="sds"
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              className="sr-only"
            />
          </div>
          {errors.sds && <p className="mt-1 text-sm text-red-600">{errors.sds}</p>}
        </div>

        <div>
          <label htmlFor="tds" className="block text-sm font-medium text-gray-700">
            Technical Data Sheet (TDS)
          </label>
          <div className="mt-1 flex items-center">
            <label
              htmlFor="tds"
              className={`flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer`}
            >
              <Upload size={18} className="mr-2" />
              {product.tds instanceof File ? product.tds.name : 'Upload TDS PDF'}
            </label>
            <input
              id="tds"
              name="tds"
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              className="sr-only"
            />
          </div>
          {errors.tds && <p className="mt-1 text-sm text-red-600">{errors.tds}</p>}
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-3 border-t">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('submitProductForm')?.click();
          }}
          disabled={loading}
          className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Loading...' : submitButtonText}
        </button>
        <button
          type="submit"
          id="submitProductForm"
          className="sr-only"
        >
          Submit
        </button>
      </div>
    </form>
  );
};

export default ProductForm;