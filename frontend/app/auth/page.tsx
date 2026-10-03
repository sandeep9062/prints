"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginPage from "@/components/LoginPage";
import SignupPage from "@/components/SignupPage";
import { SEOHelper } from "@/components/SEOHelper";
import { getBreadcrumbSchema } from "@/lib/seo";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleAuthMode = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLoginSuccess = () => {
    // This function can be expanded later
    console.log("Login successful!");
  };

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Auth", url: "/auth" },
  ]);

  return (
    <>
      <SEOHelper
        title={isLogin ? "Sign In to Your Account" : "Create an Account"}
        description={
          isLogin
            ? "Sign in to Ink of Memories to review digital proofs, re-order your bespoke stationery and manage printing projects with Ink of Memories."
            : "Create your Ink of Memories account to save bespoke designs, approve 3D proofs and unlock member pricing on premium printing in Panchkula."
        }
        path="/auth"
        image="https://inkofmemories.com/inkofmemories.png"
        keywords="login ink of memories, sign up printing account, Ink of Memories client account"
        jsonLd={breadcrumbSchema}
      />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isLogin ? "login" : "signup"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {isLogin ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              toggleAuthMode={toggleAuthMode}
            />
          ) : (
            <SignupPage toggleAuthMode={toggleAuthMode} />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default AuthPage;
