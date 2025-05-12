import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/auth/context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  if (!currentUser) return null;

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="font-bold text-xl">Sistema de Roles</span>
            </div>
            
            {/* Navegación de escritorio */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {/* Menús específicos por rol */}
                {hasRole('usuario') && (
                  <Link to="/user" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Área Usuario
                  </Link>
                )}
                
                {hasRole('moderador') && (
                  <Link to="/moderator" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Panel Moderador
                  </Link>
                )}
                
                {hasRole('admin') && (
                  <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                    Administración
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Información del usuario y botón de logout */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={handleLogout}
                className="px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>

          {/* Botón de menú móvil */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <span className="sr-only">Abrir menú</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Dashboard
            </Link>
            <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
              Mi Perfil
            </Link>
            
            {hasRole('USER') && (
              <Link to="/user" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                Área Usuario
              </Link>
            )}
            
            {hasRole('MODERATOR') && (
              <Link to="/moderator" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                Panel Moderador
              </Link>
            )}
            
            {hasRole('ADMIN') && (
              <Link to="/admin" className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700">
                Administración
              </Link>
            )}
          </div>
          
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <div className="ml-3">
                <div className="text-base font-medium leading-none">{currentUser.username}</div>
                <div className="text-sm font-medium leading-none text-gray-400 mt-1">
                  {currentUser.roles && currentUser.roles.map(role => role.replace('ROLE_', '')).join(', ')}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-600 hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;