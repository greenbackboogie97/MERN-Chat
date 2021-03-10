import React, { useContext } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import "./contactsTab.css";
import ContactsContext from "../../../../context/ContactsContext";

export default function ContactsTab() {
  const { contacts } = useContext(ContactsContext);

  return (
    <ListGroup variant="flush">
      {contacts.map((contact, index) => {
        return (
          <ListGroupItem action className="list" key={index}>
            {contact.name}
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
