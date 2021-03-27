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
import URLServerContext from "../../context/URLServerContext";
import DisplayWidthContext from "../../context/DisplayWidthContext";
import Axios from "axios";

export default function Chat(props) {
  const { userData } = useContext(UserContext);
  const { URL } = useContext(URLServerContext);

  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [openConversationID, setOpenConversationID] = useState();
  const history = useHistory();
  const [sync, setSync] = useState(props.synced);

  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const { width } = useContext(DisplayWidthContext);

  useEffect(() => {
    if (!userData.user) {
      history.push("/login");
    }
  });

  const handleSync = (data) => {
    setSync(data);
  };

  useEffect(() => {
    if (width > 1000) {
      setShowSidebar(true);
      setShowChat(true);
    } else {
      setShowSidebar(true);
      setShowSidebar(false);
    }
  }, [width]);

  // Get Chat Info
  useEffect(() => {
    const getChat = async () => {
      if (!userData.user) return;
      const userID = userData.user.id;
      const contactsRes = await Axios.post(`${URL}/users/contacts`, { userID });
      const conversationRes = await Axios.post(`${URL}/users/conversations`, {
        userID,
      });
      setContacts(contactsRes.data);
      setConversations(conversationRes.data);
    };
    getChat();
  }, [userData, sync, URL]);

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

  // useEffect(() => {
  //   width > 1000 ? setAppDisplay("desktop") : setAppDisplay("mobile");
  // }, []);

  return (
    <ContactsContext.Provider value={{ contacts, setContacts }}>
      <ConversationsContext.Provider
        value={{ conversations: formatedConversations, setConversations }}
      >
        <OpenConversationIDContext.Provider
          value={{ openConversationID, setOpenConversationID }}
        >
          <div className="chat-container">
            {width < 1000 ? (
              showSidebar && (
                <Sidebar
                  setShowChat={setShowChat}
                  setShowSidebar={setShowSidebar}
                  parentCallback={handleSync}
                />
              )
            ) : (
              <Sidebar parentCallback={handleSync} />
            )}
            {openConversationID && showChat ? (
              <Conversation
                setShowChat={setShowChat}
                setShowSidebar={setShowSidebar}
              />
            ) : (
              showChat && (
                <Placeholder
                  setShowChat={setShowChat}
                  setShowSidebar={setShowSidebar}
                />
              )
            )}
          </div>
        </OpenConversationIDContext.Provider>
      </ConversationsContext.Provider>
    </ContactsContext.Provider>
  );
}
