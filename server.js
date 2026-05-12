const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");


const app = express();


app.use(cors());
app.use(express.json());


// 📦 Храним брони — при старте читаем из файла
const BOOKINGS_FILE = path.join(__dirname, "bookings.json");

let bookings = [];

try {
  const data = fs.readFileSync(BOOKINGS_FILE, "utf8");
  bookings = JSON.parse(data);
} catch (e) {
  console.log("Файл броней не найден или пуст; начнём с пустого массива.");
}


// 🔐 Настройка Gmail
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,        // если tls / starttls
  requireTLS: true,     // обязательно включить
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
  const newBooking = { id, name, phone, date, time };

  bookings.push(newBooking);

  // сохраняем в файл
  fs.writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2));

  res.json({ success: true, id });
});


// 📋 Получение броней (для админа)
app.get("/bookings", (req, res) => {
  res.json(bookings);
});


// 🏠 Сервируем статику
app.use(express.static(path.join(__dirname, ".")));


// порт для Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server started: http://localhost:${PORT}`);
});