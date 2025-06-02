import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { PetProvider } from './context/PetContext.tsx'; // <-- importa el provider
import { AuthProvider } from './context/AuthContext.tsx'; // <-- si usas AuthProvider
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
