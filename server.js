// server.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// 📦 Храним брони в памяти
const bookings = [];

// 🔐 Настройка Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourbestinstructor@gmail.com",
    pass: "gmvm nokg vunb alav", // твой пароль приложения
  },
});

// 📩 Отправка заявки
app.post("/send", async (req, res) => {
  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: "Заполните все поля" });
  }

  try {
    await transporter.sendMail({
      from: "yourbestinstructor@gmail.com",
      to: "yourbestinstructor@gmail.com",
      subject: "Новая заявка с сайта 🚗",
      text: `
Имя: ${name}
Телефон: ${phone}
Сообщение: ${message}
      `,
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ошибка отправки" });
  }
});

// 📅 Бронирование занятия
app.post("/booking", (req, res) => {
  const { name, phone, date, time } = req.body;

  if (!name || !phone || !date || !time) {
    return res.status(400).json({ error: "Заполните все поля" });
  }

  const id = Date.now().toString();
  bookings.push({ id, name, phone, date, time });

  res.json({ success: true, id });
});

// 📋 Получение броней (для админа)
app.get("/bookings", (req, res) => {
  res.json(bookings);
});

// 🏠 Сервируем статику
app.use(express.static(path.join(__dirname, ".")));

app.listen(3000, () => {
  console.log("🚀 Server started: http://localhost:3000");
});