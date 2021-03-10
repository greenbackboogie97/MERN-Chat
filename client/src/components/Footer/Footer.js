import React from "react";
import { Navbar } from "react-bootstrap";
import NavbarCollapse from "react-bootstrap/esm/NavbarCollapse";

export default function Footer() {
  const curDate = new Date();
  const year = curDate.getFullYear();
  return (
    <Navbar fixed="bottom" className="p-1 m-0">
      <NavbarCollapse className="justify-content-center">
        <Navbar.Text>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://creativecommons.org/licenses/by/4.0/"
            style={{ color: "blueviolet", fontSize: "85%" }}
          >
            Copyright © {year}
          </a>
        </Navbar.Text>
      </NavbarCollapse>
    </Navbar>
  );
}
