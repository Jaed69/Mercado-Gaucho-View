import React, { useState, useEffect } from 'react';

// Asegúrate de que esta URL sea accesible desde donde ejecutes el frontend.
const API_BASE_URL = 'http://35.247.248.71:3001/api';

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

export default ProductDetail; 