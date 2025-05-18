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
        const res = await axios.get("http://localhost:8000/api/api/grouped-products/");
        setItems(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };
    getItems();
  }, []);

  return [items, loading,];
}
