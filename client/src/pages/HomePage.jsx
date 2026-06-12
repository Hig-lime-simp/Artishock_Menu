import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

function HomePage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading categories:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <p className="loading-text">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="categories-list">
      {/* Шапка с логотипом и заголовком */}
      <header className="cafe-header">
        <div className="header-content">
          <h1>
            <span className="menu-text">Меню</span>
            <span className="cafe-text">Кафе</span>
          </h1>
          <Link to="/admin/login" style={{ textDecoration: 'none' }}>
            <img src={logo} alt="Логотип кафе" className="header-logo" />
          </Link>
        </div>
      </header>
      
      <div className="categories-content">
        {categories.map(category => (
          <Link 
            key={category.id} 
            to={`/category/${category.id}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div className="category-item">
              <h2>{category.name}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
