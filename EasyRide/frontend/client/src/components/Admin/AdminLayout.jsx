import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main Content */}
      <div className="flex-grow-1 p-4" style={{ backgroundColor: "#f8f9fa" }}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;