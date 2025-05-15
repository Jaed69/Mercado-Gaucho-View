import React from 'react';
import SearchIcon from './SearchIcon';
import ShoppingCartIcon from './ShoppingCartIcon';

/**
 * Componente Header: Muestra el logo, la navegación principal y el icono del carrito.
 * @param {function} setCurrentView - Función para cambiar la vista actual.
 * @param {number} cartItemCount - Número total de artículos en el carrito.
 * @param {string} searchTerm - El término de búsqueda actual.
 * @param {function} setSearchTerm - Función para actualizar el término de búsqueda.
 */
const Header = ({ setCurrentView, cartItemCount, searchTerm, setSearchTerm }) => {
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Opcional: manejar el submit del formulario de búsqueda si es necesario
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Aquí podrías forzar una navegación o acción si la búsqueda no es en vivo
    console.log("Búsqueda enviada:", searchTerm);
    // Si ProductList ya filtra en vivo, esto podría no ser necesario,
    // o podría usarse para navegar a una vista de resultados de búsqueda dedicada.
    if (setCurrentView) setCurrentView('products'); // Asegura que estemos en la vista de productos
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo/Nombre de la tienda */}
          <div
            className="text-2xl sm:text-3xl font-bold text-red-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded-md px-1"
            onClick={() => setCurrentView('products')}
            aria-label="Ir a la página de inicio"
            tabIndex={0}
            onKeyPress={(e) => e.key === 'Enter' && setCurrentView('products')}
          >
            Mercado Gaucho
          </div>

          {/* Barra de búsqueda (funcionalidad pendiente) */}
          <div className="hidden md:flex flex-grow max-w-md lg:max-w-xl mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                aria-label="Buscar productos"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600" aria-label="Realizar búsqueda">
                <SearchIcon />
              </button>
            </form>
          </div>

          {/* Navegación e iconos */}
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <a
              href="#"
              className="text-gray-600 hover:text-red-600 transition-colors px-2 sm:px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              onClick={(e) => { e.preventDefault(); setCurrentView('products'); }}
            >
              Productos
            </a>
            <button
              onClick={() => setCurrentView('cart')}
              className="relative text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              aria-label={`Ver carrito de compras (${cartItemCount} artículos)`}
            >
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-5 w-5 transform rounded-full bg-red-600 text-white text-xs flex items-center justify-center pointer-events-none">
                  {cartItemCount}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 