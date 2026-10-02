"use client";
import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLoginSuccess = () => {
    // This function can be expanded later
    console.log("Login successful!");
  };

  return (
    <div>
      {isLogin ? (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          toggleAuthMode={toggleAuthMode}
        />
      ) : (
        <SignupPage toggleAuthMode={toggleAuthMode} />
      )}
    </div>
  );
};

export default AuthPage;
