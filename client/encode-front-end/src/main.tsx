// File: client/encode-front-end/src/main.tsx
// This file contains main component

import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import Payments from './views/Payments';
import Dashboard from './views/dashboard.tsx'
import HomePage from './views/home.tsx'
import { AuthProvider } from './context/AuthContext'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
     <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/dashboard" element={
            <Dashboard />
        } />
        {/* Define other routes */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,

);

