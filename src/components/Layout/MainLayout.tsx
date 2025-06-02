import React, { useState, ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Layers, Search, PlusCircle, LogOut, Menu, X } from 'lucide-react';
import Button from '../ui/Button';

interface MainLayoutProps {
  children: ReactNode;
  activeTab: 'search' | 'add';
  onTabChange: (tab: 'search' | 'add') => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  activeTab,
  onTabChange
}) => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-teal-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Layers className="h-8 w-8" />
            <h1 className="text-xl font-bold">Sistema de Mascotas</h1>
          </div>
          
          <button 
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Alternar menú"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-sm">
              Bienvenido, <span className="font-semibold">{user?.username}</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-white border-white hover:bg-teal-700"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-1" /> Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-teal-700 text-white">
          <div className="container mx-auto px-4 py-2 flex flex-col">
            <div className="py-2 border-b border-teal-600">
              Bienvenido, <span className="font-semibold">{user?.username}</span>
            </div>
            <button 
              className="py-2 flex items-center text-left"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" /> Cerrar Sesión
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`py-3 px-4 flex items-center border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('search')}
          >
            <Search size={18} className="mr-2" />
            <span className="font-medium">Buscar Mascotas</span>
          </button>
          <button
            className={`py-3 px-4 flex items-center border-b-2 transition-colors ${
              activeTab === 'add'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onTabChange('add')}
          >
            <PlusCircle size={18} className="mr-2" />
            <span className="font-medium">Agregar Mascota</span>
          </button>
        </div>

        <main>{children}</main>
      </div>

      <footer className="bg-gray-800 text-gray-300 mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm">
          <p>&copy; 2025 Sistema de Mascotas. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;