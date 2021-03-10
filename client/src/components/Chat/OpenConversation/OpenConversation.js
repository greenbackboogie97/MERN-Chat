import React, { useState } from "react";
import { Container, Form, InputGroup, Row, Col } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import "./openConversation.css";

export default function OpenConversation() {
  const [text, setText] = useState("");
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
    <Container fluid className="h-100 p-2 d-flex justify-content-center">
      <Row
        className="d-inline-flex w-100 m-0 h-100 flex-column"
        style={{
          background: "rgba(0, 0, 0, 0.2)",
          borderRadius: "0.25rem",
          boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Col
          className="w-100 h-100 d-flex flex-column p-2"
          xs
          sm
          md
          lg="11"
        ></Col>
        <Col className="d-inline-flex h-100 w-100 p-2">
          <Form className="h-100 w-100">
            <Form.Group className="h-100">
              <InputGroup className="h-100">
                <Form.Control
                  className="h-100"
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
        </Col>
      </Row>
    </Container>
  );
}
