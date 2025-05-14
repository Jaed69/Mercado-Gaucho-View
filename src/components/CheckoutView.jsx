import React, { useState, useEffect } from 'react';

/**
 * Componente CheckoutView: Formulario para finalizar la compra.
 * Actualmente simula el envío de la orden y el proceso de pago.
 * @param {function} setCurrentView - Función para navegar a la confirmación o al carrito.
 * @param {array} cartItems - Artículos en el carrito para calcular el total y enviar a la API.
 */
const CheckoutView = ({ setCurrentView, cartItems }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', address: '', city: '', postalCode: '', country: 'Perú', paymentMethod: 'creditCard'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
        setError('Por favor, completa todos los campos de envío.');
        return;
    }
    setIsProcessing(true);

    const orderData = {
      total: calculateTotal(),
      estado: 'pendiente',
      detalles: cartItems.map(item => ({
        id_producto: item.id,
        cantidad: item.quantity,
        precio_unitario: item.price
      })),
    };

    console.log("Enviando orden al backend (simulado):", JSON.stringify(orderData, null, 2));

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const simulatedOrderId = `ORD-SIM-${Date.now().toString().slice(-5)}`;
      console.log("Simulación: Orden creada con ID", simulatedOrderId);
      setCurrentView('orderConfirmation', { orderId: simulatedOrderId });
    } catch (err) {
      console.error("Error en el proceso de checkout:", err);
      setError(`Error en el proceso de checkout: ${err.message}. Inténtalo de nuevo.`);
      setIsProcessing(false);
    }
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cartItems.length > 0 ? 5.00 : 0;
    return subtotal + shipping;
  };

   if (cartItems.length === 0 && !isProcessing) {
     useEffect(() => {
       setCurrentView('products');
     }, [setCurrentView]);
     return (
       <div className="container mx-auto px-4 py-12 text-center">
           <h2 className="text-2xl font-semibold text-gray-700 mb-4">Tu carrito está vacío.</h2>
           <p className="text-gray-600 mb-4">Redirigiendo a productos...</p>
           <button
               onClick={() => setCurrentView('products')}
               className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors" // Cambio de color
           >
               Ir a Productos
           </button>
       </div>
     );
   }


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Finalizar Compra</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl">
        {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md text-sm">{error}</div>}

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Información de Envío</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Nombre Completo</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm" /> {/* Cambio de color focus */}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Correo Electrónico</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm" /> {/* Cambio de color focus */}
            </div>
            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">Dirección</label>
              <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm" /> {/* Cambio de color focus */}
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-600 mb-1">Ciudad</label>
              <input type="text" name="city" id="city" value={formData.city} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm" /> {/* Cambio de color focus */}
            </div>
            <div>
              <label htmlFor="postalCode" className="block text-sm font-medium text-gray-600 mb-1">Código Postal</label>
              <input type="text" name="postalCode" id="postalCode" value={formData.postalCode} onChange={handleInputChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 text-sm" /> {/* Cambio de color focus */}
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-600 mb-1">País</label>
              <select name="country" id="country" value={formData.country} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500 bg-white text-sm"> {/* Cambio de color focus */}
                <option value="Perú">Perú</option>
                <option value="México">México</option>
                <option value="Colombia">Colombia</option>
              </select>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Método de Pago</h3>
          <div className="space-y-3">
            <div>
                <label className="flex items-center p-3 border border-gray-300 rounded-md hover:border-red-500 cursor-pointer has-[:checked]:bg-red-50 has-[:checked]:border-red-400 transition-colors"> {/* Cambio de color focus/checked */}
                    <input type="radio" name="paymentMethod" value="creditCard" checked={formData.paymentMethod === 'creditCard'} onChange={handleInputChange} className="form-radio text-red-600 mr-3 focus:ring-red-500"/> {/* Cambio de color */}
                    <span>Tarjeta de Crédito/Débito (Simulado)</span>
                </label>
            </div>
             <div>
                <label className="flex items-center p-3 border border-gray-300 rounded-md hover:border-red-500 cursor-pointer has-[:checked]:bg-red-50 has-[:checked]:border-red-400 transition-colors"> {/* Cambio de color focus/checked */}
                    <input type="radio" name="paymentMethod" value="paypal" checked={formData.paymentMethod === 'paypal'} onChange={handleInputChange} className="form-radio text-red-600 mr-3 focus:ring-red-500"/> {/* Cambio de color */}
                    <span>PayPal (Simulado)</span>
                </label>
            </div>
             <div>
                <label className="flex items-center p-3 border border-gray-300 rounded-md hover:border-red-500 cursor-pointer has-[:checked]:bg-red-50 has-[:checked]:border-red-400 transition-colors"> {/* Cambio de color focus/checked */}
                    <input type="radio" name="paymentMethod" value="cod" checked={formData.paymentMethod === 'cod'} onChange={handleInputChange} className="form-radio text-red-600 mr-3 focus:ring-red-500"/> {/* Cambio de color */}
                    <span>Pago Contra Entrega (Simulado)</span>
                </label>
            </div>
          </div>
            <p className="text-xs text-gray-500 mt-4 italic">Nota: La integración real con pasarelas de pago (Stripe, MercadoPago, PayPal SDK, etc.) requiere configuración adicional segura en frontend y backend.</p>
        </section>

        <section className="mb-8 p-4 bg-red-50 rounded-lg border border-red-100"> {/* Cambio de color */}
            <h3 className="text-lg font-semibold text-red-700 mb-3">Resumen de tu Compra</h3> {/* Cambio de color */}
            {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm text-gray-600 py-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            ))}
            <div className="flex justify-between items-center text-sm text-gray-600 py-1 border-t border-red-200 mt-2 pt-2"> {/* Cambio de color */}
                <span>Envío</span>
                <span>${(cartItems.length > 0 ? 5.00 : 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-red-800 mt-2 pt-2 border-t-2 border-red-300"> {/* Cambio de color */}
                <span>Total a Pagar</span>
                <span>${calculateTotal().toFixed(2)}</span>
            </div>
        </section>

        <div className="mt-8">
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed" // Mantenido verde para confirmación
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando Pedido...
              </>
            ) : `Realizar Pedido por $${calculateTotal().toFixed(2)}`}
          </button>
          <button
            type="button"
            onClick={() => setCurrentView('cart')}
            disabled={isProcessing}
            className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg text-lg transition-colors disabled:opacity-50"
          >
            Volver al Carrito
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutView; 