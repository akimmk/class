import React, { createContext, useContext } from 'react';
import { useToast } from '../hooks/useToast.js';
import Toast from '../components/Toast.jsx';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toastMethods = useToast();

  return (
    <ToastContext.Provider value={toastMethods}>
      {children}
      {/* Render toasts */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toastMethods.toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => toastMethods.removeToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};