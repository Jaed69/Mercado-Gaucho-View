import React, { useState, useEffect } from 'react';

// Asegúrate de que esta URL sea accesible desde donde ejecutes el frontend.
const API_BASE_URL = 'http://35.247.248.71:3001/api';

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

export default ProductList; 