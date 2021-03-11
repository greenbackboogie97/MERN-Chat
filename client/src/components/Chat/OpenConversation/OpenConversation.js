import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import "./openConversation.css";

export default function OpenConversation() {
  const [text, setText] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [inputMessage, setInputMessage] = useState();

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
  };

  const handleClick = (e) => {
    e.preventDefault();
    setInputMessage(text);
    setText("");
  };

  return (
    <div className="conversation-container">
      <div className="messages-container">
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
        <div className="message-block">
          <p className="message-text">Hey how are you</p>
        </div>
      </div>
      <div className="form-container">
        <form>
          <input
            className="text-input"
            type="text"
            placeholder="write something..."
            onChange={handleChange}
            value={text.toString()}
          />
          <button className="send-btn" onClick={handleClick}>
            <IoIosSend />
          </button>
        </form>
      </div>
    </div>
  );
}
