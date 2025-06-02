import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { PetProvider } from './context/PetContext'; // <-- importa el provider
import { AuthProvider } from './context/AuthContext'; // <-- si usas AuthProvider
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PetProvider>
        <App />
      </PetProvider>
    </AuthProvider>
  </StrictMode>
);
