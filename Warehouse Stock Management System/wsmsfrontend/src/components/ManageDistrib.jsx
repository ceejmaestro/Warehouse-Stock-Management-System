import { useState } from "react";
import { FaTruck } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import AddDistribForm from "../modals/AddDistribForm";

export default function ManageDistrib({ distribs, addDistrib, items }) {

  const [isAddDistribOpen, setIsAddDistribOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDistribs = distribs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(distribs.length / itemsPerPage);

  return (
    <div className="m-4 p-4 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-2xl text-center">Distribution Management</h1>
        <button
          type="button"
          className="p-2 flex items-center justify-between border rounded-lg bg-[#F3A026] hover:bg-[#D88d1B] transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
          onClick={() => setIsAddDistribOpen(true)}
        >
          <FaTruck className="text-2xl mr-2" />
          <span className="font-bold">Add Distribution</span>
        </button>
      </div>

      <table className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg text-left table-fixed">
        <thead className="text-s font-bold uppercase bg-gray-200">
          <tr>
            <th className="w-[150px] px-3 py-3">Product</th>
            <th className="w-[120px] px-3 py-3">Distributed Quantity</th>
            <th className="w-[150px] px-3 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDistribs && currentDistribs.length > 0 ? (
            currentDistribs.map((d) => (
              <tr
                key={d.id ?? d.product_name}
                className="odd:bg-white even:bg-gray-50 border-b border-gray-300"
              >
                <td className="px-3 py-3 font-semibold">{d.product_name ?? "Unknown Product"}</td>
                <td className="px-3 py-3 font-semibold">{d.distrib_quantity ?? "N/A"}</td>
                <td className="px-3 py-3 space-x-2">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium cursor-pointer">
                    Archive
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-4 py-4 text-center font-bold uppercase text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <IoIosArrowBack />
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            className={`px-4 py-2 rounded cursor-pointer ${
              currentPage === i + 1
                ? "bg-[#F3A026] text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Modal */}
      {isAddDistribOpen && (
        <AddDistribForm
          onClose={() => setIsAddDistribOpen(false)}
          addDistrib={addDistrib}
          items={items}
        />
      )}
    </div>
  );
}
