import React, { useState, useContext } from "react";
import "./nav.css";
import { Modal } from "react-bootstrap";
import { BiConversation, BiPlus } from "react-icons/bi";
import { GoPrimitiveDot } from "react-icons/go";
import { IoMdContacts } from "react-icons/io";

import NewConversationModal from "./NewConversationModal/NewConversationModal";
import NewContactModal from "./NewContactModal/NewContactModal";

import { useHistory } from "react-router-dom";
import UserContext from "../../../../context/UserContext";

export default function Nav(props) {
  const history = useHistory();
  // eslint-disable-next-line no-unused-vars
  const { userData, setUserData } = useContext(UserContext);

  const [tabOpen, setTabOpen] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const toggleTab = (index) => {
    setTabOpen(index);
    props.onTabOpen(index);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const logout = () => {
    setUserData({
      token: null,
      user: null,
    });
    localStorage.setItem("auth-token", "");
    localStorage.setItem("username", "");
    history.push("/login");
  };

  const handleAddClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <nav className="nav">
        <div className="nav-left">
          <GoPrimitiveDot className="logout" onClick={logout} />
        </div>
        <div className="nav-right">
          <IoMdContacts
            className={tabOpen !== 2 ? "tab" : "tabActive"}
            onClick={() => toggleTab(2)}
          />
          <BiConversation
            className={tabOpen !== 1 ? "tab" : "tabActive"}
            onClick={() => toggleTab(1)}
          />
          <BiPlus className="tabAdd" onClick={handleAddClick} />
        </div>
      </nav>

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
