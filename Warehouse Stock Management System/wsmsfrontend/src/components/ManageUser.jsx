import { useState } from "react";
import { FaUser } from "react-icons/fa";
import AddUserForm from "../modals/AddUserForm";
import UpdateUserForm from "../modals/UpdateUserForm";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function ManageUser({ users, addUser, updateUser }) {
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const filteredUsers = users.filter(user =>
    user.id.toString().includes(searchQuery.trim())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="m-4 p-4 border border-gray-300 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-5">
        <h1 className="font-bold text-2xl text-center">User Management</h1>
        <form className="flex gap-5">
          <div className="flex relative w-full">
            <div className="border rounded-lg">
              <input
                type="text"
                id="search_input"
                className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-black peer"
                placeholder=" "
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <label
                htmlFor="search_input"
                className="absolute text-sm text-black duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
              >
                Search by ID
              </label>
            </div>
            <button
              type="button"
              className="ml-5 p-2 flex items-center justify-between border rounded-lg bg-[#F3A026] hover:bg-[#D88d1B] transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
              onClick={() => setIsAddUserOpen(true)}
            >
              <FaUser className="text-2xl mr-2"/>
              <span className="font-bold">Add new user</span>
            </button>
          </div>
        </form>
      </div>
      <div>
        <table className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-lg shadow-lg text-left table-fixed">
          <thead className="text-s font-bold uppercase bg-gray-200">
            <tr>
              <th className="w-[100px] px-3 py-3">ID</th>
              <th className="w-[150px] px-3 py-3">Firstname</th>
              <th className="w-[150px] px-3 py-3">Lastname</th>
              <th className="w-[150px] px-3 py-3">Contact</th>
              <th className="w-[150px] px-3 py-3">Birthdate</th>
              <th className="w-[150px] px-3 py-3">Role</th>
              <th className="w-[150px] px-3 py-3">Status</th>
              <th className="w-[150px] px-3 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers && currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50 border-b border-gray-300">
                  <td className="px-3 py-3 text-m font-semibold">{user.id}</td>
                  <td className="px-3 py-3 text-m font-semibold">{user.firstname}</td>
                  <td className="px-3 py-3 text-m font-semibold">{user.lastname}</td>
                  <td className="px-3 py-3 text-m font-semibold">{user.contact}</td>
                  <td className="px-3 py-3 text-m font-semibold">{user.birthdate}</td>
                  <td className="px-3 py-3 text-m font-semibold">{user.role}</td>
                  <td className="px-3 py-3 text-m font-semibold">
                    <span className="text-green-600">
                      {user.status}
                    </span>
                  </td>

                  <td className="px-3 py-3 space-x-2">
                    <button
                      className="bg-[#F3A026] hover:bg-[#e39320] text-white px-3 py-1 rounded text-sm font-medium transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedUser(user);
                        setIsUpdateUserOpen(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium transform transition-all duration-200 ease-in-out hover:scale-105 focus:outline-none cursor-pointer"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 py-4 text-center font-bold uppercase text-gray-500"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
                : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
            }`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 cursor-pointer"
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>

      {/* Modals */}
      {isAddUserOpen && (
        <AddUserForm onClose={() => setIsAddUserOpen(false)} addUser={addUser} />
      )}

      {isUpdateUserOpen && selectedUser && (
        <UpdateUserForm
          onClose={() => {
            setIsUpdateUserOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          updateUser={updateUser}
        />
      )}
    </div>
  );
}
