import React, { useState } from "react";
import "./sidebar.css";
import Nav from "./Nav/Nav";
import SidebarContent from "./SidebarContent/SidebarContent";

export default function Sidebar(props) {
  const [curTabOpen, setCurTabOpen] = useState(1);
  const handleTabOpen = (index) => {
    setCurTabOpen(index);
  };

  const handleCallback = (data) => {
    props.parentCallback(data);
  };

  return (
    <div className="sidebar" id="sidebar">
      <Nav onTabOpen={handleTabOpen} />
      <SidebarContent
        setShowSidebar={props.setShowSidebar}
        setShowChat={props.setShowChat}
        parentCallback={handleCallback}
        tabContentIndex={curTabOpen}
      />
      <div className="credit">© 2021 Omer Ziger. All rights reserved.</div>
    </div>
  );
}
