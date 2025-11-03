import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-300 text-gray-800 py-4 mt-10 shadow-inner fixed bottom-0 w-full">
      <div className="text-center font-medium">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-bold">SyncLy</span> — Made with{" "}
          <span className="text-red-500">❤️</span> by{" "}
          <span className="font-bold">Preyoshi</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
