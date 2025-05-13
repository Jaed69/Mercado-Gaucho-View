// src/App.js
// Componente principal de la aplicación de E-commerce en React.
// Se conecta a la API proporcionada para obtener datos de productos.
// Incluye funcionalidad de carrito de compras y estructura para checkout.

import React, { useState, useEffect } from 'react';

// --- URL Base de la API ---
// Asegúrate de que esta URL sea accesible desde donde ejecutes el frontend.
const API_BASE_URL = 'http://35.247.248.71:3001/api';

// --- Iconos SVG como componentes de React ---
// Se utilizan para elementos visuales como el carrito, usuario, etc.
const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>
);

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

// --- Componentes de la Aplicación ---

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

/**
 * Componente ProductList: Muestra una cuadrícula de productos obtenidos de la API.
 * @param {function} setCurrentView - Función para navegar a la vista de detalle del producto.
 * @param {function} addToCart - Función para añadir un producto al carrito.
 */
const ProductList = ({ setCurrentView, addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      console.log(`Workspaceing products from: ${API_BASE_URL}/productos`);
      try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        console.log("Response status:", response.status);
        if (!response.ok) {
          let errorBody = 'No se pudo obtener más detalles.';
          try {
            errorBody = await response.text();
          } catch (parseError) {
            console.error("Error parsing error response body:", parseError);
          }
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Detalles: ${errorBody}`);
        }
        const data = await response.json();
        console.log("Products data received:", data);

        const formattedProducts = data.map(prod => {
          const imageUrlFromApi = prod.imagen_url || prod.imageUrl || prod.foto_url;
          return {
            id: prod.id_producto,
            name: prod.titulo || 'Nombre no disponible',
            price: parseFloat(prod.precio) || 0,
            imageUrl: imageUrlFromApi || `https://placehold.co/300x300/FFEBEB/B91C1C?text=${encodeURIComponent(prod.titulo || 'Producto')}`, // Cambio de color placeholder
            description: prod.descripcion || 'Descripción no disponible.',
            stock: parseInt(prod.stock) >= 0 ? parseInt(prod.stock) : 0,
            category: prod.nombre_categoria || 'Sin categoría',
          };
        });
        setProducts(formattedProducts);
      } catch (err) {
        console.error("Error detallado al cargar productos:", err);
        setError(`Error al cargar productos: ${err.message}. Verifica la conexión con la API y la consola del navegador para más detalles.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500" aria-label="Cargando"></div> {/* Cambio de color */}
        <p className="ml-4 text-lg text-gray-600">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <p className="text-red-600 bg-red-100 p-4 rounded-lg text-xl shadow-md">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return <p className="text-center py-10 text-gray-500 text-xl">No se encontraron productos.</p>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Nuestros Productos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col group">
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={`[Imagen de ${product.name}]`}
                className="w-full h-56 object-cover"
                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/FFEBEB/B91C1C?text=Imagen+no+disponible`; }} // Cambio de color placeholder
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300"></div>
            </div>
            <div className="p-4 md:p-6 flex flex-col flex-grow">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 h-14 overflow-hidden" title={product.name}>{product.name}</h3>
              <p className="text-gray-500 text-xs mb-2">Categoría: {product.category}</p>
              <p className="text-xl md:text-2xl font-bold text-red-700 mb-3">${product.price.toFixed(2)}</p> {/* Cambio de color */}
              <p className={`text-sm mb-3 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `Stock: ${product.stock}` : 'Agotado'}
              </p>
              <div className="mt-auto pt-3 border-t border-gray-100">
                <button
                  onClick={() => setCurrentView('productDetail', product.id)}
                  className="w-full bg-gray-100 text-red-700 hover:bg-gray-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 mb-2 text-sm" // Cambio de color
                >
                  Ver Detalles
                </button>
                <button
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed" // Cambio de color
                >
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Componente ProductDetail: Muestra la información detallada de un producto específico.
 * @param {number} productId - ID del producto a mostrar.
 * @param {function} setCurrentView - Función para volver a la lista de productos.
 * @param {function} addToCart - Función para añadir el producto al carrito.
 */
const ProductDetail = ({ productId, setCurrentView, addToCart }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!productId) {
      setError("ID de producto no proporcionado.");
      setLoading(false);
      return;
    }

    const fetchProductDetail = async () => {
      setLoading(true);
      setError(null);
      console.log(`Workspaceing product detail for ID: ${productId} from ${API_BASE_URL}/productos/${productId}`);
      try {
        const response = await fetch(`${API_BASE_URL}/productos/${productId}`);
        console.log("Detail response status:", response.status);
        if (!response.ok) {
          let errorBody = 'No se pudo obtener más detalles.';
          try { errorBody = await response.text(); } catch (e) { /* ignore */ }
          if (response.status === 404) {
            throw new Error('Producto no encontrado.');
          }
          throw new Error(`Error HTTP ${response.status}: ${response.statusText}. Detalles: ${errorBody}`);
        }
        const data = await response.json();
        console.log("Product detail data received:", data);

        const imageUrlFromApi = data.imagen_url || data.imageUrl || data.foto_url;

        setProduct({
          id: data.id_producto,
          name: data.titulo || 'Nombre no disponible',
          price: parseFloat(data.precio) || 0,
          imageUrl: imageUrlFromApi || `https://placehold.co/600x600/FFEBEB/B91C1C?text=${encodeURIComponent(data.titulo || 'Producto')}`, // Cambio de color placeholder
          description: data.descripcion || 'Descripción detallada no disponible.',
          stock: parseInt(data.stock) >= 0 ? parseInt(data.stock) : 0,
          category: data.nombre_categoria || 'Sin categoría',
          vendedor: data.vendedor_nombre || 'No especificado',
          images: data.imagenes_adicionales || [],
          reviews: data.reviews || []
        });
      } catch (err) {
        console.error(`Error detallado al cargar el producto ${productId}:`, err);
        setError(`Error al cargar el producto: ${err.message}.`);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, Math.min(prev + amount, product?.stock || 1)));
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500" aria-label="Cargando"></div> {/* Cambio de color */}
         <p className="ml-4 text-lg text-gray-600">Cargando detalle del producto...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 p-4 rounded-lg text-xl shadow-md mb-4">{error || "Producto no encontrado."}</p>
        <button
          onClick={() => setCurrentView('products')}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors" // Cambio de color
        >
          Volver a Productos
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button
        onClick={() => setCurrentView('products')}
        className="mb-8 text-red-600 hover:text-red-800 font-medium flex items-center group" // Cambio de color
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Volver a la lista
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="shadow-xl rounded-lg overflow-hidden sticky top-24">
          <img
            src={product.imageUrl}
            alt={`[Imagen principal de ${product.name}]`}
            className="w-full h-auto object-cover aspect-square"
            onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/FFEBEB/B91C1C?text=Imagen+no+disponible'; }} // Cambio de color placeholder
          />
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 gap-2 p-2 bg-gray-50">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`[Imagen ${index + 1} de ${product.name}]`}
                  className="w-full h-20 md:h-24 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity border border-gray-200"
                  onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/FFEBEB/B91C1C?text=Error'; }} // Cambio de color placeholder
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-1">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-1">Categoría: {product.category}</p>
          <p className="text-3xl font-semibold text-red-700 mb-6">${product.price.toFixed(2)}</p> {/* Cambio de color */}

          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-6">
            <h4 className="font-semibold text-gray-800 text-lg mb-2">Descripción:</h4>
            <p>{product.description}</p>
          </div>

          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-3 font-medium text-gray-700">Cantidad:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={quantity <= 1}>-</button>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={quantity}
                readOnly
                className="w-12 text-center border-l border-r border-gray-300 py-1.5 focus:outline-none"
                min="1"
                max={product.stock}
                aria-label="Cantidad seleccionada"
              />
              <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={quantity >= product.stock}>+</button>
            </div>
            <span className={`ml-4 text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ({product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'})
            </span>
          </div>

          <button
            onClick={() => addToCart(product, quantity)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed" // Cambio de color
            disabled={product.stock === 0}
          >
            {product.stock > 0 ? 'Añadir al Carrito' : 'Producto Agotado'}
          </button>
          {product.stock === 0 && <p className="text-red-500 text-sm mt-2 text-center">Este producto no está disponible actualmente.</p>}
        </div>
      </div>

      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reseñas de Clientes</h2>
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="flex items-center mb-1">
                  <p className="font-semibold text-gray-700">{review.user}</p>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"> {/* Mantenido amarillo para estrellas */}
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 text-sm">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


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

/**
 * Componente Footer: Pie de página de la aplicación.
 */
const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-16"> {/* Mantenido oscuro para contraste */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-sm">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Mercado Gaucho</h3> {/* Cambio de nombre */}
            <p className="text-gray-400">Tu destino para encontrar los mejores productos en línea. Calidad y servicio garantizados.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors">Sobre Nosotros</a></li>
              <li><a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors">Política de Privacidad</a></li>
              <li><a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors">Términos y Condiciones</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
              </a>
               <a href="#" onClick={(e)=> e.preventDefault()} className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                 <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.023.047 1.351.058 3.807.058h.468c2.456 0 2.784-.011 3.807-.058.975-.045 1.504-.207 1.857-.344.467-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.047-1.023.058-1.351.058-3.807v-.468c0-2.456-.011-2.784-.058-3.807-.045-.975-.207-1.504-.344-1.857-.182-.467-.399-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344C14.748 3.813 14.419 3.802 12 3.802z" clipRule="evenodd" /><path d="M12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-gray-400 text-sm">&copy; {new Date().getFullYear()} Mercado Gaucho. Todos los derechos reservados.</p> {/* Cambio de nombre */}
        </div>
      </div>
    </footer>
  );
};


/**
 * Componente Principal App: Orquesta la aplicación, maneja el estado global
 * (vista actual, carrito) y la navegación entre vistas.
 */
function App() {
  const [currentView, setCurrentView] = useState('products');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [orderDetailsForConfirmation, setOrderDetailsForConfirmation] = useState(null);

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
        return <ProductList setCurrentView={navigateTo} addToCart={addToCart} />;
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
        return <ProductList setCurrentView={navigateTo} addToCart={addToCart} />;
    }
  };

  return (
    <div className="font-sans bg-gray-100 min-h-screen flex flex-col antialiased">
      <Header setCurrentView={navigateTo} cartItemCount={cartItemCount} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer />
    </div>
  );
}

export default App;