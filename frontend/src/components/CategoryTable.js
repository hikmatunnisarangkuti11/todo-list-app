import { useState, useMemo } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { useCategories } from "../context/CategoryContext";
import DeleteConfirm from "./DeleteConfirm"; 

export default function CategoryTable() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form] = Form.useForm();

  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [search, setSearch] = useState("");

  const openModal = (category = null) => {
    setEditingCategory(category);
    setModalVisible(true);
    form.setFieldsValue({
      name: category?.name || "",
      color: category?.color || undefined,
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await updateCategory(editingCategory.id, values);
        message.success("Kategori berhasil diupdate!");
      } else {
        await addCategory(values);
        message.success("Kategori berhasil ditambahkan!");
      }
      setModalVisible(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error("Gagal menyimpan kategori!");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCategory(id);
      message.success("Kategori berhasil dihapus!");
    } catch (err) {
      message.error("Gagal menghapus kategori!");
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const columns = [
    {
      title: "No",
      key: "no",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      render: (c) => (
        <div
          style={{
            width: 24,
            height: 24,
            backgroundColor: c,
            border: "1px solid #ddd",
          }}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button onClick={() => openModal(record)} type="link">
            Edit
          </Button>
          <DeleteConfirm onConfirm={() => handleDelete(record.id)} successMessage="Kategori berhasil dihapus!">
            Delete
          </DeleteConfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 12,
          gap: "8px",
        }}
      >
        <Input.Search
          placeholder="Search category..."
          allowClear
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPagination({ ...pagination, current: 1 });
          }}
          style={{ width: 250 }}
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
          Add Category
        </Button>
      </div>

      <Table
        dataSource={filteredCategories}
        columns={columns}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: filteredCategories.length,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
      />

      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Nama kategori wajib diisi!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="color"
            label="Color"
            rules={[{ required: true, message: "Pilih warna kategori!" }]}
          >
            <Select>
              <Select.Option value="red">Red</Select.Option>
              <Select.Option value="yellow">Yellow</Select.Option>
              <Select.Option value="green">Green</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
