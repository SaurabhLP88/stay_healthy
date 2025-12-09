import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} StayHealthy — Built with ❤️ by &nbsp;
        <a
          href="https://github.com/SaurabhLP88"
          target="_blank"
          rel="noopener noreferrer"
        >Saurabh Lakhanpal</a>
      </p>
    </footer>
  );
};

export default Footer;
