import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Usa el contexto

function LoginForm() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    if (error) setError('');
    if (message) setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Todos los campos son obligatorios');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const user = await login(formData.username, formData.password); // <-- login desde el contexto

      setMessage('¡Inicio de sesión exitoso!');

      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'moderador') {
        navigate('/moderator');
      } else {
        navigate('/user');
      }

    } catch (err) {
      setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <fieldset className="flex flex-col space-y-2 my-8 font-light" disabled={loading}>
        <label htmlFor="username">Correo electrónico</label>
        <input
          className="form__input"
          type="email"
          id="username"
          name="username"
          value={formData.username}
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

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      {message && <div className="text-green-500 text-sm mb-4">{message}</div>}

      <button type="submit" className="btn__submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}

export default LoginForm;
