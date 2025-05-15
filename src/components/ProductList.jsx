import React, { useState, useEffect, useMemo } from 'react';

// Asegúrate de que esta URL sea accesible desde donde ejecutes el frontend.
const API_BASE_URL = 'http://35.247.248.71:3001/api';

const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

const EmptyBoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-gray-400 mb-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10.5 18.75h3M10.5 12h3m2.25-4.5h-9A2.25 2.25 0 0 0 3.75 9.75v.75m16.5-.75v1.5m-16.5 0v-1.5m16.5 0h-12m9-3.75H9.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h5.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125Z" />
  </svg>
);

/**
 * Componente ProductList: Muestra una cuadrícula de productos obtenidos de la API.
 * @param {function} setCurrentView - Función para navegar a la vista de detalle del producto.
 * @param {function} addToCart - Función para añadir un producto al carrito.
 * @param {string} searchTerm - El término de búsqueda para filtrar productos.
 * @param {string} selectedCategory - La categoría seleccionada para filtrar productos.
 * @param {function} setSelectedCategory - Función para actualizar la categoría seleccionada.
 */
const ProductList = ({ setCurrentView, addToCart, searchTerm, selectedCategory, setSelectedCategory }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    console.log(`Fetching products from: ${API_BASE_URL}/productos`);
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
          imageUrl: imageUrlFromApi || `https://placehold.co/300x300/FFEBEB/B91C1C?text=${encodeURIComponent(prod.titulo || 'Producto')}`,
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const categories = useMemo(() => {
    if (products.length === 0) return [];
    const uniqueCategories = [...new Set(products.map(p => p.category).filter(c => c && c !== 'Sin categoría'))];
    return ['Todas', ...uniqueCategories.sort()];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let tempProducts = products;

    if (selectedCategory && selectedCategory !== 'Todas') {
      tempProducts = tempProducts.filter(product => product.category === selectedCategory);
    }

    if (searchTerm) {
      tempProducts = tempProducts.filter(product =>
        (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.category && product.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return tempProducts;
  }, [products, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500" aria-label="Cargando"></div>
        <p className="ml-4 mt-4 text-lg text-gray-700">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-10 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <div className="bg-red-100 p-6 rounded-lg shadow-md max-w-md">
          <div className="flex items-center justify-center text-red-600 mb-3">
            <ErrorIcon />
            <p className="text-xl font-semibold">Error al cargar</p>
          </div>
          <p className="text-red-700 text-sm mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-10 min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <EmptyBoxIcon />
        <p className="text-gray-600 text-xl mb-2">No se encontraron productos inicialmente.</p>
        <p className="text-gray-500 text-sm">Intenta verificar la API o vuelve más tarde.</p>
      </div>
    );
  }

  if (filteredProducts.length === 0 && products.length > 0) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-10 text-center">Nuestros Productos</h2>
        <EmptyBoxIcon />
        <p className="text-gray-600 text-xl mt-4 mb-2">No se encontraron productos para "{searchTerm}".</p>
        <p className="text-gray-500 text-sm">Intenta con otro término de búsqueda o revisa la ortografía.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-10 text-center">Nuestros Productos</h2>
      
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5 space-y-3 md:sticky md:top-24 h-fit bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Categorías</h3>
          <ul className="space-y-1">
            {categories.map(category => (
              <li key={category}>
                <button
                  onClick={() => setSelectedCategory(category === 'Todas' ? '' : category)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors 
                              ${(selectedCategory === category || (selectedCategory === '' && category === 'Todas')) 
                                ? 'bg-red-100 text-red-700' 
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1`}
                >
                  {category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-grow md:w-3/4 lg:w-4/5">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <EmptyBoxIcon />
              <p className="text-gray-600 text-xl mt-4 mb-2">
                No se encontraron productos {selectedCategory && selectedCategory !== 'Todas' ? `en la categoría "${selectedCategory}"` : ''} 
                {searchTerm ? `para "${searchTerm}"` : ''}.
              </p>
              <p className="text-gray-500 text-sm">Intenta con otros filtros o términos de búsqueda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-8 md:gap-x-8 md:gap-y-10">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col group focus-within:ring-2 focus-within:ring-red-500 focus-within:ring-offset-2">
                  <div className="relative aspect-square">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/300x300/FFEBEB/B91C1C?text=Imagen+no+disponible`; }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-md lg:text-lg font-semibold text-gray-800 mb-1 min-h-[2.5em] line-clamp-2" title={product.name}>{product.name}</h3>
                    <p className="text-gray-500 text-xs mb-2">Categoría: {product.category}</p>
                    <p className="text-lg lg:text-xl font-bold text-red-700 mb-3">${product.price.toFixed(2)}</p>
                    <p className={`text-xs mb-3 font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `Disponible (${product.stock})` : 'Agotado'}
                    </p>
                    <div className="mt-auto pt-3 border-t border-gray-200 space-y-2">
                      <button
                        onClick={() => setCurrentView('productDetail', product.id)}
                        className="w-full bg-gray-100 text-red-700 hover:bg-red-200 hover:text-red-800 font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        Ver Detalles
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 text-sm disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                      >
                        {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductList; 