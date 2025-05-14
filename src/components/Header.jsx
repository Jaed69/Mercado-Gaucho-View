import React from 'react';
import SearchIcon from './SearchIcon';
import ShoppingCartIcon from './ShoppingCartIcon';

/**
 * Componente Header: Muestra el logo, la navegación principal y el icono del carrito.
 * @param {function} setCurrentView - Función para cambiar la vista actual.
 * @param {number} cartItemCount - Número total de artículos en el carrito.
 */
const Header = ({ setCurrentView, cartItemCount }) => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo/Nombre de la tienda */}
          <div
            className="text-3xl font-bold text-red-700 cursor-pointer" // Cambio de color
            onClick={() => setCurrentView('products')}
            aria-label="Ir a la página de inicio"
          >
            Mercado Gaucho {/* Cambio de nombre */}
          </div>

          {/* Barra de búsqueda (funcionalidad pendiente) */}
          <div className="hidden md:flex flex-grow max-w-xl mx-4">
            <div className="relative w-full">
              <input
                type="search"
                placeholder="Buscar productos..."
                className="w-full py-2 px-4 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors" // Cambio de color focus
                aria-label="Buscar productos"
              />
              <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-red-600" aria-label="Realizar búsqueda"> {/* Cambio de color hover */}
                <SearchIcon />
              </button>
            </div>
          </div>

          {/* Navegación e iconos */}
          <nav className="flex items-center space-x-4 sm:space-x-6">
            <a
              href="#"
              className="text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium" // Cambio de color hover
              onClick={(e) => { e.preventDefault(); setCurrentView('products'); }}
            >
              Productos
            </a>
            <button
              onClick={() => setCurrentView('cart')}
              className="relative text-gray-600 hover:text-red-600 transition-colors p-2 rounded-full hover:bg-gray-100" // Cambio de color hover
              aria-label={`Ver carrito de compras (${cartItemCount} artículos)`}
            >
              <ShoppingCartIcon />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 block h-5 w-5 transform rounded-full bg-red-500 text-white text-xs flex items-center justify-center pointer-events-none"> {/* Mantenido rojo para alerta */}
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