import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

// Page Imports
import LandingPage from '../pages/LandingPage';
import EmergencyReportPage from '../pages/EmergencyReportPage';
import ResponderLoginPage from '../pages/ResponderLoginPage';
import ResponderDashboardPage from '../pages/ResponderDashboardPage';
import IncidentDetailsPage from '../pages/IncidentDetailsPage';
import ResourceManagementPage from '../pages/ResourceManagementPage';
import EmergencyMapPage from '../pages/EmergencyMapPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes() {
  return (
    <AppLayout>
      <Routes>
        {/* 1. Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* 2. Emergency Reporting Page */}
        <Route path="/report" element={<EmergencyReportPage />} />

        {/* 3. Responder Login */}
        <Route path="/login" element={<ResponderLoginPage />} />

        {/* 4. Responder Dashboard */}
        <Route path="/dashboard" element={<ResponderDashboardPage />} />

        {/* 5. Incident Details Page */}
        <Route path="/incidents/:id" element={<IncidentDetailsPage />} />

        {/* 6. Resource Management Page */}
        <Route path="/resources" element={<ResourceManagementPage />} />

        {/* 7. Emergency Map Page */}
        <Route path="/map" element={<EmergencyMapPage />} />

        {/* Fallback 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}
