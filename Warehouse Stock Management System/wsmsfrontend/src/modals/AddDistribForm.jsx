import React, { useState, useRef, useEffect } from 'react';
import axios from '../api/axios';
import AddDistribConfirmation from './confirmationmodals/AddDistribConfirmation';

export default function AddDistribForm({ onClose, addDistrib }) {

  const [product, setProduct] = useState('');
  const [distrib_quantity, setDistribQuantity] = useState('');
  const [isAddDistribConfirm, setIsAddDistribConfirmOpen] = useState(false); 
  const [availableProducts, setAvailableProducts] = useState([]);
  const [groupedData, setGroupedData] = useState([]); 
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    const fetchAvailableProducts = async () => {
      try {
        const res = await axios.get('/products/');
        const filtered = res.data.filter(item => item.product_qty > 0);
        setGroupedData(filtered);
        setAvailableProducts(filtered.map(item => item.product_name));
      } catch (err) {
        console.error("Failed to fetch available products", err);
      }
    };

    fetchAvailableProducts();
  }, []);

  const handleProductChange = (e) => {
    const selected = e.target.value;
    setProduct(selected);
    const match = groupedData.find(item => item.product_name === selected);
    if (match) {
      setSelectedProductQuantity(match.product_qty);
      setSelectedProductId(match.product_id);
    } else {
      setSelectedProductQuantity(null);
      setSelectedProductId(null);
    }
  };

  const validateBeforeConfirm = () => {
    if (!product || !distrib_quantity) {
      alert("Please fill out all required fields.");
      return;
    }

    const quantityNum = parseInt(distrib_quantity);

    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (quantityNum > selectedProductQuantity) {
      alert(`Cannot distribute more than available stock (${selectedProductQuantity}).`);
      return;
    }

    if (formRef.current.reportValidity()) {
      setIsAddDistribConfirmOpen(true);
    }
  };

  const handleSubmit = async () => {
    const newDistrib = {
      product: selectedProductId,
      distrib_quantity: parseInt(distrib_quantity),
    };

    console.log("Product ID being sent:", selectedProductId);
    console.log("Distribution data:", newDistrib);

    const result = await addDistrib(newDistrib);

    if (result.success) {
      setProduct('');
      setDistribQuantity('');
      setIsAddDistribConfirmOpen(false);
      onClose();
    } else {
      console.error('Failed to add distribution', result.error);
      if (result.error.response?.data) {
        alert("Error: " + JSON.stringify(result.error.response.data));
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">

      <div className="w-[800px] h-auto rounded-lg shadow-lg overflow-hidden border border-gray-400 bg-white">

        <div className="bg-[#F3A026] text-black px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Distribution</h2>
          <button
            type="button"
            className="px-2 py-1 font-bold text-xl rounded hover:bg-[#e08f1c] transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close form"
          >
            🗙
          </button>
        </div>

        <div className="p-6">
          <form ref={formRef}>
            <div className="flex justify-between mb-5 gap-2">

              <div className="relative w-1/2">
                <select
                  value={product}
                  onChange={handleProductChange}
                  className="block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border border-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-[#F3A026] peer"
                  required
                  id="product"
                >
                  <option value="" disabled hidden>Select a product</option>
                  {availableProducts.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <label
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white"
                  htmlFor="product"
                >
                  Product
                </label>
              </div>

              <div className="relative w-1/2">
                <input
                  type="text"
                  value={selectedProductQuantity !== null ? selectedProductQuantity : ''}
                  readOnly
                  className="block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-gray-100 rounded-lg border border-gray-400 appearance-none"
                  placeholder="Available quantity"
                  aria-label="Available quantity"
                  id="availableQuantity"
                />
                <label
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white"
                  htmlFor="availableQuantity"
                >
                  Available Quantity
                </label>
              </div>
            </div>

            <div className="flex justify-between gap-2">
              <div className="relative w-full">
                <input
                  type="number"
                  value={distrib_quantity}
                  onChange={(e) => setDistribQuantity(e.target.value)}
                  className="block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border border-gray-400 appearance-none focus:outline-none focus:ring-2 focus:ring-[#F3A026] peer"
                  required
                  min={1}
                  max={selectedProductQuantity || undefined}
                  id="distribQuantity"
                />
                <label
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:text-[#F3A026]"
                  htmlFor="distribQuantity"
                >
                  Distribution Quantity
                </label>
              </div>
            </div>
          </form>

          <div className="flex justify-center gap-4 mt-6">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-semibold text-lg text-white shadow-md transition-all hover:scale-105"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#F3A026] hover:bg-[#D88D1B] font-semibold text-lg text-white shadow-md transition-all hover:scale-105"
              onClick={validateBeforeConfirm}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isAddDistribConfirm && (
        <AddDistribConfirmation
          onClose={() => setIsAddDistribConfirmOpen(false)}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  );
}
