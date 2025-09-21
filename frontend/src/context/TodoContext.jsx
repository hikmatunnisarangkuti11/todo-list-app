import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { message } from "antd";

const TodoContext = createContext();
export const useTodos = () => useContext(TodoContext);

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/categories/");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      message.error("Failed to fetch categories!");
    }
  };

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:8080/api/todos/");
      setTodos(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch todos:", err);
      message.error("Failed to fetch todos!");
    }
    setLoading(false);
  };

  const createTodo = async (todo) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/todos/", todo);
      setTodos((prev) => [...prev, res.data]);
      message.success("Todo created successfully!");
    } catch (err) {
      console.error("Failed to create todo:", err);
      message.error("Failed to create todo!");
    }
    setLoading(false);
  };

  const updateTodo = async (id, todo) => {
    setLoading(true);
    try {
      const res = await axios.put(`http://localhost:8080/api/todos/${id}`, todo);
      setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      message.success("Todo updated successfully!");
    } catch (err) {
      console.error("Failed to update todo:", err);
      message.error("Failed to update todo!");
    }
    setLoading(false);
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));
      message.success("Todo deleted successfully!");
    } catch (err) {
      console.error("Failed to delete todo:", err);
      message.error("Failed to delete todo!");
    }
    setLoading(false);
  };

  const toggleComplete = async (id) => {
    try {
      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const updated = { ...todo, completed: !todo.completed };
      const res = await axios.put(`http://localhost:8080/api/todos/${id}`, updated);
      setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)));
      message.success("Todo status updated!");
    } catch (err) {
      console.error("Failed to toggle complete:", err);
      message.error("Failed to update status!");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTodos();
  }, []);

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        loading,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
