// import from packages
import React from "react";

// import components
import Template from "../components/core/Auth/Template";

// import assets
import loginImg from "../assets/Images/login.webp";

const Login = () => {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond"
      description2="Education to Future-Proof your career"
      image={loginImg}
      formType="login"
    />
  );
};

export default Login;
