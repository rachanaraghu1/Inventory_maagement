import React, { useEffect, useState } from 'react';

export default function LowStockProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3001/products', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : [data]);
      } catch (err) {
        setError(err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const lowStockProducts = products.filter(p => Number(p.quantity) < 5);

  return (
    <div className="container-fluid p-5">
      <h1>Low Stock Products (Quantity &lt; 5)</h1>
      {error && <div className="alert alert-danger">Error: {error}</div>}
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading products...</p>
        </div>
      ) : lowStockProducts.length === 0 ? (
        <div className="alert alert-info">No low stock products found.</div>
      ) : (
        <div className="overflow-auto" style={{ maxHeight: "38rem" }}>
          <table className="table table-striped table-hover fs-5">
            <thead>
              <tr>
                <th>#</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Product Barcode</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.map((product, index) => (
                <tr key={product._id || index}>
                  <th scope="row">{index + 1}</th>
                  <td>{product.ProductName || 'N/A'}</td>
                  <td>{product.ProductPrice || 'N/A'}</td>
                  <td>{product.ProductBarcode || 'N/A'}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 