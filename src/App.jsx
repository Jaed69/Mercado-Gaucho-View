// src/App.js
// Componente principal de la aplicación de E-commerce en React.
// Se conecta a la API proporcionada para obtener datos de productos.
// Incluye funcionalidad de carrito de compras y estructura para checkout.

import React, { useState, useEffect } from 'react';
// import ShoppingCartIcon from './components/ShoppingCartIcon'; // No longer directly used in App.jsx
// import UserIcon from './components/UserIcon'; // No longer directly used in App.jsx
// import SearchIcon from './components/SearchIcon'; // No longer directly used in App.jsx
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import OrderConfirmation from './components/OrderConfirmation';
import Footer from './components/Footer'; // Added import

// --- URL Base de la API ---
// Asegúrate de que esta URL sea accesible desde donde ejecutes el frontend.
const API_BASE_URL = 'http://35.247.248.71:3001/api';

// --- Iconos SVG como componentes de React ---
// Se utilizan para elementos visuales como el carrito, usuario, etc.

// --- Componentes de la Aplicación ---

/**
 * Componente Header: Muestra el logo, la navegación principal y el icono del carrito.
 * @param {function} setCurrentView - Función para cambiar la vista actual.
 * @param {number} cartItemCount - Número total de artículos en el carrito.
 */

/**
 * Componente ProductList: Muestra una cuadrícula de productos obtenidos de la API.
 * @param {function} setCurrentView - Función para navegar a la vista de detalle del producto.
 * @param {function} addToCart - Función para añadir un producto al carrito.
 */

/**
 * Componente ProductDetail: Muestra la información detallada de un producto específico.
 * @param {number} productId - ID del producto a mostrar.
 * @param {function} setCurrentView - Función para volver a la lista de productos.
 * @param {function} addToCart - Función para añadir el producto al carrito.
 */

/**
 * Componente CartView: Muestra los artículos en el carrito de compras.
 * @param {array} cartItems - Array de objetos de producto en el carrito.
 * @param {function} setCurrentView - Función para navegar a otras vistas (productos, checkout).
 * @param {function} updateCartItemQuantity - Función para cambiar la cantidad de un artículo.
 * @param {function} removeCartItem - Función para eliminar un artículo del carrito.
 */

/**
 * Componente CheckoutView: Formulario para finalizar la compra.
 * Actualmente simula el envío de la orden y el proceso de pago.
 * @param {function} setCurrentView - Función para navegar a la confirmación o al carrito.
 * @param {array} cartItems - Artículos en el carrito para calcular el total y enviar a la API.
 */

/**
 * Componente OrderConfirmation: Muestra la página de agradecimiento después de una compra.
 * @param {function} setCurrentView - Función para navegar a otras vistas.
 * @param {object} orderDetails - Objeto con detalles de la orden (ej. { orderId: '...' }).
 * @param {function} clearCart - Función para vaciar el carrito de compras.
 */

/**
 * Componente Footer: Pie de página de la aplicación.
 */

/**
 * Componente Principal App: Orquesta la aplicación, maneja el estado global
 * (vista actual, carrito) y la navegación entre vistas.
 */
function App() {
  const [currentView, setCurrentView] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderDetailsForConfirmation, setOrderDetailsForConfirmation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const navigateTo = (view, data = null) => {
    console.log(`Navegando a: ${view}`, data ? `con datos: ${JSON.stringify(data)}` : '');
    setCurrentView(view);
    if (view === 'productDetail' && data !== null) {
      setSelectedProductId(data);
    } else {
      setSelectedProductId(null);
    }
    if (view === 'orderConfirmation' && data !== null) {
        setOrderDetailsForConfirmation(data);
    } else {
      setOrderDetailsForConfirmation(null);
    }
    window.scrollTo(0, 0);
  };

  const addToCart = (productToAdd, quantity = 1) => {
    if (!productToAdd || !productToAdd.id || productToAdd.price === undefined || productToAdd.stock === undefined) {
        console.error("Intento de añadir producto inválido al carrito:", productToAdd);
        return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === productToAdd.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, productToAdd.stock);
        if (newQuantity > existingItem.quantity) {
             console.log(`Cantidad de ${productToAdd.name} actualizada a ${newQuantity}`);
        } else if (quantity > 0) {
             console.warn(`No se pudo añadir más ${productToAdd.name}. Stock máximo alcanzado.`);
        }
        return prevItems.map(item =>
          item.id === productToAdd.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
         const initialQuantity = Math.min(quantity, productToAdd.stock);
         if (initialQuantity < 1) {
             console.warn(`No se puede añadir ${productToAdd.name} porque no hay stock.`);
             return prevItems;
         }
         console.log(`${productToAdd.name} (x${initialQuantity}) añadido al carrito.`);
         return [...prevItems, {
            ...productToAdd,
            quantity: initialQuantity,
            imageUrl: productToAdd.imageUrl || `https://placehold.co/100x100/FFEBEB/B91C1C?text=${encodeURIComponent(productToAdd.name || '?')}` // Cambio de color placeholder
        }];
      }
    });
  };

  const updateCartItemQuantity = (productId, newQuantity) => {
    const itemInCart = cartItems.find(item => item.id === productId);
    if (!itemInCart) return;

    if (newQuantity > itemInCart.stock) {
        console.warn(`Cantidad máxima (${itemInCart.stock}) alcanzada para ${itemInCart.name}.`);
        newQuantity = itemInCart.stock;
    }

    if (newQuantity < 1) {
      removeCartItem(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeCartItem = (productId) => {
    console.log(`Eliminando producto ID: ${productId} del carrito.`);
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    console.log("Vaciando el carrito de compras.");
    setCartItems([]);
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const renderView = () => {
    console.log("Renderizando vista:", currentView);
    switch (currentView) {
      case 'products':
        return <ProductList 
                  setCurrentView={navigateTo} 
                  addToCart={addToCart} 
                  searchTerm={searchTerm} 
                  selectedCategory={selectedCategory} 
                  setSelectedCategory={setSelectedCategory} 
               />;
      case 'productDetail':
        return <ProductDetail productId={selectedProductId} setCurrentView={navigateTo} addToCart={addToCart} />;
      case 'cart':
        return <CartView cartItems={cartItems} setCurrentView={navigateTo} updateCartItemQuantity={updateCartItemQuantity} removeCartItem={removeCartItem} />;
      case 'checkout':
        return <CheckoutView cartItems={cartItems} setCurrentView={navigateTo} />;
      case 'orderConfirmation':
        return <OrderConfirmation setCurrentView={navigateTo} orderDetails={orderDetailsForConfirmation} clearCart={clearCart} />;
      case 'categories':
        return <div className="container mx-auto p-8 text-center"><h1 className="text-2xl font-semibold">Categorías</h1><p className="text-gray-600 mt-4">Próximamente: Productos agrupados por categoría.</p></div>;
      case 'profile':
        return <div className="container mx-auto p-8 text-center"><h1 className="text-2xl font-semibold">Mi Perfil</h1><p className="text-gray-600 mt-4">Próximamente: Detalles de usuario, historial de pedidos, direcciones.</p></div>;
      default:
        console.warn(`Vista desconocida: ${currentView}, mostrando productos.`);
        return <ProductList 
                  setCurrentView={navigateTo} 
                  addToCart={addToCart} 
                  searchTerm={searchTerm} 
                  selectedCategory={selectedCategory} 
                  setSelectedCategory={setSelectedCategory} 
               />;
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col antialiased">
      <Header 
        setCurrentView={navigateTo} 
        cartItemCount={cartItemCount} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
      />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;