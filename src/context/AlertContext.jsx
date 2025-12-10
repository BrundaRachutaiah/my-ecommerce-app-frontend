// src/context/AlertContext.js
import React, { createContext, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (variant, message, id = Date.now()) => {
    setAlerts(prevAlerts => [...prevAlerts, { id, variant, message }]);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert, removeAlert }}>
      {children}
      <div className="alert-container">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert alert-${alert.variant} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button type="button" className="btn-close" onClick={() => removeAlert(alert.id)}></button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};