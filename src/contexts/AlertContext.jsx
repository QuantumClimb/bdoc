/**
 * Alert Context
 * Global alert/confirmation dialog system
 */

import { createContext, useContext, useState, useCallback } from 'react';

const AlertContext = createContext();

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within AlertProvider');
  }
  return context;
};

export function AlertProvider({ children }) {
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback((config) => {
    return new Promise((resolve) => {
      setAlert({
        ...config,
        onConfirm: () => {
          setAlert(null);
          resolve(true);
        },
        onCancel: () => {
          setAlert(null);
          resolve(false);
        }
      });
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && <AlertDialog {...alert} />}
    </AlertContext.Provider>
  );
}

function AlertDialog({ 
  title = 'Alert', 
  message, 
  type = 'info',
  confirmText = 'OK',
  cancelText = 'Cancel',
  showCancel = false,
  onConfirm,
  onCancel 
}) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return { icon: 'bi-check-circle', color: 'text-green-400', bg: 'bg-green-500/20' };
      case 'error':
        return { icon: 'bi-x-circle', color: 'text-red-400', bg: 'bg-red-500/20' };
      case 'warning':
        return { icon: 'bi-exclamation-triangle', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
      default:
        return { icon: 'bi-info-circle', color: 'text-primary', bg: 'bg-primary/20' };
    }
  };

  const iconStyles = getIcon();

  return (
    <div className="fixed inset-0 bg-darker/80 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <div className="bg-dark border border-gray-700 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${iconStyles.bg} rounded-full flex items-center justify-center flex-shrink-0`}>
              <i className={`${iconStyles.icon} ${iconStyles.color} text-2xl`}></i>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{message}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 flex items-center justify-end space-x-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-darker border border-gray-700 text-gray-300 rounded-lg hover:border-primary hover:text-primary transition-all font-medium"
            >
              {cancelText}
            </button>
          )}
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 bg-primary text-darker rounded-lg hover:bg-primary-600 transition-all font-semibold"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertProvider;
