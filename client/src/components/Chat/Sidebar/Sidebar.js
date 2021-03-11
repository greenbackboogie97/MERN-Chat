import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./sidebar.css";
import ConversationsTab from "./ConversationsTab/ConversationsTab";
import NewConversationModal from "./ConversationsTab/NewConversationModal/NewConversationModal";
import NewContactModal from "./ContactsTab/NewContactModal/NewContactModal";
import ContactsTab from "./ContactsTab/ContactsTab";

export default function Sidebar() {
  const [tabOpen, setTabOpen] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleTab = (index) => {
    setTabOpen(index);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <div id="sidebar-container">
        <div className="tabs-container">
          <button
            className={
              tabOpen === 1
                ? "conversations-tab active-tab"
                : "conversations-tab"
            }
            onClick={() => toggleTab(1)}
          >
            Conversations
          </button>
          <button
            className={
              tabOpen === 2 ? "contacts-tab active-tab" : "contacts-tab"
            }
            onClick={() => toggleTab(2)}
          >
            Contacts
          </button>
        </div>

        <div className="tabs-content">
          <div className={tabOpen === 1 ? "content active-content" : "content"}>
            <ConversationsTab />
          </div>
          <div className={tabOpen === 2 ? "content active-content" : "content"}>
            <ContactsTab />
          </div>
        </div>
        <div className="btn-div">
          <button onClick={() => setModalOpen(true)} className="submit-btn">
            New {tabOpen === 1 ? "Conversation" : "Contact"}
          </button>
        </div>
      </div>

      <Modal show={modalOpen} onHide={closeModal} centered animation={false}>
        {tabOpen === 1 ? (
          <NewConversationModal closeModal={closeModal} />
        ) : (
          <NewContactModal closeModal={closeModal} />
        )}
      </Modal>
    </>
  );
}
