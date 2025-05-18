import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function useItem() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // GET
  useEffect(() => {
    const getItems = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/products/"); 
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

    const addItem = async (itemData) => {
    try {
      const res = await axios.post("/products/create/", itemData);
      setItems((prev) => [...prev, res.data]);
      alert("Item added successfully!");
      return { success: true, data: res.data };
    } catch (error) {
      if (error.response) {
        console.error("Add item error response data:", error.response.data);
        alert("Failed to add item: " + JSON.stringify(error.response.data));
      } else {
        console.error("Add item error:", error);
        alert("Failed to add item.");
      }
      return { success: false, error };
    }
  };

    const updateItem = async (id, itemData) => {
    try {
      const res = await axios.put(`/products/update/${id}/`, itemData);
      setItems((prev) =>
        prev.map((item) => (item.product_id === id ? res.data : item))
      );
      alert("Item updated successfully!");
      return { success: true, data: res.data };
    } catch (error) {
      console.error("Update item error:", error);
      alert("Failed to update item.");
      return { success: false, error };
    }
  };

  return [items, loading, addItem, updateItem];
}
