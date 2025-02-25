import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [message, setMessage] = useState('');

  // Функция для получения данных через Long Polling
  const fetchData = async () => {
    const response = await fetch('https://fastapi-lovat-pi.vercel.app/long-poll');
    const result = await response.json();
    setData(result.specialists); // Обновляем данные
  };

  // Эффект для периодической отправки запроса
  useEffect(() => {
    // Инициализируем начальную загрузку
    fetchData();

    const interval = setInterval(fetchData, 10000); // Запрашиваем данные каждые 10 секунд

    return () => clearInterval(interval); // Очищаем интервал при размонтировании
  }, []);

  // Функция для добавления нового специалиста
  const addSpecialist = async () => {
    await fetch('https://fastapi-lovat-pi.vercel.app/specialists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Петр', role: 'Психолог' })
    });
    setMessage('Специалист добавлен!');
  };

  return (
    <div>
      <h1>Specialists</h1>
      <ul>
        {data.map((specialist) => (
          <li key={specialist.id}>{specialist.name} - {specialist.role}</li>
        ))}
      </ul>
      <button onClick={addSpecialist}>Добавить специалиста</button>
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;