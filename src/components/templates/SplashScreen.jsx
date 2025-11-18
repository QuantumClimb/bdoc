/**
 * SplashScreen Component
 * Animated loading screen shown once on app startup
 * Matches 1-SplashScreen.html pixel-perfect with brand colors
 */

import { useState, useEffect } from "react";

export function SplashScreen({ onComplete }) {
  const [messageIndex, setMessageIndex] = useState(0);
  
  const messages = [
    "Loading workspace...",
    "Initializing modules...",
    "Connecting to services...",
    "Preparing interface...",
    "Almost ready..."
  ];

  useEffect(() => {
    // Start cycling messages after 2 seconds
    const messageTimer = setTimeout(() => {
      const interval = setInterval(() => {
        setMessageIndex((prev) => {
          if (prev < messages.length - 1) {
            return prev + 1;
          }
          clearInterval(interval);
          return prev;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }, 2000);

    // Complete splash screen after 5.5 seconds
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 5500);

    return () => {
      clearTimeout(messageTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden splash-container">
      {/* Background with animated radial gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-darker via-dark to-gray-700" />
      <div className="absolute inset-0 animate-backgroundPulse opacity-50">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(252, 211, 77, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(252, 211, 77, 0.05) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(252, 211, 77, 0.03) 0%, transparent 70%)
          `
        }} />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        {/* Logo container */}
        <div className="logo-container flex items-center justify-center mb-16">
          <img src="/logo_dark.png" alt="BDoc" className="h-20" />
        </div>
        
        {/* Loading section */}
        <div className="loading-container space-y-6">
          <div className="text-center">
            <h2 className="text-xl text-gray-300 font-medium mb-2">Document Management System</h2>
            <p className="text-gray-500 text-sm">{messages[messageIndex]}</p>
          </div>
          
          {/* Progress bar */}
          <div className="w-80 mx-auto">
            <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
              <div className="progress-bar h-full rounded-full relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          {/* Loading dots */}
          <div className="loading-dots flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          
          {/* Version text */}
          <div className="version-text text-center">
            <p className="text-gray-600 text-xs">Version 2.1.0 | Enterprise Edition</p>
          </div>
        </div>
      </div>

      <style>{`
        .splash-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        }
        
        .logo-container {
          animation: logoEntry 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
          opacity: 0;
          transform: scale(0.3) rotate(-180deg);
        }
        
        @keyframes logoEntry {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-180deg);
          }
          70% {
            opacity: 1;
            transform: scale(1.1) rotate(10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        
        .logo-icon {
          background: linear-gradient(135deg, #FBCC5F 0%, #F59E0B 100%);
          box-shadow: 0 0 30px rgba(252, 211, 77, 0.6);
          animation: iconGlow 2s ease-in-out infinite;
        }
        
        @keyframes iconGlow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(252, 211, 77, 0.6);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 50px rgba(252, 211, 77, 0.8);
            transform: scale(1.05);
          }
        }
        
        .logo-text {
          animation: textSlide 1.5s ease-out 0.5s forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        
        @keyframes textSlide {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .company-text {
          animation: companyFade 1s ease-out 1.2s forwards;
          opacity: 0;
        }
        
        @keyframes companyFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .loading-container {
          animation: loadingFade 1s ease-out 1.8s forwards;
          opacity: 0;
        }
        
        @keyframes loadingFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        .progress-bar {
          background: linear-gradient(to right, #FBCC5F, #F59E0B);
          width: 0%;
          animation: progressFill 3s ease-in-out 2s forwards;
        }
        
        @keyframes progressFill {
          0% { width: 0%; }
          25% { width: 30%; }
          50% { width: 60%; }
          75% { width: 85%; }
          100% { width: 100%; }
        }
        
        @keyframes backgroundPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

export default SplashScreen;
