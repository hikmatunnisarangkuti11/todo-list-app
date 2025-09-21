import { useState } from "react";
import { Layout, Menu, Button } from "antd";
import { AppstoreOutlined, UnorderedListOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import TodoPage from "./pages/TodoPage";
import CategoryPage from "./pages/CategoryPage";

const { Header, Sider, Content } = Layout;

export default function App() {
  const [selectedMenu, setSelectedMenu] = useState("todos");
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        breakpoint="lg"
        collapsedWidth="0"
        style={{ backgroundColor: "#001529" }}
        trigger={null} 
      >
        <div
          style={{
            height: 32,
            margin: 16,
            color: "white",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          TodoApp
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
        >
          <Menu.Item key="todos" icon={<UnorderedListOutlined />}>
            Todos
          </Menu.Item>
          <Menu.Item key="categories" icon={<AppstoreOutlined />}>
            Categories
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Button
            type="text"
            onClick={() => setCollapsed(!collapsed)}
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            style={{ fontSize: 20 }}
          />
          <h1 style={{ margin: 0 }}>{selectedMenu === "todos" ? "Todos" : "Categories"}</h1>
        </Header>
        <Content style={{ margin: "16px" }}>
          {selectedMenu === "todos" ? <TodoPage /> : <CategoryPage />}
        </Content>
      </Layout>
    </Layout>
  );
}
