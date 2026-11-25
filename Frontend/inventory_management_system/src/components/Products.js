import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    getProducts();
  }, [location]);

  useEffect(() => {
    setFilteredProducts(productData);
  }, [productData]);

  const getProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const res = await fetch("https://inventory-maagement.onrender.com/products", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      // Ensure data is an array
      const productsArray = Array.isArray(data) ? data : [data];
      
      setProductData(productsArray);
      console.log("Products set:", productsArray);

    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setProductData([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://inventory-maagement.onrender.com/deleteproduct/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const deletedata = await response.json();
      console.log("Product deleted:", deletedata);
      getProducts(); // Refresh the list after deletion

    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      setFilteredProducts(productData);
      return;
    }
    const term = searchTerm.trim().toLowerCase();
    setFilteredProducts(
      productData.filter(p =>
        (p.ProductName && p.ProductName.toLowerCase().includes(term)) ||
        (p.ProductBarcode && String(p.ProductBarcode).toLowerCase().includes(term)) ||
        (p.ProductPrice && String(p.ProductPrice).toLowerCase().includes(term))
      )
    );
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredProducts(productData);
  };

  return (
    <div className="container-fluid p-5">
      <h1>Products Inventory</h1>
      <div className="add_button mb-4 d-flex flex-wrap align-items-center justify-content-between" style={{ gap: 16 }}>
        <NavLink to="/insertproduct" className="btn btn-primary fs-5">+ Add New Product</NavLink>
        <form
          className="d-flex align-items-center search-bar-box"
          onSubmit={handleSearch}
          style={{
            background: '#fff',
            borderRadius: 30,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            padding: '6px 16px',
            gap: 8,
            minWidth: 260,
            maxWidth: 400,
            width: '100%',
            marginLeft: 'auto',
            marginTop: 8,
          }}
        >
          <input
            className="form-control border-0 shadow-none"
            type="search"
            placeholder="Search by name, barcode, or price"
            aria-label="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ borderRadius: 20, fontSize: 16, minWidth: 0, flex: 1 }}
          />
          <button className="btn btn-primary" type="submit" style={{ borderRadius: 20, fontWeight: 500, padding: '4px 16px' }}>Search</button>
          <button className="btn btn-outline-secondary" type="button" onClick={handleClearSearch} style={{ borderRadius: 20, fontWeight: 500, padding: '4px 16px' }}>Clear</button>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="overflow-auto" style={{ maxHeight: "38rem" }}>
          <table className="table table-striped table-hover fs-5">
            <thead>
              <tr className="tr_color">
                <th scope="col">#</th>
                <th scope="col">Product Name</th>
                <th scope="col">Product Price</th>
                <th scope="col">Product Barcode</th>
                <th scope="col">Quantity</th>
                <th scope="col">Reserved</th>
                <th scope="col">Available</th>
                <th scope="col">Update</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    No products found. Add a product to get started.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((element, index) => (
                  <tr key={element._id || index}>
                    <th scope="row">{index + 1}</th>
                    <td>{element.ProductName || 'N/A'}</td>
                    <td>{element.ProductPrice || 'N/A'}</td>
                    <td>{element.ProductBarcode || 'N/A'}</td>
                    <td>{element.quantity !== undefined ? element.quantity : 'N/A'}</td>
                    <td>{element.reserved !== undefined ? element.reserved : 'N/A'}</td>
                    <td>{(element.quantity !== undefined && element.reserved !== undefined) ? (element.quantity - element.reserved) : 'N/A'}</td>
                    <td>
                      <NavLink 
                        to={`/updateproduct/${element._id}`} 
                        className="btn btn-primary"
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </NavLink>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger" 
                        onClick={() => deleteProduct(element._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}