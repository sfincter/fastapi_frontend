import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({ role: '', name: '', email: '' });
  const [responseMessage, setResponseMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    setupWebSocket();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://fastapi-lovat-pi.vercel.app/specialists');
      setData(response.data);
    } catch (err) {
      setError('Ошибка при загрузке данных');
    }
  };

  const setupWebSocket = () => {
    const socket = new WebSocket('https://fastapi-lovat-pi.vercel.app/ws');
    socket.onmessage = (event) => {
      const updatedData = JSON.parse(event.data);
      setData(updatedData);
    };
  };

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://fastapi-lovat-pi.vercel.app/specialists', user);
      setResponseMessage(response.data.message);
    } catch (err) {
      setError('Ошибка при добавлении специалиста');
    }
  };

  return (
    <div className="App">
      <h1>React + FastAPI WebSockets</h1>
      
      {error && <p>{error}</p>}
      {responseMessage && <p>{responseMessage}</p>}

      <form onSubmit={handleSubmit}>
        <h2>Добавить специалиста</h2>
        <label>
          Role:
          <input type="text" name="role" value={user.role} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Name:
          <input type="text" name="name" value={user.name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={user.email} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Добавить специалиста</button>
      </form>

      <h2>Список специалистов:</h2>
      <table border="1" style={{ marginTop: '20px', width: '100%' }}>
        <thead>
          <tr>
            <th>Роль</th>
            <th>Имя</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data.map((specialist) => (
            <tr key={specialist.id}>
              <td>{specialist.role}</td>
              <td>{specialist.name}</td>
              <td>{specialist.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;