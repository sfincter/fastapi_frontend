import React, { useState } from 'react';
import axios from 'axios';
import { Button, Table, Form, Input, notification, Select } from 'antd';  // Импортируем компоненты из Ant Design
import { UserOutlined, ContactsOutlined } from '@ant-design/icons';

function App() {
  const [data, setData] = useState([]);  // Данные о специалистах
  const [user, setUser] = useState({ role: '', name: '', email: '' });  // Данные нового специалиста
  const [responseMessage, setResponseMessage] = useState('');  // Сообщение от сервера
  const [error, setError] = useState(null);  // Ошибки

  // Функция для загрузки данных специалистов
  const fetchData = async () => {
    try {
      const response = await axios.get('https://fastapi-lovat-pi.vercel.app/specialists');
      setData(response.data);
    } catch (err) {
      setError('Ошибка при получении данных');
    }
  };

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
      fetchData();  // Обновить список специалистов
    } catch (err) {
      setError('Ошибка при добавлении специалиста');
      notification.error({
        message: 'Ошибка',
        description: 'Ошибка при добавлении специалиста',
      });
    }
  };

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };

  const columns = [
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
  ];

  return (
    <div className="App">
      <h1>React App with FastAPI</h1>

      <Button type="primary" onClick={fetchData} style={{ marginBottom: '20px' }}>
        Показать всех специалистов
      </Button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {responseMessage && <p>{responseMessage}</p>}

      {/* Форма добавления нового специалиста */}
      <Form onFinish={handleSubmit} style={{ marginBottom: '20px' }}>
        <h2>Добавить специалиста</h2>
        <Form.Item
          label="Роль"
          name="role"
          rules={[{ required: true, message: 'Пожалуйста, введите роль' }]}
        >
          <Select
            showSearch
            placeholder="Select a person"
            optionFilterProp="label"
            onChange={onChange}
            onSearch={onSearch}
            options={[
              {
                value: 'jack',
                label: 'Jack',
              },
              {
                value: 'lucy',
                label: 'Lucy',
              },
              {
                value: 'tom',
                label: 'Tom',
              },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Имя"
          name="name"
          rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
        >
          <Input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
            size="large" 
            placeholder="Введите имя" 
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Пожалуйста, введите email' }]}
        >
          <Input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
            size="large" 
            placeholder="Введите емаил" 
            prefix={<ContactsOutlined />}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit">Добавить специалиста</Button>
      </Form>

      {/* Таблица с данными специалистов */}
      <h2>Список специалистов</h2>
      <Table 
        dataSource={data} 
        columns={columns} 
        rowKey="id" 
        pagination={false} 
      />
    </div>
  );
}

export default App;