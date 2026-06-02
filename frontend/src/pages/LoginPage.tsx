import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Layers, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  // Tomamos desde el contexto la función login y el estado actual.
  const { login, isLoading, error } = useAuth();

  // Estados locales del formulario.
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Cuando se envía el formulario, llamamos al login real.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-teal-600 p-3 rounded-full">
            <Layers className="text-white" size={28} />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Iniciar Sesión
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Inicia sesión para gestionar el registro de mascotas
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Usuario"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Si el backend responde error, lo mostramos aquí */}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={isLoading}
          >
            <LogIn size={18} className="mr-2" />
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;