import { useState, useEffect } from 'react';

function CartButton({ cart, total, count, updateQuantity, removeFromCart, clearCart }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCheckout = () => {
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart.map(item => ({ dishId: item.id, quantity: item.quantity })),
        totalAmount: total
      })
    })
    .then(res => res.json())
    .then(data => {
      alert('Заказ оформлен! Номер заказа: ' + data.id);
      clearCart();
      setIsModalOpen(false);
    })
    .catch(err => {
      console.error('Error placing order:', err);
      alert('Ошибка при оформлении заказа');
    });
  };

  // Не показываем кнопку на странице админки
  if (window.location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div 
        className="cart-button"
        onClick={() => setIsModalOpen(true)}
      >
        <span className="cart-count">{count}</span>
        <span className="cart-total">{total} ₽</span>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Мой заказ</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>Корзина пуста</p>
              </div>
            ) : (
              <>
                <div>
                  {cart.map(item => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-price">{item.price} ₽</div>
                      </div>
                      <div className="quantity-controls">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button 
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="cart-summary">
                  <div className="cart-total-row">
                    <span>Итого:</span>
                    <span>{total} ₽</span>
                  </div>
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Оформить заказ
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default CartButton;
