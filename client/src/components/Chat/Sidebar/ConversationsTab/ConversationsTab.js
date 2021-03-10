import React, { useContext } from "react";
import "./conversationsTab.css";
import { ListGroup } from "react-bootstrap";
import ConversationsContext from "../../../../context/ConversationsContext";
import OpenConversationIDContext from "../../../../context/OpenConversationIDContext";

export default function Conversations() {
  // eslint-disable-next-line no-unused-vars
  const { conversations, setConversations } = useContext(ConversationsContext);
  // eslint-disable-next-line no-unused-vars
  const { openConversationID, setOpenConversationID } = useContext(
    OpenConversationIDContext
  );

  const handleClick = (e) => {
    setOpenConversationID(e.target.id);
  };

  return (
    <ListGroup variant="flush">
      {conversations.map((conversation, index) => {
        return (
          <ListGroup.Item
            action
            className="list"
            key={index}
            onClick={handleClick}
            id={conversation._id}
          >
            {conversation.recipients.map((r) => r.name).join(", ")}
          </ListGroup.Item>
        );
      })}
    </ListGroup>
  );
}
