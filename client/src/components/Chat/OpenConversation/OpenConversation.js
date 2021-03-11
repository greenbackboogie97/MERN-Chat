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
    <Form>
      <Form.Group>
        <InputGroup>
          <Form.Control
            onChange={handleChange}
            value={text.toString()}
            placeholder="Write something..."
          ></Form.Control>
          <InputGroup.Append>
            <button id="send-btn" onClick={handleClick}>
              <IoIosSend />
            </button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </Form>
  );
}
