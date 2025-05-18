export default function AddDistribConfirmation({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',}}>
      <div className="bg-white p-8 w-[400px] z-60 rounded-lg shadow-lg overflow-hidden border border-gray-400">
        <h2 className="text-xl text-center font-bold mb-6 text-gray-800">Are you sure?</h2>
        <div className="flex justify-center gap-6 mt-4">
          <button
            type="button"
            className="px-6 py-3 rounded-lg bg-gray-400 hover:bg-gray-500 font-semibold text-lg text-white shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-6 py-3 rounded-lg bg-[#F3A026] text-white font-semibold text-lg shadow-lg transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
