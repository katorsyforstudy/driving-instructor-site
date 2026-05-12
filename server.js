const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

// Resend для отправки писем
const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

// 📦 Храним брони и заявки в файлах

const BOOKINGS_FILE = path.join(__dirname, "bookings.json");
const ENQUIRIES_FILE = path.join(__dirname, "enquiries.json");

let bookings = [];
let enquiries = [];

// загружаем брони
try {
  const data = fs.readFileSync(BOOKINGS_FILE, "utf8");
  bookings = JSON.parse(data);
} catch (e) {
  console.log("Файл броней не найден, стартуем с пустого массива.");
}

// загружаем заявки (необязательно, можно не писать в файл)
try {
  const data = fs.readFileSync(ENQUIRIES_FILE, "utf8");
  enquiries = JSON.parse(data);
} catch (e) {
  console.log("Файл заявок не найден, стартуем с пустого массива.");
}

// ----------------------------------------
// ✉️ Отправка заявки формы "Контакты"
// ----------------------------------------

app.post("/send", async (req, res) => {
  console.log("Пришла заявка:", req.body);

  const { name, phone, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: "Заполните все поля" });
  }

  // добавляем в массив (для себя, можно не писать в файл)
  const newEnquiry = {
    id: Date.now().toString(),
    name,
    phone,
    message,
    timestamp: new Date().toISOString(),
  };

  enquiries.push(newEnquiry);

  // (опционально) можно сохранить в файл
  // fs.writeFileSync(ENQUIRIES_FILE, JSON.stringify(enquiries, null, 2));

  // отправляем письмо через Resend
  try {
    const data = await resend.emails.send({
      from: 'yourbestinstructor@gmail.com',          // твой email
      to: 'yourbestinstructor@gmail.com',             // куда приходят заявки
      subject: 'Новая заявка с сайта 🚗',
      text: `
Имя: ${name}
Телефон: ${phone}
Сообщение: ${message}
      `,
    });

    console.log("Письмо отправлено через Resend:", data);

    res.json({ success: true });
  } catch (error) {
    console.error("Ошибка Resend:", error);
    // даже если письмо не ушло, клиенту можем вернуть успех, чтобы форма не сломалась
    res.status(200).json({ success: true });
  }
});


// ----------------------------------------
// 📅 Бронирование занятия
// ----------------------------------------

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


// ----------------------------------------
// 📋 Получение броней (для админа)
// ----------------------------------------

app.get("/bookings", (req, res) => {
  res.json(bookings);
});


// ----------------------------------------
// 🏠 Сервируем статику
// ----------------------------------------

app.use(express.static(path.join(__dirname, ".")));

// порт для Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server started: http://localhost:${PORT}`);
});