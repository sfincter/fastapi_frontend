import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Input, notification, Select, Skeleton } from 'antd';
import { UserOutlined, ContactsOutlined } from '@ant-design/icons';
import axios from 'axios';

function App() {
  const [data, setData] = useState([]); // Данные о специалистах
  const [user, setUser] = useState({ role: '', name: '', email: '' }); // Данные нового специалиста
  const [responseMessage, setResponseMessage] = useState(''); // Сообщение от сервера
  const [error, setError] = useState(null); // Ошибки
  const [loading, setLoading] = useState(false); // Состояние загрузки

  // Функция загрузки специалистов
  const fetchData = async () => {
    setLoading(true); // Показываем Skeleton
    try {
      const response = await axios.get('https://fastapi-lovat-pi.vercel.app/specialists');
      setData(response.data);
    } catch (err) {
      setError('Ошибка при получении данных');
    } finally {
      setLoading(false); // Отключаем Skeleton
    }
  };

  useEffect(() => {
    fetchData(); // Загружаем данные при старте
  }, []);

  // Обработчик изменения данных в форме
  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Функция для отправки данных на сервер
  const handleSubmit = async (values) => {
    try {
      const response = await axios.post('https://fastapi-lovat-pi.vercel.app/specialists', values);
      setResponseMessage(response.data.message);
      notification.success({
        message: 'Успех',
        description: response.data.message,
      });
      fetchData(); // Обновить список специалистов
    } catch (err) {
      setError('Ошибка при добавлении специалиста, домен почты должен заканчиваться на @dbtplus.ru');
      notification.error({
        message: 'Ошибка',
        description: 'Ошибка при добавлении специалиста, домен почты должен заканчиваться на @dbtplus.ru',
      });
    }
  };

  const columns = [
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  return (
    <div className="App" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>React App with FastAPI</h1>

      <Button type="primary" onClick={fetchData} style={{ marginBottom: '20px' }}>
        Показать всех специалистов
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Форма добавления нового специалиста */}
      <Form onFinish={handleSubmit} style={{ marginBottom: '20px' }}>
        <h2>Добавить специалиста</h2>

        <Form.Item label="Роль" name="role" rules={[{ required: true, message: 'Пожалуйста, введите роль' }]}>
          {loading ? (
            <Skeleton.Input active block />
          ) : (
            <Select
              placeholder="Выберите роль специалиста"
              options={[
                { value: 'Психолог', label: 'Психолог' },
                { value: 'Психотерапевт', label: 'Психотерапевт' },
                { value: 'Доктор медицинских наук', label: 'Доктор медицинских наук' },
                { value: 'Доцент', label: 'Доцент' },
                { value: 'Врач-психотерапевт', label: 'Врач-психотерапевт' },
              ]}
            />
          )}
        </Form.Item>

        <Form.Item label="Имя" name="name" rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}>
          {loading ? (
            <Skeleton.Input active block />
          ) : (
            <Input name="name" onChange={handleInputChange} placeholder="Введите имя" prefix={<UserOutlined />} />
          )}
        </Form.Item>

        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Пожалуйста, введите email' }]}>
          {loading ? (
            <Skeleton.Input active block />
          ) : (
            <Input name="email" onChange={handleInputChange} placeholder="Введите email" prefix={<ContactsOutlined />} />
          )}
        </Form.Item>

        <Button type="primary" htmlType="submit" disabled={loading}>
          Добавить специалиста
        </Button>
      </Form>

      {/* Таблица с данными специалистов */}
      <h2>Список специалистов</h2>
      {loading ? (
        <Skeleton active />
      ) : (
        <Table dataSource={data} columns={columns} rowKey="id" pagination={false} />
      )}
    </div>
  );
}

export default App;