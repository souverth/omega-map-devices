import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import "./App.css";
import { AppLayout } from "./layouts";
import { DashboardPage } from "./pages";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          borderRadius: 4,
          motion: false,
        },
        components: {},
        hashed: false,
      }}
    >
      <AntdApp>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route index element={<AppLayout />} ></Route>
                <Route element={<AppLayout />} >
                  <Route  path="/map" element={<DashboardPage />} />
                </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
