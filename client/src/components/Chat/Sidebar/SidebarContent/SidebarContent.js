import React, { useContext, useEffect, useState } from "react";
import "./sidebarContent.css";

import ConversationsContext from "../../../../context/ConversationsContext";
import OpenConversationIDContext from "../../../../context/OpenConversationIDContext";
import ContactsContext from "../../../../context/ContactsContext";
import DisplayWidthContext from "../../../../context/DisplayWidthContext";

export default function SidebarContent(props) {
  const { contacts } = useContext(ContactsContext);
  const { conversations, setConversations } = useContext(ConversationsContext);
  const { openConversationID, setOpenConversationID } = useContext(
    OpenConversationIDContext
  );
  const { width } = useContext(DisplayWidthContext);

  // Select Conversation
  const handleConversationClick = (e) => {
    setConversations((prev) => prev);
    props.parentCallback(e.target.id);
    setOpenConversationID(e.target.id);
    if (width < 1000) {
      props.setShowChat(true);
      props.setShowSidebar(false);
    }
  };

  return (
    <div className="sidebar-content">
      <ul className="tab-items">
        {props.tabContentIndex === 1
          ? conversations.map((conversation, index) => {
              return (
                <li
                  className={
                    openConversationID !== conversation._id
                      ? "tabItem"
                      : "tabItemActive"
                  }
                  key={index}
                  onClick={handleConversationClick}
                  id={conversation._id}
                >
                  {conversation.recipients.map((r) => r.name).join(", ")}
                </li>
              );
            })
          : contacts.map((contact, index) => {
              return (
                <li className="tabItem" key={index}>
                  <div>Username: {contact.username}</div>
                  <div>Display Name: {contact.name}</div>
                </li>
              );
            })}
      </ul>
    </div>
  );
}
