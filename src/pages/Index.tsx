import { useState } from "react";
import { AuthForm } from "@/components/AuthForm";
import { ChatInterface } from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <ChatInterface onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
      <Toaster />
    </div>
  );
};

export default Index;
