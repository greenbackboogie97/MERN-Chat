import React, { useContext } from "react";
import "./sidebarContent.css";

import ConversationsContext from "../../../../context/ConversationsContext";
import OpenConversationIDContext from "../../../../context/OpenConversationIDContext";
import ContactsContext from "../../../../context/ContactsContext";

export default function SidebarContent(props) {
  const { contacts } = useContext(ContactsContext);
  const { conversations } = useContext(ConversationsContext);
  const { openConversationID, setOpenConversationID } = useContext(
    OpenConversationIDContext
  );

  // Select Conversation
  const handleConversationClick = (e) => {
    setOpenConversationID(e.target.id);
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
                  {contact.name}
                </li>
              );
            })}
      </ul>
    </div>
  );
}
