/**
 * Example Login Page
 */

import LoginTemplate from "../components/templates/LoginTemplate";
import { useState } from "react";

export function LoginPageExample({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email && password) {
        const user = {
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
          avatar: email.substring(0, 2).toUpperCase(),
          email,
        };
        onLoginSuccess(user);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <LoginTemplate
      onSubmit={handleLogin}
      error={error}
      isLoading={isLoading}
    />
  );
}
