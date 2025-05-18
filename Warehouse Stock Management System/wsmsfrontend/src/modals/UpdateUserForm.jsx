import { useEffect, useState } from "react";
import UpdateUserConfirmation from "./confirmationmodals/UpdateUserConfirmation";

export default function UpdateUserForm({ onClose, user, updateUser }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [contact, setContact] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isUpdateUserConfirm, setIsUpdateUserConfirmOpen] = useState(false);

  // Validation error states
  const [errors, setErrors] = useState({
    firstname: "",
    lastname: "",
    contact: "",
    birthdate: "",
    username: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || "");
      setLastname(user.lastname || "");
      setContact(user.contact || "");
      setBirthdate(user.birthdate || "");
      setUsername(user.username || "");
      setPassword(user.password || "");
    }
  }, [user]);

  const validate = () => {
    const newErrors = {};

    // Firstname validation: required, letters only
    if (!firstname.trim()) {
      newErrors.firstname = "Firstname is required";
    } else if (!/^[A-Za-z]+$/.test(firstname.trim())) {
      newErrors.firstname = "Firstname must contain letters only";
    } else {
      newErrors.firstname = "";
    }

    // Lastname validation: required, letters only
    if (!lastname.trim()) {
      newErrors.lastname = "Lastname is required";
    } else if (!/^[A-Za-z]+$/.test(lastname.trim())) {
      newErrors.lastname = "Lastname must contain letters only";
    } else {
      newErrors.lastname = "";
    }

    // Contact validation: required, numbers only
    if (!contact.trim()) {
      newErrors.contact = "Contact is required";
    } else if (!/^[0-9]+$/.test(contact.trim())) {
      newErrors.contact = "Contact must contain numbers only";
    } else {
      newErrors.contact = "";
    }

    // Birthdate validation: required, valid date, not future date
    if (!birthdate) {
      newErrors.birthdate = "Birthdate is required";
    } else if (isNaN(Date.parse(birthdate))) {
      newErrors.birthdate = "Birthdate is invalid";
    } else if (new Date(birthdate) > new Date()) {
      newErrors.birthdate = "Birthdate cannot be in the future";
    } else {
      newErrors.birthdate = "";
    }

    // Username validation: required
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else {
      newErrors.username = "";
    }

    // Password validation: optional, min length 6 if provided
    if (password && password.length > 0 && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else {
      newErrors.password = "";
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

    const updatedUser = {
      firstname,
      lastname,
      contact,
      birthdate,
      username,
      password: password ? password : undefined,
    };

    try {
      const result = await updateUser(user.id, updatedUser);
      if (result.success) {
        onClose();
      } else {
        setError(result.message || "An error occurred while updating the user.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = () => {
    const isDataChanged =
      firstname !== user.firstname ||
      lastname !== user.lastname ||
      contact !== user.contact ||
      birthdate !== user.birthdate ||
      username !== user.username ||
      (password && password !== user.password);

    if (isDataChanged) {
      if (validate()) {
        setIsUpdateUserConfirmOpen(true);
      }
    } else {
      alert("No changes made to the user data.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-40">
      <div className="w-[800px] h-auto rounded-lg shadow-lg overflow-hidden border border-gray-400">
        {/* Modal Header */}
        <div className="bg-[#F3A026] text-black px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">Update User</h2>
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
          {/* Error Message */}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* First and Last Name */}
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  id="firstname_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.firstname ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="firstname_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Firstname
                </label>
                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
              </div>
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  id="lastname_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.lastname ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="lastname_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Lastname
                </label>
                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
              </div>
            </div>

            {/* Contact and Birthdate */}
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  id="contact_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.contact ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="contact_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Contact
                </label>
                {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
              </div>
              <div className="relative w-1/2">
                <input
                  type="date"
                  value={birthdate}
                  onChange={(e) => setBirthdate(e.target.value)}
                  id="birthdate_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.birthdate ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="birthdate_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Birthdate
                </label>
                {errors.birthdate && <p className="text-red-500 text-xs mt-1">{errors.birthdate}</p>}
              </div>
            </div>

            {/* Username and Password */}
            <div className="flex justify-between mb-5 gap-2">
              <div className="relative w-1/2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  id="username_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="username_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Username
                </label>
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </div>
              <div className="relative w-1/2">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password_input"
                  className={`block px-4 py-3 w-full text-sm shadow-lg text-gray-900 bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-2 peer ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-400 focus:ring-[#F3A026]"
                  }`}
                  placeholder=" "
                />
                <label
                  htmlFor="password_input"
                  className="absolute text-sm text-gray-600 duration-300 transform -translate-y-4 scale-75 top-2 left-4 z-10 origin-[0] bg-white peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:px-2 peer-focus:text-[#F3A026]"
                >
                  Password
                </label>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
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
      {isUpdateUserConfirm && (
        <UpdateUserConfirmation
          onClose={() => setIsUpdateUserConfirmOpen(false)}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  );
}
