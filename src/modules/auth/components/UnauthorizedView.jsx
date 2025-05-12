import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function UnauthorizedView() {

    const navigate = useNavigate();
    const { currentUser } = useAuth();
  
    const goBack = () => {
      navigate(-1);
    };
  
    const goHome = () => {
      navigate('/');
    };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 py-4">
          <div className="flex justify-center">
            <svg className="h-16 w-16 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Acceso Denegado</h2>
          <div className="h-1 w-16 bg-red-500 mx-auto mb-4"></div>
          
          <p className="text-center text-gray-600 mb-6">
            No tienes los permisos necesarios para acceder a esta página.
            Por favor, contacta con un administrador si crees que deberías tener acceso.
          </p>
          
          {currentUser && (
            <div className="bg-gray-50 p-4 rounded-md mb-6">
              <p className="text-sm text-gray-600">
                Has iniciado sesión como: <span className="font-medium">{currentUser.username}</span>
              </p>
              {currentUser.roles && (
                <p className="text-sm text-gray-600 mt-1">
                  Roles actuales: {currentUser.roles.map(role => role.replace('ROLE_', '')).join(', ')}
                </p>
              )}
            </div>
          )}
          
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <button
              onClick={goBack}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors w-full sm:w-auto"
            >
              Volver Atrás
            </button>
            
            <button
              onClick={goHome}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors w-full sm:w-auto"
            >
              Ir al Inicio
            </button>
        
          </div>
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedView
