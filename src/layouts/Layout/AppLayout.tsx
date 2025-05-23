import {
  DashboardOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, Space, theme, type MenuProps } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";
import type { MenuItemGroupType, MenuItemType } from "antd/es/menu/interface";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import styles from "./style.module.css";

type MenuItem = Required<MenuProps>["items"][number];

const AppLayout: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    const pathname = location.pathname.slice(1).replace("admin/", "");
    if (pathname.includes("/")) {
      const arr = pathname.split("/");
      const firstSegment: string = arr[0];
      const lastSegment: string = arr[arr.length - 1];
      const findMenu = items.find((n) => n?.key == firstSegment);
      if (findMenu !== undefined) {
        const menuGroup = findMenu as MenuItemGroupType<MenuItemType>;
        const findSubMenu = menuGroup.children?.find(
          (n) => n?.key == `${firstSegment}-${lastSegment}`
        );
        if (findSubMenu !== undefined) {
          const subMenu = findSubMenu as MenuItemType;
          setTitle(subMenu?.title ?? "");
        } else {
          // setTitle(menuGroup?.title ?? '')
        }
      } else {
        // setTitle(adminPageTitle)
      }
    } else {
      const findMenu = items.find((n) => n?.key === pathname);
      if (findMenu !== undefined) {
        if (findMenu != null) {
          const menu = findMenu as MenuItemType;
          setTitle(menu.title ?? "");
        }
      }
    }
  }, []);

  const [title, setTitle] = useState<string>("");

  const [collapsed, setCollapsed] = useState(false);

  const defaultOpenKeys = useMemo<string[]>(() => {
    const pathname = window.location.pathname.slice(1).replace("/", "");
    const arr = pathname.split("/");
    if (arr.length > 1) {
      const firstSegment = arr[0];
      return [firstSegment];
    }
    return [];
  }, []);

  const defaultSelectedKeys = useMemo<string[]>(() => {
    const pathname = window.location.pathname.slice(1).replace("/", "");
    const arr = pathname.split("/");
    if (arr.length === 1) {
      return [arr[0]];
    } else if (arr.length > 1) {
      const firstSegment = arr[0];
      const lastSegment = arr[1];
      return [`${firstSegment}-${lastSegment}`];
    }
    return [];
  }, []);

  return (
    <Fragment>
      <Layout>
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ height: "100vh" }}
        >
          <div
            style={{
              height: 32,
              margin: "16px",
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: 6,
            }}
          >
            <div className={styles.textLogo}>{collapsed ? "A" : "Admin"}</div>
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultOpenKeys={defaultOpenKeys}
            defaultSelectedKeys={defaultSelectedKeys}
            items={items} /*  */
          />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
              borderBottom: "1px solid #f0f2f5",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
              }}
            >
              <div>
                <Button
                  type="text"
                  icon={
                    collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                  }
                  onClick={() => setCollapsed(!collapsed)}
                  style={{ fontSize: 16, width: 64, height: 64 }}
                />
                <span style={{ fontSize: 18, fontWeight: 600 }}>{title}</span>
              </div>
              <Space style={{ marginRight: 24 }}>
                <UserOutlined />
                <span>Ethan</span>
              </Space>
            </div>
          </Header>
          <div style={{ overflowY: "auto", height: "calc(100vh - 65px)" }}>
            <Content
              style={{
                margin: "6px 8px 8px 8px",
                minHeight: "auto",
              }}
            >
              <Outlet />
            </Content>
          </div>
        </Layout>
      </Layout>
    </Fragment>
  );
};

export default AppLayout;

const items: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link to="/dashboard">Dashboard</Link>,
    title: "Dashboard",
  },
];
