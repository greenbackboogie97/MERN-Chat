import React, { useContext, useState } from "react";
import {
  Modal,
  Form,
  Button,
  FormGroup,
  FormCheck,
  OverlayTrigger,
  Popover,
} from "react-bootstrap";
import ContactsContext from "../../../../../context/ContactsContext";
import ConversationsContext from "../../../../../context/ConversationsContext";
import UserContext from "../../../../../context/UserContext";
import Axios from "axios";

export default function NewConversationModal({ closeModal }) {
  const { contacts } = useContext(ContactsContext);
  const { userData } = useContext(UserContext);
  // eslint-disable-next-line no-unused-vars
  const { conversations, setConversations } = useContext(ConversationsContext);

  const [error, setError] = useState();

  const popover = (
    <Popover style={!error ? { display: "none" } : null} id="popover-basic">
      <Popover.Content>{error}</Popover.Content>
    </Popover>
  );

  const [selectedContacts, setSelectedContacts] = useState([]);
  const userID = userData.user.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      err.response.data.msg && setError(err.response.data.msg);
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
                type="checkbox"
                value={selectedContacts.includes(contact.username)}
                label={contact.name}
                onChange={() => handleCheckboxChange(contact.username)}
              />
            </FormGroup>
          ))}
          <div className="modal-btn-div">
            <OverlayTrigger trigger="click" placement="right" overlay={popover}>
              <Button
                id="modal-btn"
                type="submit"
                variant="link"
                onClick={() => setError(undefined)}
                disabled={selectedContacts.length === 0 ? true : false}
              >
                Create
              </Button>
            </OverlayTrigger>
          </div>
        </Form>
      </Modal.Body>
    </>
  );
}
