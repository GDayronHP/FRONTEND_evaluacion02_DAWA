import { createContext, useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthService from '../services/AuthService'; // Asegúrate de importar correctamente

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const authService = new AuthService();

  // Al montar el componente, carga el usuario decodificando el token
  useEffect(() => {
    const token = authService.getCurrentUser(); // token crudo desde localStorage
    if (token) {
      try {
        const decoded = authService.getDecodedToken(token);
        setCurrentUser(decoded); // decoded contiene `.role`, `.sub`, etc.
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setCurrentUser(null);
      }
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const token = await authService.signin(username, password);
      const decoded = authService.getDecodedToken(token);
      setCurrentUser(decoded);
      return decoded;
    } catch (error) {
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await authService.signup(username, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const hasRole = (roleName) => {
    if (!currentUser || !currentUser.role) return false;
    return currentUser.role.toLowerCase() === roleName.toLowerCase();
  };

  const hasMinimumRole = (roleName) => {
    if (!currentUser || !currentUser.role) return false;

    const roleHierarchy = {
      admin: 3,
      moderador: 2,
      usuario: 1
    };

    const userRoleLevel = roleHierarchy[currentUser.role.toLowerCase()] || 0;
    const requiredRoleLevel = roleHierarchy[roleName.toLowerCase()] || 0;

    return userRoleLevel >= requiredRoleLevel;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    loading,
    login,
    register,
    logout,
    hasRole,
    hasMinimumRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;

  return children;
};

export const RoleBasedRoute = ({ role, checkMinimumRole = false, children }) => {
  const { isAuthenticated, loading, hasRole, hasMinimumRole } = useAuth();
  const location = useLocation();
  const normalizedRole = role.toLowerCase();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/" state={{ from: location }} replace />;

  const hasRequiredRole = checkMinimumRole
    ? hasMinimumRole(normalizedRole)
    : hasRole(normalizedRole);

  if (!hasRequiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default AuthContext;
