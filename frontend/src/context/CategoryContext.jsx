import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CategoryContext = createContext();

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (data) => {
    const res = await axios.post("http://localhost:8080/api/categories/", data);
    setCategories((prev) => [...prev, res.data]);
  };

  const updateCategory = async (id, data) => {
    const res = await axios.put(`http://localhost:8080/api/categories/${id}`, data);
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? res.data : c))
    );
  };

  const deleteCategory = async (id) => {
    await axios.delete(`http://localhost:8080/api/categories/${id}`);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoryContext);
}
