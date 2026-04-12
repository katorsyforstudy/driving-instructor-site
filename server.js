const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// 🔐 НАСТРОЙКА ПОЧТЫ
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'yourbestinstructor@gmail.com',        // ← твоя почта
    pass: 'gmwm nokg vunb alav'         // ← пароль приложения
  }
});

// 📩 API отправки заявки
app.post('/send', async (req, res) => {
  const { name, phone, message } = req.body;

  // простая защита
  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Заполните все поля' });
  }

  try {
    await transporter.sendMail({
      from: 'yourmail@gmail.com',
      to: 'yourmail@gmail.com',
      subject: 'Новая заявка с сайта 🚗',
      text: `
Имя: ${name}
Телефон: ${phone}
Сообщение: ${message}
      `
    });

    res.json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка отправки' });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server started: http://localhost:3000');
});