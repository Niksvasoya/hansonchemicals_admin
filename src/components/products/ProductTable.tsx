// src/components/products/ProductTable.tsx
import React, { useEffect, useState } from 'react';
import { FileText, Plus, Trash2, Edit2 } from 'lucide-react';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { ChemicalProduct } from '../../types';

const ProductTable: React.FC = () => {
  const [products, setProducts] = useState<ChemicalProduct[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState<ChemicalProduct | null>(null);

  /* ---------- load list ---------- */
  const loadProducts = async () => {
    const res = await fetch(`https://cdfc-2405-201-200e-88b8-1b6-d0cf-ad60-2131.ngrok-free.app/api/admin/get-all-product`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const json = await res.json();
    // assuming backend shape: { success: true, data: [...] }
    setProducts(json.data ?? []);
  };
  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------- open/close helpers ---------- */
  const openAdd = () => setAddOpen(true);
  const closeAdd = () => setAddOpen(false);

  const openEdit = (p: ChemicalProduct) => {
    setSelected(p);
    setEditOpen(true);
  };
  const closeEdit = () => setEditOpen(false);

  /* ---------- JSX ---------- */
  return (
    <div>
      {/* top bar */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Chemical Products</h2>
        <button
          onClick={openAdd}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </button>
      </div>

      {/* table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {/* ...headings, same as before ... */}
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">{p.category}</td>
                <td className="px-6 py-4 text-sm">{p.subCategory}</td>
                <td className="px-6 py-4 text-sm">{p.product}</td>
                <td className="px-6 py-4 text-sm">{p.cas}</td>
                <td className="px-6 py-4 text-sm max-w-xs truncate">{p.description}</td>

                <td className="px-6 py-4 text-sm">
                  {p.sds && (
                    <a href={p.sdsUrl} className="text-indigo-600 flex items-center" target="_blank">
                      <FileText size={16} className="mr-1" />
                      View
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {p.tds && (
                    <a href={p.tdsUrl} className="text-indigo-600 flex items-center" target="_blank">
                      <FileText size={16} className="mr-1" />
                      View
                    </a>
                  )}
                </td>

                <td className="px-6 py-4 text-sm">
                  {/* delete left as-is */}
                  <button className="text-red-600 hover:text-red-900">
                    <Trash2 size={18} />
                  </button>

                  {/* edit */}
                  <button
                    onClick={() => openEdit(p)}
                    className="text-blue-600 hover:text-blue-900 ml-3"
                  >
                    <Edit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* modals */}
      <AddProductModal isOpen={addOpen} onClose={closeAdd} onAdded={loadProducts} onUpdated={loadProducts} />
      <EditProductModal
        isOpen={editOpen}
        onClose={closeEdit}
        product={selected}
        onUpdated={loadProducts}
      />
    </div>
  );
};

export default ProductTable;
