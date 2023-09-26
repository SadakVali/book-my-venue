// import from packages
import React from "react";

// import components
import Template from "../components/core/Auth/Template";

// import assets
import signupImg from "../assets/Images/signup.webp";

const Signup = () => {
  return (
    <Template
      title="Join the millions learning to code with StydyNotion for free"
      description1="Build skills for today, tomorrow, and beyond"
      description2="Education to Future-Proof your career"
      image={signupImg}
      formType="signup"
    />
  );
};

export default Signup;
