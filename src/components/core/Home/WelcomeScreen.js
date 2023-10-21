import React from "react";

const WelcomeScreen = ({ disableWelcomeScreen }) => {
  return (
    <div
      className={`welcome-screen fixed w-screen h-screen top-0 bottom-0 
      right-0 left-0 duration-1000 ${
        disableWelcomeScreen ? "opacity-0" : "opacity-100"
      }`}
    ></div>
  );
};

export default WelcomeScreen;
