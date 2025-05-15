import React, { useState } from 'react';

/**
 * Componente RegisterView: Formulario para registrar nuevos usuarios.
 * @param {function} registerUser - Función para intentar registrar al usuario.
 * @param {function} setCurrentView - Función para navegar a otras vistas.
 */
const RegisterView = ({ registerUser, setCurrentView }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    if (!formData.email || !formData.password || !formData.nombre) {
      setError('Nombre, email y contraseña son requeridos.');
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setIsLoading(false);
      return;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      setIsLoading(false);
      return;
    }

    // Exclude confirmPassword from data sent to API
    const { confirmPassword, ...userData } = formData;
    
    const result = await registerUser(userData); // registerUser will be in App.jsx
    setIsLoading(false);

    if (!result.success) {
      setError(result.message || 'Error al registrar. Intenta de nuevo.');
    } else {
      setSuccessMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
      // Optionally clear form or navigate to login after a delay
      setTimeout(() => {
        setCurrentView('login');
      }, 2000); 
    }
  };

  return (
    <div className="container mx-auto max-w-lg px-4 py-12">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre-register" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre-register"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder="Tu nombre"
            />
          </div>
          <div>
            <label htmlFor="apellido-register" className="block text-sm font-medium text-gray-700 mb-1">
              Apellido
            </label>
            <input
              type="text"
              id="apellido-register"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder="Tu apellido (opcional)"
            />
          </div>
          <div>
            <label htmlFor="email-register" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email-register"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label htmlFor="telefono-register" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono-register"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder="Tu teléfono (opcional)"
            />
          </div>
          <div>
            <label htmlFor="password-register" className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password-register"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword-register" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword-register"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength="6"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm transition-colors"
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-4">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-300 transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                'Crear Cuenta'
              )}
            </button>
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          ¿Ya tienes cuenta? {' '}
          <button 
            onClick={() => setCurrentView('login')}
            className="font-medium text-red-600 hover:text-red-500 focus:outline-none focus:underline"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterView; 