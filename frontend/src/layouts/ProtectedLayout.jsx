import React from "react";
import Sidebar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const ProtectedLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh", overflowX: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, background: "#fff", overflowY: "auto" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedLayout;
