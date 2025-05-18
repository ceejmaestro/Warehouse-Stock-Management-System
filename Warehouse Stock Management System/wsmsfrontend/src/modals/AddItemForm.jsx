import React, { useState, useRef } from 'react';
import AddItemConfirmation from './confirmationmodals/AddItemConfirmation';
import BarcodeScanner from '../barcode/BarcodeScanner';

export default function AddItemForm({ onClose, addItem }) {
  const [barcode_no, setBarcodeNo] = useState("");
  const [product_id, setProductId] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_detail, setProductDetail] = useState("");
  const [product_qty, setProductQty] = useState("");
  const [product_expiry, setProductExpiry] = useState("");

  const [isAddItemConfirm, setIsAddItemConfirmOpen] = useState(false);
  const [isBarcodeScannerOpen, setIsBarcodeScannerOpen] = useState(false);
  const formRef = useRef(null);

  // Validation error states
  const [errors, setErrors] = useState({
    barcode_no: "",
    product_id: "",
    product_name: "",
    product_detail: "",
    product_qty: "",
    product_expiry: "",
  });

  const validate = () => {
    const newErrors = {};

    // barcode_no validation: required, alphanumeric or EAN-13 numeric (13 digits)
    if (!barcode_no.trim()) {
      newErrors.barcode_no = "Barcode No is required";
    } else if (!(/^[a-zA-Z0-9]+$/.test(barcode_no.trim()) || /^[0-9]{13}$/.test(barcode_no.trim()))) {
      newErrors.barcode_no = "Barcode No must be alphanumeric or a 13-digit EAN-13 number";
    } else {
      newErrors.barcode_no = "";
    }

    // product_id validation: required, alphanumeric
    if (!product_id.trim()) {
      newErrors.product_id = "Item ID is required";
    } else if (!/^[a-zA-Z0-9]+$/.test(product_id.trim())) {
      newErrors.product_id = "Item ID must be alphanumeric";
    } else {
      newErrors.product_id = "";
    }

    // product_name validation: required
    if (!product_name.trim()) {
      newErrors.product_name = "Item Name is required";
    } else {
      newErrors.product_name = "";
    }

    // product_detail validation: required
    if (!product_detail.trim()) {
      newErrors.product_detail = "Item Detail is required";
    } else {
      newErrors.product_detail = "";
    }

    // product_qty validation: required, positive integer
    if (!product_qty.trim()) {
      newErrors.product_qty = "Quantity is required";
    } else if (!/^[0-9]+$/.test(product_qty.trim()) || parseInt(product_qty, 10) <= 0) {
      newErrors.product_qty = "Quantity must be a positive number";
    } else {
      newErrors.product_qty = "";
    }

    // product_expiry validation: required, valid date, not past date
    if (!product_expiry) {
      newErrors.product_expiry = "Expiration Date is required";
    } else if (isNaN(Date.parse(product_expiry))) {
      newErrors.product_expiry = "Expiration Date is invalid";
    } else if (new Date(product_expiry) < new Date(new Date().toDateString())) {
      newErrors.product_expiry = "Expiration Date cannot be in the past";
    } else {
      newErrors.product_expiry = "";
    }

    setErrors(newErrors);

    // Return true if no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async () => {
    const newItem = {
      barcode_no,
      product_id,
      product_name,
      product_detail,
      product_qty: parseInt(product_qty, 10),
      product_expiry,
    };

    const result = await addItem(newItem);
    if (result.success) {
      setBarcodeNo("");
      setProductId("");
      setProductName("");
      setProductDetail("");
      setProductQty("");
      setProductExpiry("");
      setIsAddItemConfirmOpen(false);
      onClose();
    } else {
      console.error("Failed to add item", result.error);
    }
  };

  const handleBarcodeScanned = (scannedBarcode) => {
    setBarcodeNo(scannedBarcode);
    setProductId(scannedBarcode);
    // Do not auto-add item here, allow user to fill other fields and submit manually
    setIsBarcodeScannerOpen(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="w-[800px] h-auto rounded-lg shadow-lg overflow-hidden border border-gray-400">
        <div className="bg-[#F3A026] text-black px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Create New Item</h2>
          <button
            type="button"
            className="px-2 py-1 font-bold text-xl rounded hover:bg-[#e08f1c] transition-colors cursor-pointer"
            onClick={onClose}
          >
            🗙
          </button>
        </div>

        <div className="bg-white p-6">
          <form ref={formRef} noValidate>
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  name="barcode_no"
                  id="barcodeno_input"
                  value={barcode_no}
                  onChange={(e) => setBarcodeNo(e.target.value)}
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.barcode_no ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="barcodeno_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Barcode No
                </label>
                {errors.barcode_no && <p className="text-red-500 text-xs mt-1">{errors.barcode_no}</p>}
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  name="product_id"
                  id="productid_input"
                  value={product_id}
                  onChange={(e) => setProductId(e.target.value)}
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_id ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="productid_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Item ID
                </label>
                {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
              </div>
            </div>

            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <select
                  name="product_name"
                  value={product_name}
                  onChange={(e) => setProductName(e.target.value)}
                  id="product_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_name ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  required
                >
                  <option value="" disabled hidden>
                    Select a product
                  </option>

                  {/* Food and Other Consumables */}
                  <option value="Knorr Beef Cube">Knorr Beef Cube</option>
                  <option value="Knorr Pork Cube">Knorr Pork Cube</option>
                  <option value="Knorr Chicken Cube">Knorr Chicken Cube</option>

                  <option value="Knorr Sinigang Sampaloc">Knorr Sinigang Sampaloc</option>
                  <option value="Knorr Sinigang Gabi">Knorr Sinigang Gabi</option>
                  <option value="Knorr Sinigang Miso">Knorr Sinigang Miso</option>

                  <option value="Royal Pasta Elbow Macaroni">Royal Pasta Elbow Macaroni</option>
                  <option value="Royal Pasta Long Spaghetti">Royal Pasta Long Spaghetti</option>

                  <option value="Energen Vanilla">Energen Vanilla</option>

                  <option value="555 New Sardines in Tomato Sauce">555 New Sardines in Tomato Sauce</option>

                  <option value="Lady's Choice Chicken Spread">Lady's Choice Chicken Spread</option>
                  <option value="Lady's Choice Ham Spread">Lady's Choice Ham Spread</option>

                  <option value="BestFoods Peanut Butter">BestFoods Peanut Butter</option>

                  <option value="Lipton Ice Tea">Lipton Ice Tea</option>

                  {/* Body Care */}
                  <option value="Ponds Eye Cream">Ponds Eye Cream</option>
                  <option value="Ponds Serum">Ponds Serum</option>
                  <option value="Ponds Facial Mist Cleanser">Ponds Facial Mist Cleanser</option>
                  <option value="Ponds UV Cream">Ponds UV Cream</option>

                  <option value="Rexona Men's Deodorant">Rexona Men's Deodorant</option>
                  <option value="Rexona Women's Deodorant">Rexona Women's Deodorant</option>

                  <option value="Dove Deodorant">Dove Deodorant</option>
                  <option value="Dove Beauty Bar">Dove Beauty Bar</option>
                  <option value="Dove Body Lotion">Dove Body Lotion</option>

                  <option value="Sunsilk Shampoo">Sunsilk Shampoo</option>
                  <option value="Creamsilk Conditioner">Creamsilk Conditioner</option>

                  <option value="Close up Toothpaste">Close up Toothpaste</option>
                  <option value="Pepsodent Toothpaste">Pepsodent Toothpaste</option>

                  {/* Fabric Enhancers */}
                  <option value="Surf Fabcon Morning Fresh">Surf Fabcon Morning Fresh</option>
                  <option value="Surf Fabcon Blossom Fresh">Surf Fabcon Blossom Fresh</option>

                  <option value="Surf Powder Lavender">Surf Powder Lavender</option>

                  {/* Home Care */}
                  <option value="Domex Classic">Domex Classic</option>
                  <option value="Domex Lemon Explosion">Domex Lemon Explosion</option>
                </select>

                <label
                  htmlFor="product_input"
                  className={`absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 ${
                    errors.product_name ? "text-red-500" : "text-gray-600"
                  }`}
                >
                  Item Name
                </label>
                {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
              </div>

              <div className="relative w-1/2">
                <input
                  type="text"
                  name="product_detail"
                  value={product_detail}
                  onChange={(e) => setProductDetail(e.target.value)}
                  id="productdetail_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_detail ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                {errors.product_detail && <p className="text-red-500 text-xs mt-1">{errors.product_detail}</p>}
                <label
                  htmlFor="productdetail_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Item Detail
                </label>
              </div>
            </div>

            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  name="product_qty"
                  value={product_qty}
                  onChange={(e) => setProductQty(e.target.value)}
                  id="productqty_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_qty ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                {errors.product_qty && <p className="text-red-500 text-xs mt-1">{errors.product_qty}</p>}
                <label
                  htmlFor="productqty_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Quantity
                </label>
              </div>
              <div className="relative w-1/2">
                <input
                  type="date"
                  name="product_expiry"
                  value={product_expiry}
                  onChange={(e) => setProductExpiry(e.target.value)}
                  id="productexpiry_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_expiry ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                {errors.product_expiry && <p className="text-red-500 text-xs mt-1">{errors.product_expiry}</p>}
                <label
                  htmlFor="productexpiry_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Expiration Date
                </label>
              </div>
            </div>
          </form>

          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-semibold text-lg text-white shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
              onClick={() => setIsBarcodeScannerOpen(true)}
            >
              Scan
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-semibold text-lg text-white shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[#F3A026] hover:bg-[#D88D1B] font-semibold text-lg text-white shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
              onClick={() => {
                if (formRef.current.reportValidity() && validate()) {
                  setIsAddItemConfirmOpen(true);
                }
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {isAddItemConfirm && (
        <AddItemConfirmation
          onClose={() => setIsAddItemConfirmOpen(false)}
          onConfirm={handleSubmit}
        />
      )}

      {isBarcodeScannerOpen && (
        <BarcodeScanner
          onClose={() => setIsBarcodeScannerOpen(false)}
          onScan={handleBarcodeScanned}
        />
      )}
    </div>
  );
}
