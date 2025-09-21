import { Modal, Form, Input, Select, DatePicker } from "antd";
import { useEffect } from "react";
import moment from "moment";

export default function TodoForm({ visible, onCancel, onSubmit, categories, todo }) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      title: todo?.title || "",
      description: todo?.description || "",
      category_id: todo?.category_id || (categories[0]?.id),
      priority: todo?.priority || "low",
      due_date: todo?.due_date ? moment(todo.due_date) : null,
    });
  }, [todo, categories, form]);

  const handleOk = () => {
    form.validateFields().then(values => {
      values.due_date = values.due_date ? values.due_date.toISOString() : null;
      onSubmit(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={todo ? "Edit Todo" : "Add Todo"}
      open={visible}
      onOk={handleOk}
      onCancel={() => { form.resetFields(); onCancel(); }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea />
        </Form.Item>
        <Form.Item name="category_id" label="Category" rules={[{ required: true }]}>
          <Select>
            {categories.map(c => (
              <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="priority" label="Priority" rules={[{ required: true }]}>
          <Select>
            <Select.Option value="high">High</Select.Option>
            <Select.Option value="medium">Medium</Select.Option>
            <Select.Option value="low">Low</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="due_date" label="Due Date">
          <DatePicker showTime />
        </Form.Item>
      </Form>
    </Modal>
  );
}
