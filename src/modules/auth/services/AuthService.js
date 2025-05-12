import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

class AuthService {
  constructor(baseURL = import.meta.env.VITE_API_URL) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async signup(username, email, password) {
    try {
      const response = await this.api.post('/auth/register', {
        username,
        email,
        password
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error en el registro: ' + error.message);
    }
  }

  async signin(email, password) {
    try {
      // Primero limpiamos cualquier sesión anterior para evitar conflictos
      this.logout();
      
      const response = await this.api.post('/auth/login', {
        email,
        password
      });
      
      // Si la autenticación es exitosa, guardamos el token en localStorage
      if (response.data.token) {
        // Asegurarse de que estamos guardando un objeto usuario completo
        localStorage.setItem('user', JSON.stringify(response.data));
        
        // Verificar que se haya guardado correctamente
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          console.error('Error: No se pudo guardar el usuario en localStorage');
        } else {
          console.log('Usuario guardado correctamente en localStorage');
          
          // Verificar el token decodificado
          try {
            const decoded = this.getDecodedToken();
            console.log('Token decodificado después de login:', decoded);
            if (decoded && decoded.role) {
              console.log('Rol detectado:', decoded.role);
            }
          } catch (e) {
            console.error('Error verificando token después de login:', e);
          }
        }
      } else {
        console.error('Error: No se recibió token del servidor');
      }
      
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Error en el inicio de sesión: ' + error.message);
    }
  }

  /**
   * Cierra la sesión del usuario actual
   */
  logout() {
    console.log('Cerrando sesión... eliminando datos de usuario');
    localStorage.removeItem('user');
    // Verificar que se haya eliminado correctamente
    if (localStorage.getItem('user')) {
      console.error('Error: No se pudo eliminar el usuario de localStorage');
    } else {
      console.log('Usuario eliminado correctamente de localStorage');
    }
    
    // Forzar recarga de la página para limpiar cualquier estado residual
    // window.location.href = '/'; // Descomenta esta línea si necesitas forzar recarga
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      console.log('No hay usuario en localStorage');
      return null;
    }
    
    try {
      const user = JSON.parse(userStr);
      return user;
    } catch (e) {
      console.error('Error al parsear datos de usuario:', e);
      localStorage.removeItem('user'); // Eliminamos los datos corruptos
      return null;
    }
  }

  getToken() {
    const user = this.getCurrentUser();
    if (!user) {
      console.log('No hay usuario para obtener token');
      return null;
    }
    return user.token;
  }

  getDecodedToken() {
    const token = this.getToken();
    if (!token) {
      console.log('No hay token para decodificar');
      return null;
    }
    
    try {
      const decoded = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  }

  isAuthenticated() {
    const token = this.getToken();
    if (!token) {
      console.log('No hay token, usuario no autenticado');
      return false;
    }
    
    try {
      const decoded = jwtDecode(token);
      // Verificamos si el token ha expirado
      const currentTime = Date.now() / 1000;
      const isValid = decoded.exp > currentTime;
      
      if (!isValid) {
        console.log('Token expirado');
        // Limpiar token expirado
        this.logout();
      }
      
      return isValid;
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      return false;
    }
  }

  hasRole(roleName) {
    if (!roleName) {
      console.error('No se proporcionó un nombre de rol para verificar');
      return false;
    }
    
    const decoded = this.getDecodedToken();
    if (!decoded) {
      console.log('No se pudo obtener token decodificado para verificar rol');
      return false;
    }

    // Normalizar el nombre del rol para comparación
    const normalizedRoleName = roleName.toLowerCase();
    
    // Normalizar el rol del usuario (podría estar en diferentes formatos)
    let userRole = null;
    
    if (decoded.role) {
      userRole = decoded.role.toLowerCase();
    } else if (decoded.roles) {
      if (Array.isArray(decoded.roles)) {
        userRole = decoded.roles[0].toLowerCase();
      } else {
        userRole = decoded.roles.toLowerCase();
      }
    }
    
    console.log(`Verificando rol: ${normalizedRoleName} contra rol de usuario: ${userRole}`);
    
    return userRole === normalizedRoleName;
  }
}

export default AuthService;