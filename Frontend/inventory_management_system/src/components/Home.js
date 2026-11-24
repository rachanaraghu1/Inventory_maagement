import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (Number(p.ProductPrice) || 0), 0);
  const mostExpensive = products.reduce((max, p) => (Number(p.ProductPrice) > Number(max.ProductPrice) ? p : max), products[0] || {});
  const leastExpensive = products.reduce((min, p) => (Number(p.ProductPrice) < Number(min.ProductPrice) ? p : min), products[0] || {});
  const lowStockCount = products.filter(p => Number(p.quantity) < 5).length;

  // Prepare data for charts
  const valueTrendData = products.map(p => ({
    name: p.ProductName,
    value: (Number(p.ProductPrice) || 0) * (Number(p.quantity) || 0)
  }));

  const quantityPieData = products.map(p => ({
    name: p.ProductName,
    value: Number(p.quantity) || 0
  }));

  const pieColors = ['#1976d2', '#26a69a', '#fbc02d', '#8e24aa', '#ef5350', '#43a047', '#ffa726', '#5c6bc0'];

  const cardStyle = {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    flex: 1,
    margin: "10px",
    minWidth: "200px",
  };

  const cardsContainer = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "40px",
  };

  const headingStyle = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "5px",
    color: "#102542",
  };

  const subheadingStyle = {
    fontSize: "16px",
    color: "#555",
    marginBottom: "40px",
  };

  const metricValue = {
    fontSize: "28px",
    fontWeight: "600",
    color: "#2c3e50",
  };

  const chartPlaceholder = {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    flex: 1,
    minHeight: "250px",
    margin: "10px",
  };

  return (
   <div
  style={{
    backgroundImage: 'url("/homepage.png")',
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    padding: "40px",
    minHeight: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // transparent white overlay
    backgroundBlendMode: "lighten",
  }}
>
      <h1 style={headingStyle}>Smart Inventory</h1>
      <p style={subheadingStyle}>Your intelligent inventory dashboard for real-time business insights and control.</p>
      {error && <div style={{ color: 'red', marginBottom: 20 }}>Error: {error}</div>}
      {loading ? (
        <div style={{ color: '#555', marginBottom: 20 }}>Loading stats...</div>
      ) : (
      <div style={cardsContainer}>
        <div style={{...cardStyle, cursor: 'pointer'}} onClick={() => navigate('/products')}>
          <h4>Total Products</h4>
          <p style={metricValue}>{totalProducts}</p>
        </div>
        <div style={{...cardStyle, cursor: 'pointer'}} onClick={() => navigate('/products')}>
          <h4>Total Value</h4>
          <p style={metricValue}>₹{(totalValue * 83).toLocaleString()}</p>
        </div>
        <div style={cardStyle}>
          <h4>Most Expensive Product</h4>
          <p style={metricValue}>{mostExpensive?.ProductName || 'N/A'}</p>
          <p style={{ color: '#2c3e50' }}>₹{mostExpensive?.ProductPrice ? (Number(mostExpensive.ProductPrice) * 83).toLocaleString() : 'N/A'}</p>
        </div>
        <div style={cardStyle}>
          <h4>Least Expensive Product</h4>
          <p style={metricValue}>{leastExpensive?.ProductName || 'N/A'}</p>
          <p style={{ color: '#2c3e50' }}>₹{leastExpensive?.ProductPrice ? (Number(leastExpensive.ProductPrice) * 83).toLocaleString() : 'N/A'}</p>
        </div>
        <div style={{ ...cardStyle, border: "1px solid #ffcdd2", cursor: 'pointer' }} onClick={() => navigate('/low-stock')}>
          <h4>Low Stock Items</h4>
          <p style={metricValue}>{lowStockCount}</p>
          <p style={{ color: "#1976d2" }}>Quantity &lt; 5</p>
        </div>
      </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "20px" }}>
        <div style={chartPlaceholder}>
          <h4>Inventory Value Trend</h4>
          {valueTrendData.length === 0 ? (
            <p style={{ color: "#aaa", marginTop: "20px" }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={valueTrendData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" tick={{ fontSize: 13 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 13 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div style={chartPlaceholder}>
          <h4>Products by Quantity</h4>
          {quantityPieData.length === 0 ? (
            <p style={{ color: "#aaa", marginTop: "20px" }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={quantityPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  label
                >
                  {quantityPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* About Section */}
      <div style={{
        marginTop: "60px",
        padding: "40px 20px",
        background: "rgba(255,255,255,0.95)",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
        textAlign: "center",
        maxWidth: 900,
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <h2>About Smart Inventory</h2>
        <p>
          Smart Inventory is your all-in-one solution for managing products, tracking stock, and gaining business insights. 
          Designed for ease of use, it helps you stay organized and make smarter decisions.
        </p>
        <p>
          <strong>Features:</strong> Real-time stats, product management, low stock alerts, user authentication, and more!
        </p>
      </div>

      {/* Contact/Support Section */}
      <div style={{
        marginTop: "30px",
        padding: "30px 20px",
        background: "#f8f9fa",
        borderRadius: "12px",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
        textAlign: "center",
        maxWidth: 700,
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        <h3>Contact & Support</h3>
        <p>Have questions or need help? Reach out to our support team!</p>
        <a href="mailto:support@smartinventory.com" style={{
          display: "inline-block",
          margin: "10px 0",
          padding: "10px 24px",
          background: "#0fd0fc",
          color: "#fff",
          borderRadius: "6px",
          textDecoration: "none",
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(15,208,252,0.08)",
          transition: "background 0.2s"
        }}>Email Support</a>
        <p style={{ marginTop: 10, color: '#888' }}>Or call us at <a href="tel:+1234567890" style={{ color: '#1976d2', textDecoration: 'none' }}>+1 234 567 890</a></p>
      </div>

      {/* Call to Action Section */}
      <div style={{
        marginTop: "40px",
        marginBottom: "40px",
        textAlign: "center"
      }}>
        <button
          style={{
            padding: "16px 40px",
            background: "linear-gradient(135deg, #0fd0fc 0%, #1976d2 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontSize: "1.2rem",
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 4px 16px rgba(15,208,252,0.12)",
            transition: "background 0.2s, transform 0.2s"
          }}
          onClick={() => window.location.href = '/insertproduct'}
        >
          + Add Your First Product
        </button>
        <p style={{ marginTop: 12, color: '#888' }}>Start building your inventory now!</p>
      </div>
    </div>
  );
}
