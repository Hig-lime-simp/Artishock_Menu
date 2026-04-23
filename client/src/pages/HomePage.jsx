import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
      <h1 style={{ padding: '16px', fontSize: '24px' }}>Меню Кафе</h1>
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
      <div style={{ padding: '16px', marginTop: '20px' }}>
        <Link to="/admin/login" style={{ color: '#3498db', textDecoration: 'none', fontSize: '14px' }}>
          Админ-панель
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
