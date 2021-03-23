import React, { useContext, useState } from "react";
import { Modal, Form, Button, FormGroup, FormCheck } from "react-bootstrap";
import ContactsContext from "../../../../../context/ContactsContext";
import ConversationsContext from "../../../../../context/ConversationsContext";
import UserContext from "../../../../../context/UserContext";
import Axios from "axios";

export default function NewConversationModal({ closeModal }) {
  const { contacts } = useContext(ContactsContext);
  const { userData } = useContext(UserContext);
  const { setConversations } = useContext(ConversationsContext);

  const [selectedContacts, setSelectedContacts] = useState([]);

  // Create Conversation
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userID = userData.user.id;
    try {
      const submitRes = await Axios.post(
        "http://localhost:5000/users/create_conversation",
        {
          selectedContacts,
          userID,
        }
      );

      if (!submitRes) console.log("something went wrong...");
      setConversations((prevConversations) => {
        return [
          ...prevConversations,
          {
            recipients: [userData.user.username, ...selectedContacts],
            messages: [],
          },
        ];
      });
      closeModal();
    } catch (err) {
      console.log("something went wrong...");
    }
  };

  const handleCheckboxChange = (contactUsername) => {
    setSelectedContacts((prevSelectedContacts) => {
      if (prevSelectedContacts.includes(contactUsername)) {
        return prevSelectedContacts.filter((prevContact) => {
          return contactUsername !== prevContact;
        });
      } else return [...prevSelectedContacts, contactUsername];
    });
  };
  return (
    <>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {contacts.map((contact, index) => (
            <FormGroup controlId={contact.username} key={index}>
              <FormCheck
                style={{ fontSize: "1.2rem", margin: "1rem" }}
                type="checkbox"
                value={selectedContacts.includes(contact.username)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.username)}
              />
            </FormGroup>
          ))}
          <div className="modal-btn-div">
            <Button
              id="modal-btn"
              type="submit"
              variant="link"
              disabled={selectedContacts.length === 0 ? true : false}
            >
              Create Conversation
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
}
