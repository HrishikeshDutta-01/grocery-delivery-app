import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../context/Appcontext';
import axios from 'axios';
import ProductCart from '../components/ProductCart';


const ProductDetails = () => {
  const { navigate, currency, addToCart } = useAppContext();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/product/${id}`);
        if (data.success) {
          setProduct(data.product);
          setThumbnail(data.product?.images?.[0] || null);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;
      try {
        const { data } = await axios.get('/api/product/list');
        if (data.success) {
          const related = data.products
            .filter((p) => p.category === product.category && p._id !== product._id)
            .slice(0, 5);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRelated();
  }, [product]);

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="mt-12">
      {/* Breadcrumb */}
      <p>
        <a href="/">Home</a> / <a href="/products">Products</a> / <span className="text-emerald-500">{product.name}</span>
      </p>

      {/* Images and info */}
      <div className="flex flex-col md:flex-row gap-16 mt-4">
        <div className="flex gap-3">
          <div className="flex flex-col gap-3">
            {product.images?.map((img, i) => (
              <div key={i} onClick={() => setThumbnail(img)} className="border max-w-24 border-gray-500/30 rounded cursor-pointer">
                <img src={img} alt={`Thumbnail ${i + 1}`} />
              </div>
            ))}
          </div>
          <div className="border border-gray-500/30 max-w-100 rounded overflow-hidden">
            <img src={thumbnail} alt="Selected" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="text-sm w-full md:w-1/2">
          <h1 className="text-3xl font-medium">{product.name}</h1>
          <p className="mt-6 text-gray-500/70 line-through">MRP: {currency} {product.price}</p>
          <p className="text-2xl font-medium">Offer: {currency} {product.offerPrice}</p>

          <p className="text-base font-medium mt-6">About Product</p>
          <ul className="list-disc ml-4 text-gray-500/70">
            {Array.isArray(product.description)
              ? product.description.map((desc, i) => <li key={i}>{desc}</li>)
              : <li>{product.description}</li>}
          </ul>

          <div className="flex items-center mt-10 gap-4 text-base">
            <button onClick={() => addToCart(product._id)} className="w-full py-3.5 bg-gray-100 hover:bg-gray-200">Add to Cart</button>
            <button onClick={() => { addToCart(product._id); navigate("/cart"); }} className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white">Buy Now</button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-20">
        <h2 className="text-3xl">Related Products</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-6">
          {relatedProducts.filter(p => p.inStock).map((p, i) => <ProductCart key={i} product={p} />)}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
