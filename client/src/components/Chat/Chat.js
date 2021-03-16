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
  // eslint-disable-next-line no-unused-vars
  const { userData, setUserData } = useContext(UserContext);
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [openConversationID, setOpenConversationID] = useState();
  const history = useHistory();

  useEffect(() => {
    const getContacts = async () => {
      const userID = userData.user.id;
      const contactsRes = await Axios.post(
        "http://localhost:5000/users/contacts",
        { userID }
      );
      setContacts(contactsRes.data);
    };
    getContacts();
  }, [userData]);

  useEffect(() => {
    const getConversations = async () => {
      const userID = userData.user.id;
      const conversationRes = await Axios.post(
        "http://localhost:5000/users/conversations",
        { userID }
      );
      setConversations(conversationRes.data);
    };
    getConversations();
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
