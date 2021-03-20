import React, { useEffect, useContext, useState } from "react";
import "./chat.css";
import Sidebar from "./Sidebar/Sidebar";
import Conversation from "./Conversation/Conversation";
import Placeholder from "./Placeholder/Placeholder";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";
import ContactsContext from "../../context/ContactsContext";
import ConversationsContext from "../../context/ConversationsContext";
import OpenConversationIDContext from "../../context/OpenConversationIDContext";
import Axios from "axios";

export default function Chat() {
  const { userData } = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [openConversationID, setOpenConversationID] = useState();
  const history = useHistory();

  // Get Chat Info
  useEffect(() => {
    const getChat = async () => {
      if (!userData.user) return;
      const userID = userData.user.id;
      const contactsRes = await Axios.post(
        "http://localhost:5000/users/contacts",
        { userID }
      );
      const conversationRes = await Axios.post(
        "http://localhost:5000/users/conversations",
        { userID }
      );
      setContacts(contactsRes.data);
      setConversations(conversationRes.data);
    };
    getChat();
  }, [userData]);

  const formatedConversations = conversations.map((conversation) => {
    const recipients = conversation.recipients.map((recipient) => {
      const contact = contacts.find((contact) => {
        return contact.username === recipient;
      });
      const name =
        (contact && contact.name) ||
        (recipient === userData.user.username && "You") ||
        recipient;
      return { username: recipient, name };
    });

    return { ...conversation, recipients };
  });

  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
  });

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      <ConversationsContext.Provider
        value={{ conversations: formatedConversations, setConversations }}
      >
        <OpenConversationIDContext.Provider
          value={{ openConversationID, setOpenConversationID }}
        >
          <div className="chat-container">
            <Sidebar />
            {openConversationID ? <Conversation /> : <Placeholder />}
          </div>
        </OpenConversationIDContext.Provider>
      </ConversationsContext.Provider>
    </ContactsContext.Provider>
  );
}
