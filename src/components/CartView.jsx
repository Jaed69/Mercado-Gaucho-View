import React from 'react';
import ShoppingCartIcon from './ShoppingCartIcon';

/**
 * Componente CartView: Muestra los artículos en el carrito de compras.
 * @param {array} cartItems - Array de objetos de producto en el carrito.
 * @param {function} setCurrentView - Función para navegar a otras vistas (productos, checkout).
 * @param {function} updateCartItemQuantity - Función para cambiar la cantidad de un artículo.
 * @param {function} removeCartItem - Función para eliminar un artículo del carrito.
 */
const CartView = ({ cartItems, setCurrentView, updateCartItemQuantity, removeCartItem }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = cartItems.length > 0 ? 5.00 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <ShoppingCartIcon className="w-24 h-24 mx-auto text-gray-300 mb-6" />
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8">Añade algunos productos para verlos aquí.</p>
        <button
          onClick={() => setCurrentView('products')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg" // Cambio de color
        >
          Explorar Productos
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Tu Carrito de Compras</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center flex-shrink-0 w-full sm:w-auto">
                <img
                  src={item.imageUrl}
                  alt={`[Imagen de ${item.name}]`}
                  className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg mr-4"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/FFEBEB/B91C1C?text=Error'; }} // Cambio de color placeholder
                  loading="lazy"
                />
                <div className="flex-grow">
                  <h3 className="text-md md:text-lg font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-gray-500 text-sm">Precio: ${item.price.toFixed(2)}</p>
                   <button
                      onClick={() => removeCartItem(item.id)}
                      className="text-red-500 hover:text-red-700 transition-colors font-medium text-sm mt-2 sm:hidden"
                    >
                      Eliminar
                    </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end space-y-3 sm:space-y-0 sm:space-x-4 md:space-x-6 w-full sm:w-auto flex-shrink-0">
                <div className="flex items-center border border-gray-300 rounded-md self-start sm:self-center">
                  <button
                    onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-l-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity <= 1}
                    aria-label={`Reducir cantidad de ${item.name}`}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    readOnly
                    className="w-12 text-center border-l border-r border-gray-300 py-1 focus:outline-none"
                    aria-label={`Cantidad actual de ${item.name}`}
                  />
                  <button
                    onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={item.quantity >= item.stock}
                     aria-label={`Aumentar cantidad de ${item.name}`}
                   >
                    +
                  </button>
                </div>
                <p className="text-md md:text-lg font-semibold text-gray-700 w-24 text-left sm:text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeCartItem(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors font-medium text-sm hidden sm:block" // Mantenido rojo para eliminar
                   aria-label={`Eliminar ${item.name} del carrito`}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1 bg-gray-50 rounded-lg shadow-md p-6 h-fit sticky top-24">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">Resumen del Pedido</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Envío (Estimado):</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-3 border-t mt-3">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('checkout')}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg" // Cambio de color
          >
            Proceder al Pago
          </button>
          <button
            onClick={() => setCurrentView('products')}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg text-lg transition-colors"
          >
            Seguir Comprando
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartView; 