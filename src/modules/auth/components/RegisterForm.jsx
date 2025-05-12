import React, { useState } from "react";
import AuthService from '../services/AuthService';

function RegisterForm() {
  // Estado para los campos del formulario
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Estados para manejo de errores y carga
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  // Instancia del servicio de autenticación
  const authService = new AuthService();
  
  // Maneja los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar mensajes cuando el usuario empieza a escribir
    if (error) setError('');
    if (message) setMessage('');
  };
  
  // Maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }
    
    // Validación simple de email con regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }
    
    // Validación de contraseña (min 6 caracteres)
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      // Intenta registrar al usuario usando el servicio
      await authService.signup(
        formData.username,
        formData.email,
        formData.password
      );
      
      setMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      
    } catch (err) {
      setError(err.message || 'Error al registrar usuario. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <fieldset className="flex flex-col space-y-2 my-8 font-light" disabled={loading}>
        <label htmlFor="username">Nombre de usuario</label>
        <input
          className="form__input"
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Correo electrónico</label>
        <input
          className="form__input"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Contraseña</label>
        <input
          className="form__input"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </fieldset>

      {error && (
        <div className="text-red-500 text-sm mb-4">{error}</div>
      )}
      
      {message && (
        <div className="text-green-500 text-sm mb-4">{message}</div>
      )}

      <button 
        type="submit" 
        className="btn__submit"
        disabled={loading}
      >
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
}

export default RegisterForm;