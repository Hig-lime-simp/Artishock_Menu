import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('adminToken', data.token);
        navigate('/admin');
      } else {
        setError('Неверный логин или пароль');
      }
    })
    .catch(err => {
      setError('Ошибка подключения к серверу');
    });
  };

  return (
    <div className="login-form">
      <h2>Вход для администратора</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Логин</label>
          <input 
            type="text" 
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Пароль</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: '#e74c3c', marginBottom: '16px' }}>{error}</p>}
        <button type="submit" className="submit-btn">Войти</button>
      </form>
    </div>
  );
}

export default AdminLogin;
