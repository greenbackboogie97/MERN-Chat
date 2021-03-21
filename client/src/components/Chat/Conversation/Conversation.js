import React, { useContext, useEffect, useState } from "react";
import "./conversation.css";
import { BiSend } from "react-icons/bi";

import UserContext from "../../../context/UserContext";
import ConversationsContext from "../../../context/ConversationsContext";
import OpenConversationIDContext from "../../../context/OpenConversationIDContext";

import io from "socket.io-client";
import Axios from "axios";

export default function Conversation() {
  const moment = require("moment");

  const { conversations, setConversations } = useContext(ConversationsContext);
  const { openConversationID } = useContext(OpenConversationIDContext);
  const { userData } = useContext(UserContext);

  const [socket, setSocket] = useState();
  const [openConversation, setOpenConversation] = useState();

  const [text, setText] = useState("");
  const username = localStorage.getItem("username");

  // Create Socket
  useEffect(() => {
    const newSocket = io("localhost:5000", { query: { username } });
    setSocket(newSocket);

    return () => newSocket.close();
  }, [username]);

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
    const time = moment().format("h:mm A");
    const msg = {
      sender: userData.user.username,
      message: text,
      time: time,
      conversationID: openConversationID,
    };
    const newConObj = {
      ...openConversation,
      messages: [...openConversation.messages, msg],
    };

    const recipientList = newConObj.recipients;
    emitMessage(recipientList, msg);
    setOpenConversation(newConObj);
    setText("");
  };
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  // Recieve Messages
  useEffect(() => {
    if (socket == null) return;
    socket.on("receive-message", (msg) => {
      console.log(openConversation);
      const sender = msg.sender;
      const message = msg.message;
      const time = msg.time;
      const conversationID = msg.conversationID;
      const newMessage = { sender, message, time, conversationID };

      const newCon = {
        ...openConversation,
        messages: [...openConversation.messages, newMessage],
      };
      setOpenConversation(newCon);

      const syncMessage = async () => {
        try {
          await Axios.post(
            "http://localhost:5000/users/sync_conversation",
            newMessage
          );
        } catch (err) {
          err.response.data.msg && console.log(err.response.data.msg);
        }
      };
      syncMessage();
    });
    return () => socket.off("receive-message");
  }, [socket, openConversation]);

  return (
    <div className="conversation-container">
      {openConversation && (
        <>
          <nav className="conversation-nav">
            <h3 className="conversation-name">{openConversation._id}</h3>
          </nav>
          <div className="messages-container">
            <ul className="messages">
              {openConversation.messages.map((msg, index) => {
                return (
                  <li key={index}>
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
