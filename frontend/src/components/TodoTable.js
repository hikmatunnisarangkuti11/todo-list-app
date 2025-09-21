import { useState } from "react";
import { Table, Button, Spin, Tag, Input, Select } from "antd";
import { useTodos } from "../context/TodoContext";
import TodoForm from "./TodoForm";
import DeleteConfirm from "./DeleteConfirm";

function PriorityTag({ priority }) {
  let color = "green";
  if (priority === "high") color = "red";
  else if (priority === "medium") color = "orange";
  return <Tag color={color}>{priority.toUpperCase()}</Tag>;
}

export default function TodoTable() {
  const { todos, categories, loading, createTodo, updateTodo, deleteTodo, toggleComplete } =
    useTodos();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [searchText, setSearchText] = useState("");

  // ✅ state untuk pagination
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const openModal = (todo = null) => {
    setEditingTodo(todo);
    setModalVisible(true);
  };

  const handleSubmit = (values) => {
    if (editingTodo) updateTodo(editingTodo.id, values);
    else createTodo(values);
    setModalVisible(false);
  };

  // ✅ filter berdasarkan search
  const filteredTodos = todos.filter(
    (t) =>
      t.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Category",
      key: "category",
      render: (_, record) => {
        const cat = categories.find((c) => c.id === record.category_id);
        return cat ? cat.name : "-";
      },
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
      render: (p) => <PriorityTag priority={p} />,
    },
    {
      title: "Completed",
      dataIndex: "completed",
      key: "completed",
      render: (c) => (c ? "✅" : "❌"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => openModal(record)} type="link">
            Edit
          </Button>
          <DeleteConfirm
            onConfirm={() => deleteTodo(record.id)}
            successMessage="Todo berhasil dihapus!"
          >
            Hapus
          </DeleteConfirm>
          <Button onClick={() => toggleComplete(record.id)} type="link">
            Toggle
          </Button>
        </>
      ),
    },
  ];

  if (loading)
    return (
      <Spin size="large" style={{ display: "block", margin: "20px auto" }} />
    );

  return (
    <>
      <div
        style={{
          display: "flex",
          marginBottom: 10,
          gap: "8px",
          flexWrap: "wrap",
        }}
      >
        <Input.Search
          placeholder="Search todos..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
          allowClear
        />

        <Select
          value={pagination.pageSize}
          onChange={(value) =>
            setPagination({ ...pagination, pageSize: value, current: 1 })
          }
          style={{ width: 120 }}
        >
          <Select.Option value={10}>10 / page</Select.Option>
          <Select.Option value={20}>20 / page</Select.Option>
        </Select>

        <Button type="primary" onClick={() => openModal()}>
          Add Todo
        </Button>
      </div>

      {/* ✅ Bungkus dengan div biar tabel bisa discroll di layar kecil */}
      <div style={{ overflowX: "auto" }}>
        <Table
          columns={columns}
          dataSource={filteredTodos}
          rowKey="id"
          scroll={{ x: "max-content" }} // ✅ bikin tabel responsif
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: filteredTodos.length,
            onChange: (page, pageSize) => {
              setPagination({ current: page, pageSize });
            },
          }}
        />
      </div>

      <TodoForm
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleSubmit}
        categories={categories}
        todo={editingTodo}
      />
    </>
  );
}
