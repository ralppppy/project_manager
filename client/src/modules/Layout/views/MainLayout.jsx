import React, { useState } from "react";
import { Affix, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate, useResolvedPath } from "react-router-dom";
import "./styles.css";
import { LayoutHeader, SideBarMenu } from "../components";
import { LoginController } from "../../Guest/controller";

const { Content, Sider, Header } = Layout;

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const router = useResolvedPath();
  const navigate = useNavigate();

  const { handleLogout } = LoginController({ navigate });

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      {/* <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
      </Sider> */}
      <SideBarMenu
        router={router}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Layout
        style={{
          height: "100vh",
          overflow: "auto",
        }}
      >
        <LayoutHeader
          handleLogout={handleLogout}
          colorBgContainer={colorBgContainer}
          setCollapsed={setCollapsed}
          collapsed={collapsed}
        />
        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          <Outlet />
          <div style={{ height: 20 }} />
        </Content>
      </Layout>
    </Layout>
  );

  return (
    <Layout>
      <SideBarMenu
        router={router}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Layout>
        {/* <LayoutHeader
          handleLogout={handleLogout}
          colorBgContainer={colorBgContainer}
          setCollapsed={setCollapsed}
          collapsed={collapsed}
        /> */}

        <Content
          style={{
            margin: "24px 16px 0",
          }}
        >
          "SDFSDF"
          <Outlet />
        </Content>
      </Layout>
      sdfsdf
    </Layout>
  );
};

export default React.memo(MainLayout);
