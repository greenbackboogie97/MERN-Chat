import React, { useContext } from "react";
import "./chatHeader.css";
import { useHistory } from "react-router-dom";
import UserContext from "../../../context/UserContext";

export default function ChatHeader() {
  const history = useHistory();
  const { userData, setUserData } = useContext(UserContext);

  const logout = () => {
    setUserData({
      token: null,
      user: null,
    });
    localStorage.setItem("auth-token", "");
    history.push("/login");
  };

  return <div>header</div>;
}
