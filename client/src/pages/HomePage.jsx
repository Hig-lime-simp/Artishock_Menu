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
    return <div className="categories-list"><p>Загрузка...</p></div>;
  }

  return (
    <div className="categories-list">
      {/* Шапка с логотипом и заголовком */}
      <header className="cafe-header">
        <div className="header-content">
          <div className="header-container-label">
            <h2>Меню</h2>
            <h1>Кафе</h1>
          </div>
          <img src={logo} alt="Логотип кафе" className="header-logo" />
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
        <div style={{ marginTop: '20px' }}>
          <Link to="/admin/login" style={{ color: '#4bb060', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Админ-панель
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
