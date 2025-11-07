import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      <main className="pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;