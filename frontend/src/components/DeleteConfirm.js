import { Popconfirm, Button } from "antd";

export default function DeleteConfirm({ onConfirm, children }) {
  return (
    <Popconfirm
      title="Yakin ingin menghapus data ini?"
      okText="Ya"
      cancelText="Batal"
      onConfirm={onConfirm}
    >
      <Button type="link" danger>
        {children || "Delete"}
      </Button>
    </Popconfirm>
  );
}
