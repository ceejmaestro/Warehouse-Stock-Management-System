import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function useUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET
  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/users/"); 
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

// POST
const addUser = async (userData) => {
  const normalizedUsername = userData.username?.trim(); // No lowercase here
  const normalizedContact = userData.contact?.trim(); // No lowercase for contact

  const duplicate = users.find(
    (user) =>
      user.username?.trim() === normalizedUsername ||
      user.contact?.trim() === normalizedContact
  );

  if (duplicate) {
    alert("User with this username or contact already exists.");
    return { success: false, error: "Duplicate user" };
  }

  try {
    const res = await axios.post("/users/create/", userData);
    setUsers((prev) => [...prev, res.data]);
    alert("User added successfully!");
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const backendErrors = Object.values(error.response.data).join("\n");
      alert(`Failed to add user: ${backendErrors}`);
    } else {
      alert("Failed to add user.");
    }
    console.error("Add user error:", error);
    return { success: false, error };
  }
};

// PUT
const updateUser = async (id, userData) => {
  const normalizedUsername = userData.username?.trim();
  const normalizedContact = userData.contact?.trim();

  const duplicate = users.find(
    (user) =>
      user.id !== id &&
      (user.username?.trim() === normalizedUsername || user.contact?.trim() === normalizedContact)
  );

  if (duplicate) {
    alert("Another user with this username or contact already exists.");
    return { success: false, error: "Duplicate user" };
  }

  try {
    const res = await axios.put(`/users/update/${id}/`, userData);
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? res.data : user))
    );
    alert("User updated successfully!");
    return { success: true, data: res.data };
  } catch (error) {
    if (error.response && error.response.data) {
      const backendErrors = Object.values(error.response.data).join("\n");
      alert(`Failed to update user: ${backendErrors}`);
    } else {
      alert("Failed to update user.");
    }
    console.error("Update user error:", error);
    return { success: false, error };
  }
};


  // const addUser = async (userData) => {
  //   try {
  //     const res = await axios.post("/users/create/", userData);
  //     setUsers((prev) => [...prev, res.data]);
  //     alert("User added successfully!");
  //     return { success: true, data: res.data };
  //   } catch (error) {
  //     console.error("Add user error:", error);
  //     alert("Failed to add user.");
  //     return { success: false, error };
  //   }
  // };


  // const updateUser = async (id, userData) => {
  //   try {
  //     const res = await axios.put(`/users/update/${id}/`, userData);
  //     setUsers((prev) =>
  //       prev.map((user) => (user.id === id ? res.data : user))
  //     );
  //     alert("User updated successfully!");
  //     return { success: true, data: res.data };
  //   } catch (error) {
  //     console.error("Update user error:", error);
  //     alert("Failed to update user.");
  //     return { success: false, error };
  //   }
  // };

  return [users, loading, addUser, updateUser];
}
