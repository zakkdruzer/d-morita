import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { Layers, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isLoading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <Layers className="h-12 w-12 text-teal-600" />
          </div>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            El Diván de Morita
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Inicia sesión para gestionar el registro de mascotas
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
              {error === 'Invalid username or password' ? 'Usuario o contraseña inválidos' : 'Ocurrió un error durante el inicio de sesión'}
            </div>
          )}
          
          <Input
            label="Usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          
          <Input
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading || !username || !password}
              className="group relative"
            >
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LogIn className="h-5 w-5 text-teal-50 group-hover:text-white" aria-hidden="true" />
              </span>
              <span className="ml-4">Iniciar Sesión</span>
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            <p>
              <span className="font-medium text-teal-700">Credenciales de prueba:</span> 
              <br />
              Usuario: <span className="font-mono">admin</span> | Contraseña: <span className="font-mono">password</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;