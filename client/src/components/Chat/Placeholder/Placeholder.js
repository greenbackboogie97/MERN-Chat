import React, { useContext, useState } from "react";
import "./placeholder.css";
import { AiOutlineGithub } from "react-icons/ai";
import UserContext from "../../../context/UserContext";
import { useEffect } from "react";

export default function Placeholder() {
  const { userData } = useContext(UserContext);
  const [name, setName] = useState();

  useEffect(() => {
    if (!userData.user) return;
    setName(userData.user.displayName);
  }, [userData]);

  return (
    <div className="placeholder">
      <div className="div-top">
        <h1 className="welcome">Welcome {name} !</h1>
      </div>
      <div className="dependencies-container">
        <div className="para-div">
          <p className="para">
            This real-time chat app was built using React.
            <br /> Server is based on NodeJS & Express.
            <br /> User authentication is based on JWT & Bcrypt.
            <br /> Database in use is MongoDB.
            <br /> Websocket implemented with Socket.io .
          </p>
        </div>

        <div className="para-div">
          <p className="para">Full dependency list and project code on</p>
          <a
            rel="noreferrer"
            target="_blank"
            href="https://github.com/greenbackboogie97/MERN-Chat"
          >
            <AiOutlineGithub className="git" />
          </a>
        </div>
      </div>
      <div className="div-bottom"></div>
    </div>
  );
}
