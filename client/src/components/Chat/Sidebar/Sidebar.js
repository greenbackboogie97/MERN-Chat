import React, { useState } from "react";
import "./sidebar.css";
import Nav from "./Nav/Nav";
import SidebarContent from "./SidebarContent/SidebarContent";

export default function Sidebar() {
  const [curTabOpen, setCurTabOpen] = useState(1);

  const handleTabOpen = (index) => {
    setCurTabOpen(index);
  };

  return (
    <div className="sidebar">
      <Nav onTabOpen={handleTabOpen} />
      <SidebarContent tabContentIndex={curTabOpen} />
      <div className="credit">© 2021 Omer Ziger. All rights reserved.</div>
    </div>
  );
}
