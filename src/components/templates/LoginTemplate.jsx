/**
 * LoginTemplate Component
 * 2-step authentication flow: Username → Password
 * Pixel-perfect match to 5-Login Page.html
 */

import { useState } from "react";

export function LoginTemplate({ onLoginSuccess }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    if (username.trim()) {
      setStep(2);
      setTimeout(() => {
        document.getElementById('password-input')?.focus();
      }, 100);
    }
  };

  const handleBack = () => {
    setStep(1);
    setPassword("");
    setTimeout(() => {
      document.getElementById('username-input')?.focus();
    }, 100);
  };

  const handleLogin = () => {
    if (password.trim()) {
      setIsLoading(true);
      setTimeout(() => {
        const firstLetter = username.charAt(0).toUpperCase();
        onLoginSuccess({ 
          name: username, 
          email: `${username.toLowerCase()}@example.com`,
          firstLetter 
        });
      }, 2000);
    }
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="bg-darker min-h-screen flex items-center justify-center">
      <div className="w-full max-w-lg px-4">
        {/* Logo Section */}
        <div className="text-center mb-6">
          <img src="/logo_dark.png" alt="BDoc" className="w-64 mx-auto mb-3" />
        </div>

        {/* Form Container */}
        <div className="bg-dark rounded-2xl border border-gray-700 p-6 shadow-2xl">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              {/* Step 1 */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 1 
                    ? 'bg-primary text-darker' 
                    : step > 1 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  {step > 1 ? <i className="bi bi-check text-xs"></i> : '1'}
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === 1 ? 'text-white' : step > 1 ? 'text-green-400' : 'text-gray-400'
                }`}>
                  Username
                </span>
              </div>
              
              {/* Connector */}
              <div className="w-8 h-0.5 bg-gray-600"></div>
              
              {/* Step 2 */}
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step === 2 ? 'bg-primary text-darker' : 'bg-gray-600 text-gray-400'
                }`}>
                  2
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  step === 2 ? 'text-white' : 'text-gray-400'
                }`}>
                  Password
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Username */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Username</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="bi bi-person text-gray-400"></i>
                    </div>
                    <input
                      id="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleContinue)}
                      className="w-full pl-10 pr-4 py-2.5 bg-darker border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your username"
                      autoFocus
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleContinue}
                  disabled={!username.trim()}
                  className="w-full bg-primary text-darker font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Password */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-3">
                <button
                  onClick={handleBack}
                  className="text-gray-400 hover:text-primary transition-colors"
                >
                  <i className="bi bi-arrow-left"></i>
                </button>
                <div>
                  <h2 className="text-lg font-bold text-white">Enter Password</h2>
                  <p className="text-gray-400 text-xs">
                    Welcome back, <span className="text-primary font-medium">{username}</span>
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="bi bi-lock text-gray-400"></i>
                    </div>
                    <input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, handleLogin)}
                      className="w-full pl-10 pr-12 py-2.5 bg-darker border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 bg-darker border border-gray-600 rounded text-primary focus:ring-primary focus:ring-offset-dark"
                    />
                    <span className="ml-2 text-xs text-gray-300">Remember me</span>
                  </label>
                  <a href="#" className="text-xs text-primary hover:text-primary-600 transition-colors">
                    Forgot password?
                  </a>
                </div>
                
                <button
                  onClick={handleLogin}
                  disabled={!password.trim() || isLoading}
                  className="w-full bg-primary text-darker font-semibold py-2.5 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
                  {isLoading && (
                    <i className="bi bi-arrow-repeat animate-spin ml-2"></i>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-gray-400 text-xs">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:text-primary-600 transition-colors font-medium">
                Contact Administrator
              </a>
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-xs">© 2024 BDoc. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default LoginTemplate;
