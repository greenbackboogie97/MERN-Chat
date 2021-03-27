import React, { useCallback, useContext, useEffect, useState } from "react";
import "./conversation.css";
import { BiSend } from "react-icons/bi";
import { AiOutlineArrowLeft } from "react-icons/ai";

import UserContext from "../../../context/UserContext";
import ConversationsContext from "../../../context/ConversationsContext";
import ContactsContext from "../../../context/ContactsContext";
import OpenConversationIDContext from "../../../context/OpenConversationIDContext";
import URLServerContext from "../../../context/URLServerContext";

import io from "socket.io-client";
import Axios from "axios";

export default function Conversation(props) {
  const { conversations } = useContext(ConversationsContext);
  const { contacts } = useContext(ContactsContext);
  const { openConversationID } = useContext(OpenConversationIDContext);
  const { userData } = useContext(UserContext);
  const { URL } = useContext(URLServerContext);

  const [socket, setSocket] = useState();
  const [openConversation, setOpenConversation] = useState();
  const [text, setText] = useState("");

  const username = localStorage.getItem("username");
  const moment = require("moment");

  const setRef = useCallback((node) => {
    if (node) node.scrollIntoView({ smooth: true });
  }, []);

  // Create Socket
  useEffect(() => {
    const newSocket = io(`${URL}`, { query: { username } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [username, URL]);

  // Set Open Conversation
  useEffect(() => {
    const conversation = conversations.filter(
      (conversation) => conversation._id === openConversationID
    )[0];
    setOpenConversation(conversation);
  }, [openConversationID, conversations]);

  const emitMessage = async (recipients, message) =>
    await socket.emit("send-message", {
      recipients,
      message,
    });

  //Send Message
  const handleInputSubmit = async (e) => {
    e.preventDefault();

    const time = moment().format("DD/MM/YY h:mm:A");
    const msg = {
      sender: userData.user.username,
      message: text,
      time: time,
      conversationID: openConversationID,
    };
    if (!text) return;

    const newConObj = {
      ...openConversation,
      messages: [...openConversation.messages, msg],
    };

    const recipientList = newConObj.recipients;
    emitMessage(recipientList, msg);
    setOpenConversation(newConObj);

    const syncMessage = async () => {
      try {
        await Axios.post(`${URL}/users/sync_conversation`, msg);
      } catch (err) {
        err.response.data.msg && console.log(err.response.data.msg);
      }
    };
    syncMessage();
    setText("");
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Recieve Messages
  useEffect(() => {
    if (socket == null) return;
    socket.on("receive-message", (msg) => {
      const sender = msg.sender;
      const message = msg.message;
      const time = msg.time;
      const conversationID = msg.conversationID;
      const newMessage = { sender, message, time, conversationID };

      const newCon = {
        ...openConversation,
        messages: [...openConversation.messages, newMessage],
      };
      if (conversationID === openConversation._id) setOpenConversation(newCon);

      const syncMessage = async () => {
        try {
          await Axios.post(`${URL}/users/sync_conversation`, newMessage);
        } catch (err) {
          err.response.data.msg && console.log(err.response.data.msg);
        }
      };
      syncMessage();
    });
    return () => socket.off("receive-message");
  }, [socket, openConversation, URL]);

  const handleArrowClick = () => {
    props.setShowSidebar(true);
    props.setShowChat(false);
  };

  return (
    <div
      style={
        window.innerWidth > 1000 && openConversation
          ? { display: "flex" }
          : null
      }
      className="conversation-container"
      id="conversation-container"
    >
      {openConversation && (
        <>
          <nav className="conversation-nav">
            <AiOutlineArrowLeft id="arrow-icon" onClick={handleArrowClick} />
            <h3 className="conversation-name">{openConversation._id}</h3>
          </nav>
          <div className="messages-container">
            <ul className="messages">
              {openConversation.messages.map((msg, index) => {
                const isContact = contacts.find(
                  (contact) => contact.username === msg.sender
                );
                const lastMessage =
                  openConversation.messages.length - 1 === index;
                return (
                  <li key={index} ref={lastMessage ? setRef : null}>
                    <div
                      className={
                        msg.sender === userData.user.username
                          ? "message-you"
                          : "message"
                      }
                    >
                      <div className="sender">
                        {msg.sender === userData.user.username
                          ? "You"
                          : isContact
                          ? isContact.name
                          : msg.sender}
                      </div>
                      <div className="text">{msg.message}</div>
                      <div className="time">{msg.time}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <form
            onKeyPress={(e) => e.charCode === 13 && handleInputSubmit(e)}
            className="message-form"
          >
            <input
              className="text-input"
              onChange={handleTextChange}
              type="text"
              value={text}
              placeholder="Write something..."
              autoCorrect="off"
            />
            <BiSend className="send" onClick={handleInputSubmit} />
          </form>
        </>
      )}
    </div>
  );
}
