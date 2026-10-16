
import React, { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import StatusMessage from '../components/StatusMessage.jsx';
import { useCart } from '../context/CartContext.jsx';
import { api } from '../services/api.js';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { addToCart, cartMessage } = useCart();

  useEffect(() => {
    let active = true;

    api.getProducts()
      .then((data) => {
        if (active) {
          setProducts(data.products);
        }
      })
      .catch((caught) => {
        if (active) {
          setError(caught.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => [
      'All',
      ...new Set(products.map((product) => product.category))
    ],
    [products]
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      const matchesCategory =
        category === 'All' || product.category === category;

      return matchesSearch && matchesCategory;
    });

    // Sort a copy without modifying the original product data.
    const sortedProducts = [...filteredProducts];

    if (sortBy === 'price-low') {
      sortedProducts.sort(
        (a, b) => Number(a.price) - Number(b.price)
      );
    } else if (sortBy === 'price-high') {
      sortedProducts.sort(
        (a, b) => Number(b.price) - Number(a.price)
      );
    } else if (sortBy === 'name-az') {
      sortedProducts.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return sortedProducts;
  }, [products, search, category, sortBy]);

  return (
    <section>
      <div className="hero">
        <div>
          <p className="eyebrow">BSIT FULL-STACK PROJECT</p>

          <h1>Technology for study, work and play</h1>

          <p>
            Browse the starter catalog, build a cart and complete a simulated
            order.
          </p>
        </div>
      </div>

      <div className="toolbar">
        <label>
          <span>Search products</span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try keyboard or privacy cover"
          />
        </label>

        <label>
          <span>Category</span>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Sort by</span>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
          >
            <option value="default">Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name-az">Name: A to Z</option>
          </select>
        </label>
      </div>

      <StatusMessage>{cartMessage}</StatusMessage>

      {loading && (
        <StatusMessage>
          Loading products…
        </StatusMessage>
      )}

      {error && (
        <StatusMessage type="error">
          {error} Make sure the backend is running.
        </StatusMessage>
      )}

      {!loading && !error && visibleProducts.length === 0 && (
        <StatusMessage>
          No products match your filters.
        </StatusMessage>
      )}

      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>
    </section>
  );
}
