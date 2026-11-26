import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';
import ProductFormPage from './pages/ProductFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null;
}

function AppShell() {
  const [cartItems, setCartItems] = useState([]);

  function addToCart(product) {
    setCartItems((items) => {
      const item = items.find((current) => current.product._id === product._id);
      if (!item) return [...items, { product, quantity: 1 }];
      if (product.stock != null && item.quantity >= product.stock) return items;
      return items.map((current) => (current === item ? { ...current, quantity: current.quantity + 1 } : current));
    });
  }

  function removeFromCart(productId) {
    setCartItems((items) =>
      items
        .map((item) => (item.product._id === productId ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  }

  function quantityOf(productId) {
    return cartItems.find((item) => item.product._id === productId)?.quantity ?? 0;
  }

  const cart = { quantityOf, add: addToCart, remove: removeFromCart };
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="App">
      <ScrollToTop />
      <Navbar cartCount={cartCount} />
      <main className="App__content">
        <Routes>
          <Route path="/" element={<HomePage cart={cart} />} />
          <Route path="/productos" element={<CatalogPage cart={cart} />} />
          <Route path="/productos/:id" element={<ProductDetailPage cart={cart} />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegisterPage />} />

          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/crear-producto"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductFormPage key="crear" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/editar-producto/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductFormPage key="editar" />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
