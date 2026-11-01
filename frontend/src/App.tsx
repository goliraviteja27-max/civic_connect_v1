import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { HomePage } from './pages/HomePage';
import { CitizenLoginPage } from './pages/CitizenLoginPage';
import { CitizenRegisterPage } from './pages/CitizenRegisterPage';
import { CitizenDashboardPage } from './pages/CitizenDashboardPage';
import { SubmitComplaintPage } from './pages/SubmitComplaintPage';
import { ComplaintDetailsPage } from './pages/ComplaintDetailsPage';
import { DepartmentLoginPage } from './pages/DepartmentLoginPage';
import { DepartmentDashboardPage } from './pages/DepartmentDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

import './App.css';

export function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<CitizenLoginPage />} />
            <Route path="/register" element={<CitizenRegisterPage />} />
            
            {/* Citizen Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute portal="citizen">
                  <CitizenDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/submit"
              element={
                <ProtectedRoute portal="citizen">
                  <SubmitComplaintPage />
                </ProtectedRoute>
              }
            />

            {/* Complaint Details */}
            <Route path="/issues/:id" element={<ComplaintDetailsPage />} />

            {/* Department Officer Routes */}
            <Route path="/department/login" element={<DepartmentLoginPage />} />
            <Route
              path="/department/dashboard"
              element={
                <ProtectedRoute portal="department">
                  <DepartmentDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Catch-All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
