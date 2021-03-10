import React, { useContext } from "react";
import { Navbar, NavLink } from "react-bootstrap";
import "./header.css";
import { LogoutIcon } from "../../icons";
import { useHistory } from "react-router-dom";
import UserContext from "../../context/UserContext";

export default function Header() {
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

  return (
    <Navbar fixed="top">
      <Navbar.Brand className="brand">PIXEL Chat</Navbar.Brand>
      {userData.user ? (
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text style={{ color: "white" }}>
            {userData.user.displayName}
          </Navbar.Text>
          <NavLink onClick={logout}>{LogoutIcon}</NavLink>
        </Navbar.Collapse>
      ) : null}
    </Navbar>
  );
}
