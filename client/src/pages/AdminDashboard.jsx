import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showDishForm, setShowDishForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingDish, setEditingDish] = useState(null);
  const navigate = useNavigate();

  // Формы
  const [categoryName, setCategoryName] = useState('');
  const [dishData, setDishData] = useState({
    name: '',
    price: '',
    description: '',
    categoryId: '',
    image: null
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data));

    fetch('/api/dishes')
      .then(res => res.json())
      .then(data => setDishes(data));

    setIsAuthenticated(true);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Категории
  const handleCreateCategory = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    fetch('/api/categories', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    })
    .then(res => res.json())
    .then(data => {
      setCategories([...categories, data]);
      setCategoryName('');
      setShowCategoryForm(false);
    });
  };

  const handleUpdateCategory = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    fetch(`/api/categories/${editingCategory.id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ name: categoryName })
    })
    .then(res => res.json())
    .then(data => {
      setCategories(categories.map(c => c.id === editingCategory.id ? data : c));
      setCategoryName('');
      setEditingCategory(null);
      setShowCategoryForm(false);
    });
  };

  const handleDeleteCategory = (id) => {
    if (!confirm('Удалить категорию?')) return;
    const token = localStorage.getItem('adminToken');
    
    fetch(`/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      setCategories(categories.filter(c => c.id !== id));
    });
  };

  const startEditCategory = (category) => {
    setCategoryName(category.name);
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  // Блюда
  const handleCreateDish = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('name', dishData.name);
    formData.append('price', dishData.price);
    formData.append('description', dishData.description);
    formData.append('categoryId', dishData.categoryId);
    if (dishData.image) {
      formData.append('image', dishData.image);
    }

    fetch('/api/dishes', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      setDishes([...dishes, data]);
      resetDishForm();
      setShowDishForm(false);
    });
  };

  const handleUpdateDish = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    
    const formData = new FormData();
    formData.append('name', dishData.name);
    formData.append('price', dishData.price);
    formData.append('description', dishData.description);
    formData.append('categoryId', dishData.categoryId);
    if (dishData.image) {
      formData.append('image', dishData.image);
    }

    fetch(`/api/dishes/${editingDish.id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      setDishes(dishes.map(d => d.id === editingDish.id ? data : d));
      resetDishForm();
      setEditingDish(null);
      setShowDishForm(false);
    });
  };

  const handleDeleteDish = (id) => {
    if (!confirm('Удалить блюдо?')) return;
    const token = localStorage.getItem('adminToken');
    
    fetch(`/api/dishes/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(() => {
      setDishes(dishes.filter(d => d.id !== id));
    });
  };

  const startEditDish = (dish) => {
    setDishData({
      name: dish.name,
      price: dish.price,
      description: dish.description || '',
      categoryId: dish.categoryId,
      image: null
    });
    setEditingDish(dish);
    setShowDishForm(true);
  };

  const resetDishForm = () => {
    setDishData({
      name: '',
      price: '',
      description: '',
      categoryId: '',
      image: null
    });
  };

  if (!isAuthenticated) {
    return <div className="admin-container"><p>Загрузка...</p></div>;
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Админ-панель</h1>
        <button className="logout-btn" onClick={handleLogout}>Выйти</button>
      </div>

      {/* Категории */}
      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Категории</h2>
          <button 
            className="add-btn"
            onClick={() => {
              setEditingCategory(null);
              setCategoryName('');
              setShowCategoryForm(!showCategoryForm);
            }}
          >
            {showCategoryForm ? 'Отмена' : '+ Добавить'}
          </button>
        </div>

        {showCategoryForm && (
          <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label>Название категории</label>
              <input 
                type="text" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="submit-btn">
              {editingCategory ? 'Сохранить' : 'Создать'}
            </button>
          </form>
        )}

        <ul className="admin-list">
          {categories.map(category => (
            <li key={category.id} className="admin-list-item">
              <span>{category.name}</span>
              <div className="admin-actions">
                <button className="edit-btn" onClick={() => startEditCategory(category)}>Ред.</button>
                <button className="delete-btn" onClick={() => handleDeleteCategory(category.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Блюда */}
      <div className="admin-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2>Блюда</h2>
          <button 
            className="add-btn"
            onClick={() => {
              setEditingDish(null);
              resetDishForm();
              setShowDishForm(!showDishForm);
            }}
          >
            {showDishForm ? 'Отмена' : '+ Добавить'}
          </button>
        </div>

        {showDishForm && (
          <form onSubmit={editingDish ? handleUpdateDish : handleCreateDish} style={{ marginBottom: '16px' }}>
            <div className="form-group">
              <label>Название блюда</label>
              <input 
                type="text" 
                value={dishData.name}
                onChange={(e) => setDishData({...dishData, name: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Цена (₽)</label>
              <input 
                type="number" 
                value={dishData.price}
                onChange={(e) => setDishData({...dishData, price: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <textarea 
                value={dishData.description}
                onChange={(e) => setDishData({...dishData, description: e.target.value})}
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Категория</label>
              <select 
                value={dishData.categoryId}
                onChange={(e) => setDishData({...dishData, categoryId: e.target.value})}
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Фото</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={(e) => setDishData({...dishData, image: e.target.files[0]})}
              />
            </div>
            <button type="submit" className="submit-btn">
              {editingDish ? 'Сохранить' : 'Создать'}
            </button>
          </form>
        )}

        <ul className="admin-list">
          {dishes.map(dish => (
            <li key={dish.id} className="admin-list-item">
              <span>{dish.name} ({dish.price} ₽)</span>
              <div className="admin-actions">
                <button className="edit-btn" onClick={() => startEditDish(dish)}>Ред.</button>
                <button className="delete-btn" onClick={() => handleDeleteDish(dish.id)}>Удалить</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;
