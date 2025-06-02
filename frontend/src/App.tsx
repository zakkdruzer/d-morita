import React from 'react';
import { useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PetDetail from './pages/PetDetail';
import EditPetForm from './components/pet/EditPetForm';
import AddConsultationForm from './components/pet/AddConsultationForm';
import ConsultationHistory from './components/pet/ConsultationHistory';
import EditConsultationForm from './components/pet/EditConsultationForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return isAuthenticated ? (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/mascota/:id" element={<PetDetail />} />
      <Route path="/editar-mascota/:id" element={<EditPetForm />} />
      <Route path="/mascota/:id/consulta" element={<AddConsultationForm />} />
      <Route path="/mascota/:id/historial-consultas" element={<ConsultationHistory />} />
      <Route path="/mascota/:id/editar-consulta/:consultationId" element={<EditConsultationForm />} />
      {/* otras rutas */}
    </Routes>
  ) : (
    <LoginPage />
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;