import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="w-full py-5 text-center bg-gray-100 border-t border-gray-300 text-gray-600 text-sm">
      <p>
        © {new Date().getFullYear()} StayHealthy — Built with ❤️ by&nbsp;
        <a
          href="https://github.com/SaurabhLP88"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-600 hover:underline"
        >
          Saurabh Lakhanpal
        </a>
      </p>
    </footer>

  );
};

export default Footer;
