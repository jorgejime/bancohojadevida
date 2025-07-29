import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProfessionalExperiencePage from './pages/ProfessionalExperience';
import Login from './pages/Login';
import Register from './pages/Register';
import MyProfile from './pages/MyProfile';
import PrivateRoute from './components/PrivateRoute';
import PersonalData from './pages/PersonalData';
import AcademicEducation from './pages/AcademicEducation';
import Languages from './pages/Languages';
import ToolManagement from './pages/ToolManagement';
import References from './pages/References';
import Settings from './pages/Settings';
import DocumentsPage from './pages/Documents';
import AdminDashboard from './pages/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ForgotPassword from './pages/ForgotPassword';

function App(): React.ReactNode {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute />}>
          <Route index element={<Navigate to="/my-profile" replace />} />
          <Route path="/dashboard" element={<Navigate to="/my-profile" replace />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/personal-data" element={<PersonalData />} />
          <Route path="/dashboard/professional-experience" element={<ProfessionalExperiencePage />} />
          <Route path="/academic-education" element={<AcademicEducation />} />
          <Route path="/languages" element={<Languages />} />
          <Route path="/tool-management" element={<ToolManagement />} />
          <Route path="/references" element={<References />} />
          <Route path="/documents" element={<DocumentsPage />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Admin Protected Routes */}
        <Route path="/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
