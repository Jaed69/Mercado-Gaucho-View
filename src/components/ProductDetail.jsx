import React, { useState, useEffect } from 'react';

// Asegúrate de que esta URL sea accesible desde donde ejecutes el frontend.
const API_BASE_URL = 'http://35.247.248.71:3001/api';

// Iconos (puedes moverlos a un archivo de iconos si los usas en más sitios)
const ErrorIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
  </svg>
);

const BackArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 mr-2 group-hover:-translate-x-0.5 transition-transform">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>
);

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
  const [currentMainImage, setCurrentMainImage] = useState('');

  const fetchProductDetail = async () => {
    if (!productId) {
      setError("ID de producto no proporcionado.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    console.log(`Fetching product detail for ID: ${productId} from ${API_BASE_URL}/productos/${productId}`);
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
      const mainImage = imageUrlFromApi || `https://placehold.co/600x600/FFEBEB/B91C1C?text=${encodeURIComponent(data.titulo || 'Producto')}`;

      setProduct({
        id: data.id_producto,
        name: data.titulo || 'Nombre no disponible',
        price: parseFloat(data.precio) || 0,
        imageUrl: mainImage, // Usar la imagen principal resuelta
        description: data.descripcion || 'Descripción detallada no disponible.',
        stock: parseInt(data.stock) >= 0 ? parseInt(data.stock) : 0,
        category: data.nombre_categoria || 'Sin categoría',
        vendedor: data.vendedor_nombre || 'No especificado',
        images: data.imagenes_adicionales || [], // Asegurarse que sea un array
        reviews: data.reviews || []
      });
      setCurrentMainImage(mainImage);
    } catch (err) {
      console.error(`Error detallado al cargar el producto ${productId}:`, err);
      setError(`Error al cargar el producto: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, Math.min(prev + amount, product?.stock || 1)));
  }

  const handleThumbnailClick = (imageUrl) => {
    setCurrentMainImage(imageUrl);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)] p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-500" aria-label="Cargando"></div>
        <p className="ml-4 mt-4 text-lg text-gray-700">Cargando detalle del producto...</p>
        {/* Aquí podrías implementar un Skeleton Loader para una UX superior */}
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-10 text-center min-h-[calc(100vh-10rem)] flex flex-col justify-center items-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-lg w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center text-red-600 mb-4">
            <ErrorIcon />
            <p className="text-xl font-semibold mt-2 sm:mt-0 sm:ml-2">{product ? 'Producto no encontrado' : 'Error al cargar'}</p>
          </div>
          <p className="text-red-700 text-sm mb-6">{error || "No pudimos encontrar el producto que buscas o ocurrió un error."}</p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <button
              onClick={() => setCurrentView('products')}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Volver a Productos
            </button>
            {!product && (
                <button
                onClick={fetchProductDetail} // Reintentar solo si no es error de producto no encontrado
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <button
        onClick={() => setCurrentView('products')}
        className="mb-8 text-red-600 hover:text-red-700 font-medium flex items-center group px-3 py-2 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
      >
        <BackArrowIcon />
        Volver a la lista
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Columna de Imagenes */}
        <div className="md:sticky md:top-28"> {/* Ajusta top-X según altura del header */}
          <div className="shadow-xl rounded-lg overflow-hidden mb-4">
            <img
              src={currentMainImage}
              alt={product.name}
              className="w-full h-auto object-cover aspect-square transition-all duration-300 ease-in-out"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x600/FFEBEB/B91C1C?text=Imagen+no+disponible'; }}
            />
          </div>
          {product.images && product.images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {/* Miniatura de la imagen principal si es diferente y está en la lista de adicionales, o si solo hay una imagen */} 
              {[product.imageUrl, ...product.images].filter((img, idx, self) => self.indexOf(img) === idx).slice(0,5).map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(imgUrl)}
                  className={`rounded-md overflow-hidden border-2 transition-all ${currentMainImage === imgUrl ? 'border-red-500 ring-2 ring-red-300' : 'border-transparent hover:border-red-300'} focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1`}
                  aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                >
                  <img
                    src={imgUrl}
                    alt={`Miniatura ${index + 1} de ${product.name}`}
                    className="w-full h-20 md:h-24 object-cover aspect-square"
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/FFEBEB/B91C1C?text=Error'; }}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Columna de Información del Producto */}
        <div className="flex flex-col py-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">{product.name}</h1>
          <p className="text-sm text-gray-500 mb-3">Categoría: <span className="font-medium text-gray-600">{product.category}</span></p>
          <p className="text-3xl lg:text-4xl font-bold text-red-700 mb-6">${product.price.toFixed(2)}</p>

          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 leading-relaxed mb-6">
            <h4 className="font-semibold text-gray-800 text-lg mb-1">Descripción:</h4>
            <p>{product.description}</p>
          </div>

          <div className="flex items-center mb-6">
            <label htmlFor={`quantity-${productId}`} className="mr-3 font-medium text-gray-700 text-sm">Cantidad:</label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button onClick={() => handleQuantityChange(-1)} className="px-3 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-red-500" disabled={quantity <= 1} aria-label="Reducir cantidad">-</button>
              <input
                type="text" // Cambiado a text para mejor estilo, la lógica previene no números
                id={`quantity-${productId}`}
                name="quantity"
                value={quantity}
                readOnly
                className="w-12 text-center border-l border-r border-gray-300 py-1.5 focus:outline-none text-sm sm:text-base"
                min="1"
                max={product.stock}
                aria-label="Cantidad seleccionada"
              />
              <button onClick={() => handleQuantityChange(1)} className="px-3 py-1.5 text-lg font-semibold text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-red-500" disabled={quantity >= product.stock} aria-label="Aumentar cantidad">+</button>
            </div>
            <span className={`ml-3 text-xs sm:text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'} font-medium`}>
                ({product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'})
            </span>
          </div>

          <button
            onClick={() => addToCart(product, quantity)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 sm:px-6 rounded-lg text-base sm:text-lg transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
            disabled={product.stock === 0}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {product.stock > 0 ? 'Añadir al Carrito' : 'Producto Agotado'}
          </button>
          {product.stock === 0 && <p className="text-red-500 text-sm mt-2 text-center">Este producto no está disponible actualmente.</p>}
        </div>
      </div>

      {/* Sección de Reseñas */}
      {product.reviews && product.reviews.length > 0 ? (
        <div className="mt-12 md:mt-16 pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Reseñas de Clientes ({product.reviews.length})</h2>
          <div className="space-y-6">
            {product.reviews.map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-2">
                  <p className="font-semibold text-gray-700">{review.user || 'Usuario Anónimo'}</p>
                  {/* Aquí podrías añadir la fecha de la reseña si la tienes */}
                  <div className="ml-auto flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-2 text-xs text-gray-500">({review.rating}/5)</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-12 md:mt-16 pt-8 border-t border-gray-200 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Reseñas de Clientes</h2>
            <p className="text-gray-600">Aún no hay reseñas para este producto.</p>
            <p className="text-sm text-gray-500 mt-1">¡Sé el primero en compartir tu opinión!</p>
        </div>
      )}
    </div>
  );
};

export default ProductDetail; 