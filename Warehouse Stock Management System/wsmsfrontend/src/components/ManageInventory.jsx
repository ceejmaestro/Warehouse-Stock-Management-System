import { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function ManageInventory({ items }) {

  const [currentFoodPage, setCurrentFoodPage] = useState(1);
  const [currentBodyCarePage, setCurrentBodyCarePage] = useState(1);
  const [currentFabricPage, setCurrentFabricPage] = useState(1);
  const [currentHomeCarePage, setCurrentHomeCarePage] = useState(1);

  const [searchFood, setSearchFood] = useState("");
  const [searchBodyCare, setSearchBodyCare] = useState("");
  const [searchFabric, setSearchFabric] = useState("");
  const [searchHomeCare, setSearchHomeCare] = useState("");

  const itemsPerPage = 5;

  const filteredFoodItems = items.filter(item =>
    [
      "Knorr Beef Cube", 
      "Knorr Pork Cube",
      "Knorr Chicken Cube",
      "Knorr Sinigang Sampaloc",
      "Knorr Sinigang Gabi",
      "Knorr Sinigang Miso",
      "Royal Pasta Elbow Macaroni",
      "Royal Pasta Long Spaghetti",
      "Energen Vanilla",
      "555 New Sardines in Tomato Sauce",
      "Lady's Choice Chicken Spread",
      "Lady's Choice Ham Spread",
      "BestFoods Peanut Butter",
      "Lipton Ice Tea"
    ].includes(item.product_name)
  ).filter(item =>
    item.product_name.toLowerCase().includes(searchFood.toLowerCase())
  );
  
  const filteredBodyCareItems = items.filter(item =>
    [
      "Ponds Eye Cream",
      "Ponds Serum",
      "Ponds Facial Mist Cleanser",
      "Ponds UV Cream",
      "Rexona Men's Deodorant",
      "Rexona Women's Deodorant",
      "Dove Deodorant",
      "Dove Beauty Bar",
      "Dove Body Lotion",
      "Sunsilk Shampoo",
      "Creamsilk Conditioner",
      "Close up Toothpaste",
      "Pepsodent Toothpaste",
    ].includes(item.product_name)
  ).filter(item =>
    item.product_name.toLowerCase().includes(searchBodyCare.toLowerCase())
  );

  const filteredFabricEnhancers = items.filter(item =>
    [
      "Surf Fabcon Morning Fresh",
      "Surf Fabcon Blossom Fresh",
      "Surf Powder Lavender",
    ].includes(item.product_name) 
  ).filter(item =>
    item.product_name.toLowerCase().includes(searchFabric.toLowerCase())
  );

  const filteredHomeCareItems = items.filter(item =>
    [
      "Domex Classic",
      "Domex Lemon Explosion"
    ].includes(item.product_name)
  ).filter(item =>
    item.product_name.toLowerCase().includes(searchHomeCare.toLowerCase())
  );

  // Pagination for Food and Other Consumables
  const indexOfLastFoodItem = currentFoodPage * itemsPerPage;
  const indexOfFirstFoodItem = indexOfLastFoodItem - itemsPerPage;
  const currentFoodItems = filteredFoodItems.slice(indexOfFirstFoodItem, indexOfLastFoodItem);
  const totalFoodPages = Math.ceil(filteredFoodItems.length / itemsPerPage);

  // Pagination for Body Care
  const indexOfLastBodyCareItem = currentBodyCarePage * itemsPerPage;
  const indexOfFirstBodyCareItem = indexOfLastBodyCareItem - itemsPerPage;
  const currentBodyCareItems = filteredBodyCareItems.slice(indexOfFirstBodyCareItem, indexOfLastBodyCareItem);
  const totalBodyCarePages = Math.ceil(filteredBodyCareItems.length / itemsPerPage);

  // Pagination for Fabric Enhancers
  const indexOfLastFabricItem = currentFabricPage * itemsPerPage;
  const indexOfFirstFabricItem = indexOfLastFabricItem - itemsPerPage;
  const currentFabricItems = filteredFabricEnhancers.slice(indexOfFirstFabricItem, indexOfLastFabricItem);
  const totalFabricPages = Math.ceil(filteredFabricEnhancers.length / itemsPerPage);

  // Pagination for Home Care
  const indexOfLastHomeCareItem = currentHomeCarePage * itemsPerPage;
  const indexOfFirstHomeCareItem = indexOfLastHomeCareItem - itemsPerPage;
  const currentHomeCareItems = filteredHomeCareItems.slice(indexOfFirstHomeCareItem, indexOfLastHomeCareItem);
  const totalHomeCarePages = Math.ceil(filteredHomeCareItems.length / itemsPerPage);

  return (
    <div className="m-4 p-4 border border-gray-300 rounded-lg shadow-lg">
      <h1 className="font-bold text-2xl text-start mb-5">Inventory Management</h1>
      <div className="flex">
        {/* Food and Other Consumables Table */}
        <div className="flex justify-start p-2">
          <div className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-5">
              <h1 className="font-bold text-2xl text-gray-800">Food and Other Consumables</h1>
              <input
                type="text"
                placeholder="Search Food"
                className="border rounded px-3 py-1 text-sm"
                value={searchFood}
                onChange={(e) => {
                  setSearchFood(e.target.value);
                  setCurrentFoodPage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg text-left table-fixed">
                <thead className="text-sm font-bold uppercase bg-gray-200">
                  <tr>
                    <th className="w-[150px] px-3 py-3">Product Name</th>
                    <th className="w-[150px] px-3 py-3">Quantity</th>
                    <th className="w-[200px] px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFoodItems.length > 0 ? (
                    currentFoodItems.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50 border-b border-gray-300">
                        <td className="px-3 py-3 font-medium">{item.product_name}</td>
                        <td className="px-3 py-3 font-medium">{item.total_quantity}</td>
                        <td className="px-3 py-3 space-x-2">
                          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
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
            </div>

            {/* Pagination controls for Food and Other Consumables */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                aria-label="Previous Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentFoodPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentFoodPage === 1}
              >
                <IoIosArrowBack />
              </button>

              {[...Array(totalFoodPages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${currentFoodPage === i + 1 ? "bg-[#F3A026] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => setCurrentFoodPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                aria-label="Next Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentFoodPage((prev) => Math.min(prev + 1, totalFoodPages))}
                disabled={currentFoodPage === totalFoodPages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>

        {/* Body Care */}
        <div className="flex justify-start p-2">
          <div className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-5">
              <h1 className="font-bold text-2xl text-gray-800">Body Care</h1>
              <input
                type="text"
                placeholder="Search Body Care"
                className="border rounded px-3 py-1 text-sm"
                value={searchBodyCare}
                onChange={(e) => {
                  setSearchBodyCare(e.target.value);
                  setCurrentBodyCarePage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg text-left table-fixed">
                <thead className="text-sm font-bold uppercase bg-gray-200">
                  <tr>
                    <th className="w-[150px] px-3 py-3">Product Name</th>
                    <th className="w-[150px] px-3 py-3">Quantity</th>
                    <th className="w-[200px] px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBodyCareItems.length > 0 ? (
                    currentBodyCareItems.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50 border-b border-gray-300">
                        <td className="px-3 py-3 font-medium">{item.product_name}</td>
                        <td className="px-3 py-3 font-medium">{item.total_quantity}</td>
                        <td className="px-3 py-3 space-x-2">
                          <button className="bg-[#F3A026] hover:bg-[#e39320] text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
                            Update
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
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
            </div>

            {/* Pagination controls for Body Care */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                aria-label="Previous Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentBodyCarePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentBodyCarePage === 1}
              >
                <IoIosArrowBack />
              </button>

              {[...Array(totalBodyCarePages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${currentBodyCarePage === i + 1 ? "bg-[#F3A026] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => setCurrentBodyCarePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                aria-label="Next Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentBodyCarePage((prev) => Math.min(prev + 1, totalBodyCarePages))}
                disabled={currentBodyCarePage === totalBodyCarePages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex">
        {/* Fabric Enhancer */}
        <div className="flex justify-start p-2">
          <div className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-5">
              <h1 className="font-bold text-2xl text-gray-800">Fabric Enhancers</h1>
              <input
                type="text"
                placeholder="Search Fabric Enhancers"
                className="border rounded px-3 py-1 text-sm"
                value={searchFabric}
                onChange={(e) => {
                  setSearchFabric(e.target.value);
                  setCurrentFabricPage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg text-left table-fixed">
                <thead className="text-sm font-bold uppercase bg-gray-200">
                  <tr>
                    <th className="w-[150px] px-3 py-3">Product Name</th>
                    <th className="w-[150px] px-3 py-3">Quantity</th>
                    <th className="w-[200px] px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentFabricItems.length > 0 ? (
                    currentFabricItems.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50 border-b border-gray-300">
                        <td className="px-3 py-3 font-medium">{item.product_name}</td>
                        <td className="px-3 py-3 font-medium">{item.total_quantity}</td>
                        <td className="px-3 py-3 space-x-2">
                          <button className="bg-[#F3A026] hover:bg-[#e39320] text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
                            Update
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
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
            </div>

            {/* Pagination controls for Fabric Enhancer */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                aria-label="Previous Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentFabricPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentFabricPage === 1}
              >
                <IoIosArrowBack />
              </button>

              {[...Array(totalFabricPages )].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${currentFabricPage === i + 1 ? "bg-[#F3A026] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => setCurrentFabricPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                aria-label="Next Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentFabricPage((prev) => Math.min(prev + 1, totalFabricPages ))}
                disabled={currentFabricPage === totalFabricPages }
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>

        {/* Home Care */}
        <div className="flex justify-start p-2">
          <div className="w-full max-w-4xl border border-gray-300 rounded-lg shadow-lg p-6 bg-white">
            <div className="flex justify-between items-center mb-5">
              <h1 className="font-bold text-2xl text-gray-800">Home Care</h1>
              <input
                type="text"
                placeholder="Search Home Care"
                className="border rounded px-3 py-1 text-sm"
                value={searchHomeCare}
                onChange={(e) => {
                  setSearchHomeCare(e.target.value);
                  setCurrentHomeCarePage(1);
                }}
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg text-left table-fixed">
                <thead className="text-sm font-bold uppercase bg-gray-200">
                  <tr>
                    <th className="w-[150px] px-3 py-3">Product Name</th>
                    <th className="w-[150px] px-3 py-3">Quantity</th>
                    <th className="w-[200px] px-3 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {currentHomeCareItems.length > 0 ? (
                    currentHomeCareItems.map((item, index) => (
                      <tr key={index} className="odd:bg-white even:bg-gray-50 border-b border-gray-300">
                        <td className="px-3 py-3 font-medium">{item.product_name}</td>
                        <td className="px-3 py-3 font-medium">{item.total_quantity}</td>
                        <td className="px-3 py-3 space-x-2">
                          <button className="bg-[#F3A026] hover:bg-[#e39320] text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
                            Update
                          </button>
                          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transition-transform transform hover:scale-105">
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
            </div>

            {/* Pagination controls for Home Care */}
            <div className="flex justify-center mt-4 gap-2">
              <button
                aria-label="Previous Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentHomeCarePage((prev) => Math.max(prev - 1, 1))}
                disabled={currentHomeCarePage === 1}
              >
                <IoIosArrowBack />
              </button>

              {[...Array(totalHomeCarePages)].map((_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${currentHomeCarePage === i + 1 ? "bg-[#F3A026] text-white" : "bg-gray-200 hover:bg-gray-300"}`}
                  onClick={() => setCurrentHomeCarePage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}

              <button
                aria-label="Next Page"
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                onClick={() => setCurrentHomeCarePage((prev) => Math.min(prev + 1, totalHomeCarePages))}
                disabled={currentHomeCarePage === totalHomeCarePages}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
