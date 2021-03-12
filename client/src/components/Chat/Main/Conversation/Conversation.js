import React, { useState } from "react";
import { IoIosSend } from "react-icons/io";
import "./conversation.css";

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
  );
}
