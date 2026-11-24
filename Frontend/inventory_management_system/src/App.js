import './App.css';
import Home from './components/Home';
import Navbar from './components/Navbar';
import Products from './components/Products';
import InsertProduct from './components/InsertProduct';
import UpdateProduct from './components/UpdateProduct';
import About from './components/About';
import LowStockProducts from './components/LowStockProducts';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/Profile';
import AdminDashboard from './components/AdminDashboard';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar title="IMS" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/products" element={<Products />} />
          <Route path="/insertproduct" element={<InsertProduct />} />
          <Route path="/updateproduct/:id" element={<UpdateProduct />} />
          <Route path="/about" element={<About />} />
          <Route path="/low-stock" element={<LowStockProducts />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
