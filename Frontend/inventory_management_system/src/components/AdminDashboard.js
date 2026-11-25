import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleUpdating, setRoleUpdating] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch all users
      const usersRes = await fetch('https://inventory-maagement.onrender.com/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!usersRes.ok) throw new Error('Failed to fetch users');
      const usersData = await usersRes.json();
      setUsers(usersData);

      // Fetch all products
      const productsRes = await fetch('https://inventory-maagement.onrender.com/all-products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!productsRes.ok) throw new Error('Failed to fetch products');
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const res = await fetch(`https://inventory-maagement.onrender.com/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete user');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const changeRole = async (id, newRole) => {
    setRoleUpdating(id);
    try {
      const res = await fetch(`https://inventory-maagement.onrender.com/users/${id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) throw new Error('Failed to update role');
      fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setRoleUpdating('');
    }
  };

  return (
    <div className="container-fluid p-5">
      <h1>Admin Dashboard</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2 className="mt-4">All Users</h2>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-primary">
                <tr>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => deleteUser(user._id)}
                        disabled={roleUpdating === user._id}
                      >Delete</button>
                      <button
                        className="btn btn-secondary btn-sm me-2"
                        onClick={() => changeRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                        disabled={roleUpdating === user._id}
                      >
                        {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="mt-5">All Products</h2>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Product Name</th>
                  <th>Product Price</th>
                  <th>Product Barcode</th>
                  <th>Quantity</th>
                  <th>Reserved</th>
                  <th>User ID</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, idx) => (
                  <tr key={product._id}>
                    <td>{idx + 1}</td>
                    <td>{product.ProductName}</td>
                    <td>{product.ProductPrice}</td>
                    <td>{product.ProductBarcode}</td>
                    <td>{product.quantity}</td>
                    <td>{product.reserved}</td>
                    <td>{product.userId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
} 