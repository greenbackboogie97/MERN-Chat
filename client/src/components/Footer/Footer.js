import React from "react";
import "./footer.css";

export default function Footer() {
  const curDate = new Date();
  const year = curDate.getFullYear();
  return (
    <footer className="footer">
      <a
        className="copyright"
        target="_blank"
        rel="noreferrer"
        href="https://creativecommons.org/licenses/by/4.0/"
      >
        Copyright © {year}
      </a>
    </footer>
  );
}
