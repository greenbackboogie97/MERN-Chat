import React, { useState } from "react";
import { Tab, Nav, Modal, Container, Row, Col } from "react-bootstrap";
import "./sidebar.css";
import ConversationsTab from "./ConversationsTab/ConversationsTab";
import NewConversationModal from "./ConversationsTab/NewConversationModal/NewConversationModal";
import NewContactModal from "./ContactsTab/NewContactModal/NewContactModal";
import ContactsTab from "./ContactsTab/ContactsTab";

const CONVERSATIONS_KEY = "conversations";
const CONTACTS_KEY = "contacts";

export default function Sidebar() {
  const [activeKey, setActiveKey] = useState(CONVERSATIONS_KEY);
  const [modalOpen, setModalOpen] = useState(false);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Container fluid className="h-100 d-flex p-2 justify-content-center">
        <Row
          className="d-inline-flex m-0 h-100 flex-column"
          style={{
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "0.25rem",
            boxShadow: "6px 6px 20px rgba(0, 0, 0, 0.5)",
          }}
        >
          <Col md lg="11" className="d-flex flex-column mw-100 p-2">
            <Tab.Container activeKey={activeKey} onSelect={setActiveKey}>
              <Nav
                className="d-inline-flex justify-content-center border-bottom"
                variant="tabs"
              >
                <Nav.Item>
                  <Nav.Link eventKey={CONVERSATIONS_KEY}>
                    Conversations
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={CONTACTS_KEY}>Contacts</Nav.Link>
                </Nav.Item>
              </Nav>
              <Tab.Content className="h-100 overflow-auto">
                <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                  <ConversationsTab />
                </Tab.Pane>
                <Tab.Pane eventKey={CONTACTS_KEY}>
                  <ContactsTab />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Col>
          <Col className="d-inline-flex flex-column justify-content-end w-100 p-2 h-100">
            <button
              className="w-100 h-100 p-0 m-0"
              id="form-btn"
              onClick={() => setModalOpen(true)}
            >
              New {activeKey === CONVERSATIONS_KEY ? "Conversation" : "Contact"}
            </button>
          </Col>
        </Row>
      </Container>

      <Modal show={modalOpen} onHide={closeModal} centered animation={false}>
        {activeKey === CONVERSATIONS_KEY ? (
          <NewConversationModal closeModal={closeModal} />
        ) : (
          <NewContactModal closeModal={closeModal} />
        )}
      </Modal>
    </>
  );
}
