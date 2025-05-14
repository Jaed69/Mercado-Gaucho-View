import React, { useEffect } from 'react';

/**
 * Componente OrderConfirmation: Muestra la página de agradecimiento después de una compra.
 * @param {function} setCurrentView - Función para navegar a otras vistas.
 * @param {object} orderDetails - Objeto con detalles de la orden (ej. { orderId: '...' }).
 * @param {function} clearCart - Función para vaciar el carrito de compras.
 */
const OrderConfirmation = ({ setCurrentView, orderDetails, clearCart }) => {
  const orderId = orderDetails?.orderId || `ORD-???`;

  useEffect(() => {
    if (clearCart) {
        console.log("Limpiando carrito desde OrderConfirmation...");
        clearCart();
    }
  }, [clearCart]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 md:h-24 md:w-24 text-green-500 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"> {/* Mantenido verde para éxito */}
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">¡Gracias por tu compra!</h2>
      <p className="text-gray-600 text-lg mb-8">Tu pedido ha sido recibido exitosamente.</p>
      <p className="text-gray-600 mb-2">Número de pedido: <span className="font-semibold text-gray-700">{orderId}</span></p>
      <p className="text-gray-600 mb-8 text-sm">(Recibirás un correo electrónico de confirmación con los detalles - simulación).</p>
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        <button
          onClick={() => setCurrentView('products')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors shadow-md hover:shadow-lg w-full sm:w-auto" // Cambio de color
        >
          Seguir Comprando
        </button>
        <button
          onClick={() => setCurrentView('profile')}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-8 rounded-lg text-lg transition-colors w-full sm:w-auto"
        >
          Ver Mis Pedidos (Próximamente)
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation; 