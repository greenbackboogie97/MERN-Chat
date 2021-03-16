import React from "react";
import "./conversation.css";
import { BiSend } from "react-icons/bi";

export default function Conversation() {
  const handleInputSubmit = (e) => {
    e.preventDefault();
  };

  const handleEnterSubmit = (e) =>
    e.charCode === 13 ? handleInputSubmit(e) : null;

  return (
    <div className="conversation-container">
      <nav className="conversation-nav">
        <h3 className="conversation-name">Chat Name</h3>
      </nav>
      <div className="messages-container">
        <ul className="messages">
          <li>
            <div className="message">
              <div className="sender">Jess</div>
              <div className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </div>
              <div className="time">3:33 PM</div>
            </div>
          </li>
          <li>
            <div className="message-you">
              <div className="sender">You</div>
              <div className="text">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod.
              </div>
              <div className="time">3:33 PM</div>
            </div>
          </li>
        </ul>
      </div>
      <form onKeyPress={handleEnterSubmit} className="message-form">
        <input
          className="text-input"
          type="text"
          placeholder="Write something..."
          autoCorrect="off"
        />
        <BiSend className="send" onClick={handleInputSubmit} />
      </form>
    </div>
  );
}
