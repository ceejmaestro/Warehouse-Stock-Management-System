import { useEffect, useState } from "react";
import axios from "../api/axios";

export default function useDistrib() {
  const [distribs, setDistribs] = useState([]);
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch full product list with ids and names
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products/");
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch grouped products with available stock
  useEffect(() => {
    const fetchGroupedProducts = async () => {
      try {
        const response = await axios.get("/api/grouped-products/");
        const availableProducts = response.data.filter(item => item.total_quantity > 0);
        setGroupedProducts(availableProducts);
      } catch (error) {
        console.error("Failed to fetch grouped products:", error);
      }
    };

    fetchGroupedProducts();
  }, []);

  // Fetch distribution records and enrich them with current product quantities
  useEffect(() => {
    if (groupedProducts.length === 0) return;

    const fetchDistributions = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/distributions/");
        const enriched = response.data.map(distrib => {
          const product = groupedProducts.find(
            p => p.product_name === distrib.product_name
          );
          return {
            ...distrib,
            product_qty: product?.total_quantity ?? 0,
          };
        });
        setDistribs(enriched);
      } catch (error) {
        console.error("Failed to fetch distributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDistributions();
  }, [groupedProducts]);

  // Create a new distribution and update local state
  const addDistrib = async (distribData) => {
    try {
      const response = await axios.post("/distributions/", distribData);

      const product = groupedProducts.find(
        p => p.product_name === response.data.product_name
      );

      const enrichedDistrib = {
        ...response.data,
        quantity: response.data.distrib_quantity ?? response.data.quantity,
        product_qty: product?.total_quantity ?? 0,
      };

      setDistribs(prev => [...prev, enrichedDistrib]);

      alert("Distribution added successfully!");
      return { success: true, data: enrichedDistrib };
    } catch (error) {
      console.error("Failed to add distribution:", error);
      // Improved error message extraction
      const backendMessage =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        (typeof error.response?.data === 'string' ? error.response.data : null);

      alert(
        backendMessage ||
        error.message ||
        "Failed to add distribution. Please try again."
      );
      return { success: false, error };
    }
  };

  return {
    distribs,
    groupedProducts,
    products,
    loading,
    addDistrib,
  };
}
