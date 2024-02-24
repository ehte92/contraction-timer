import React from "react";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <TopBar />
      <div className="relative" style={{ paddingBottom: "60px" }}>
        {children}
      </div>
      <BottomNav />
    </>
  );
};

export default Layout;
