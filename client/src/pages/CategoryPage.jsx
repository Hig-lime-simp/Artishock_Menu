import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function CategoryPage({ addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Загружаем блюда категории
    fetch(`/api/dishes?categoryId=${id}`)
      .then(res => res.json())
      .then(data => {
        setDishes(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading dishes:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = (dish) => {
    addToCart(dish);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Загрузка...</p>
      </div>
    );
  }

  return (
    <div>
      <header className="cafe-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => navigate('/')}
          >
            ← Назад
          </button>
        </div>
      </header>
      
      <div className="dishes-grid">
        {dishes.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>В этой категории пока нет блюд</p>
        ) : (
          dishes.map(dish => (
            <div key={dish.id} className="dish-card">
              {dish.image ? (
                <img 
                  src={dish.image} 
                  alt={dish.name}
                  className="dish-image"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              ) : (
                <div className="dish-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                  Нет фото
                </div>
              )}
              <div className="dish-info">
                <h3 className="dish-name">{dish.name}</h3>
                {dish.description && (
                  <p className="dish-description">{dish.description}</p>
                )}
                <div className="dish-footer">
                  <span className="dish-price">{dish.price} ₽</span>
                  <button 
                    className="add-btn"
                    onClick={() => handleAddToCart(dish)}
                  >
                    Добавить
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default CategoryPage;
