import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import AppRoutes from './routes'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <AppRoutes />
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
)

