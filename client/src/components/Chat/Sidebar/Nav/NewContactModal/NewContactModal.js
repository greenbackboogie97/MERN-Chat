import React, { useRef, useState, useContext } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import "./newContactModal.css";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "tippy.js/dist/svg-arrow.css";
import "tippy.js/themes/light.css";
import UserContext from "../../../../../context/UserContext";
import ContactsContext from "../../../../../context/ContactsContext";
import Axios from "axios";

export default function NewContactModal({ closeModal }) {
  const { userData } = useContext(UserContext);
  const { setContacts } = useContext(ContactsContext);

  const usernameRef = useRef();
  const nameRef = useRef();
  const [error, setError] = useState();

  // Add Contact
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userID = userData.user.id;
    const nameValue = nameRef.current.value;
    const usernameValue = usernameRef.current.value;
    const contactData = { usernameValue, nameValue, userID };

    try {
      const submitRes = await Axios.post(
        "http://localhost:5000/users/create_contact",
        { contactData }
      );

      if (!submitRes) {
        console.log("something went wrong.");
      }

      setContacts((prevContacts) => {
        return [
          ...prevContacts,
          {
            username: usernameValue,
            name: nameValue,
          },
        ];
      });
      closeModal();
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label style={{ fontSize: "1.2rem" }}>Username</Form.Label>
            <Form.Control
              autoComplete="off"
              autoCorrect="off"
              type="text"
              ref={usernameRef}
              required
              placeholder="Enter username"
            ></Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ fontSize: "1.2rem" }}>Display Name</Form.Label>
            <Form.Control
              autoComplete="off"
              autoCorrect="off"
              type="text"
              ref={nameRef}
              required
              placeholder="Name your contact"
            ></Form.Control>
          </Form.Group>
          <div className="modal-btn-div">
            <Tippy
              placement={"bottom"}
              theme={"light"}
              visible={error ? true : false}
              content={error}
            >
              <Button
                id="modal-btn"
                type="submit"
                variant="link"
                onClick={() => setError(undefined)}
              >
                Add Contact
              </Button>
            </Tippy>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
}
