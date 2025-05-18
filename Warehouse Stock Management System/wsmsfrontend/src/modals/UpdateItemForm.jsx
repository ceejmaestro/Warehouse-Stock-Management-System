import { useEffect, useState } from "react";
import UpdateItemConfirmation from "./confirmationmodals/UpdateItemConfirmation";

export default function UpdateItemForm({ onClose, item, updateItem }) {
  const [barcode_no, setBarcodeNo] = useState("");
  const [product_id, setProductId] = useState("");
  const [product_name, setProductName] = useState("");
  const [product_detail, setProductDetail] = useState("");
  const [product_qty, setProductQty] = useState("");
  const [product_expiry, setProductExpiry] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUpdateItemConfirm, setIsUpdateItemConfirmOpen] = useState(false);

  // Validation error states
  const [errors, setErrors] = useState({
    barcode_no: "",
    product_id: "",
    product_name: "",
    product_detail: "",
    product_qty: "",
    product_expiry: "",
  });

  useEffect(() => {
    if (item) {
      setBarcodeNo(item.barcode_no || "");
      setProductId(item.product_id || "");
      setProductName(item.product_name || "");
      setProductDetail(item.product_detail || "");
      setProductQty(item.product_qty || "");
      setProductExpiry(item.product_expiry || "");
    }
  }, [item]);

  const validate = () => {
    const newErrors = {};

    // barcode_no validation: required, alphanumeric
    if (!barcode_no.trim()) {
      newErrors.barcode_no = "Barcode No is required";
    } else if (!/^[a-zA-Z0-9]+$/.test(barcode_no.trim())) {
      newErrors.barcode_no = "Barcode No must be alphanumeric";
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
    if (typeof product_qty === 'string' && !product_qty.trim()) {
      newErrors.product_qty = "Quantity is required";
    } else if (!/^[0-9]+$/.test(String(product_qty).trim()) || parseInt(product_qty, 10) <= 0) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    setLoading(true);
    setError(null);

    const updatedItem = {
      barcode_no,
      product_id,
      product_name,
      product_detail,
      product_qty,
      product_expiry,
    };

    try {
      const result = await updateItem(item.product_id, updatedItem);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || "An error occurred while updating the Item.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    const isDataChanged =
      barcode_no !== item.barcode_no ||
      product_id !== item.product_id ||
      product_name !== item.product_name ||
      product_detail !== item.product_detail ||
      product_qty !== item.product_qty ||
      product_expiry !== item.product_expiry;

    if (isDataChanged) {
      if (validate()) {
        setIsUpdateItemConfirmOpen(true);
      }
    } else {
      alert("No changes made to the item data.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="w-[800px] h-auto rounded-lg shadow-lg overflow-hidden border border-gray-400">
        {/* Modal Header */}
        <div className="bg-[#F3A026] text-black px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Update Item</h2>
          <button
            type="button"
            className="px-2 py-1 font-bold text-xl rounded hover:bg-[#e08f1c] transition-colors cursor-pointer"
            onClick={onClose}
          >
            🗙
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-white p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Row 1 */}
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={barcode_no}
                  onChange={(e) => setBarcodeNo(e.target.value)}
                  id="barcodeno_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.barcode_no ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                {errors.barcode_no && <p className="text-red-500 text-xs mt-1">{errors.barcode_no}</p>}
                <label
                  htmlFor="barcodeno_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Barcode No
                </label>
              </div>

              <div className="relative w-1/2">
                <input
                  type="text"
                  value={product_id}
                  onChange={(e) => setProductId(e.target.value)}
                  id="productid_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_id ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                {errors.product_id && <p className="text-red-500 text-xs mt-1">{errors.product_id}</p>}
                <label
                  htmlFor="productid_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Item ID
                </label>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={product_name}
                  onChange={(e) => setProductName(e.target.value)}
                  id="productname_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.product_name ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                {errors.product_name && <p className="text-red-500 text-xs mt-1">{errors.product_name}</p>}
                <label
                  htmlFor="productname_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Item Name
                </label>
              </div>

              <div className="relative w-1/2">
                <input
                  type="text"
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
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-[#F3A026] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
                >
                  Item Detail
                </label>
              </div>
            </div>

            {/* Row 3 */}
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-gray-400 hover:bg-gray-500 font-semibold text-lg text-white shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-[#F3A026] hover:bg-[#D88D1B] font-semibold text-lg text-white shadow-md transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
              onClick={handleSaveClick}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isUpdateItemConfirm && (
        <UpdateItemConfirmation
          onClose={() => setIsUpdateItemConfirmOpen(false)}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  );
}
