import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const eventSource = new EventSource('https://fastapi-lovat-pi.vercel.app/events');

    eventSource.onmessage = function (event) {
      setData(JSON.parse(event.data)); // Обновляем данные при получении события
    };

    eventSource.onerror = function (error) {
      console.error("Ошибка SSE:", error);
      setError('Ошибка при получении данных');
    };

    return () => {
      eventSource.close(); // Закрываем соединение при размонтировании компонента
    };
  }, []);

  return (
    <div className="App">
      <h1>Specialists</h1>
      {error && <p>{error}</p>}
      <ul>
        {data.map((specialist) => (
          <li key={specialist.id}>{specialist.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;