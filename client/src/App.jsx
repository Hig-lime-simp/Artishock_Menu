import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CartButton from './components/CartButton';

function App() {
  const [cart, setCart] = useState([]);

  // Загрузка корзины из localStorage при старте
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === dish.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...dish, quantity: 1 }];
    });
  };

  const updateQuantity = (dishId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === dishId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (dishId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== dishId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:id" element={<CategoryPage addToCart={addToCart} />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      
      {/* Показываем кнопку корзины только на публичных страницах */}
      <CartButton 
        cart={cart} 
        total={cartTotal} 
        count={cartCount}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </BrowserRouter>
  );
}

export default App;
