// script.js
document.addEventListener("DOMContentLoaded", () => {
  // 📩 Форма "Контакты" (заявка)
  const contactForm = document.getElementById("signupForm");
  const contactFeedback = document.getElementById("formFeedback");
  const phoneInput = document.getElementById("phone");

  // 🚗 Проверка и форматирование номера телефона
  if (phoneInput) {
    // Сразу вставляем код страны
    phoneInput.value = "+998 ";

    phoneInput.addEventListener("input", function () {
      let numbers = this.value.replace(/\D/g, "");

      // Убираем 998, если пользователь пытается его ввести
      if (numbers.startsWith("998")) {
        numbers = numbers.slice(3);
      }

      // Ограничиваем до 9 цифр
      numbers = numbers.substring(0, 9);

      let formatted = "+998 ";

      if (numbers.length > 0) formatted += numbers.substring(0, 2);
      if (numbers.length >= 3) formatted += " " + numbers.substring(2, 5);
      if (numbers.length >= 6) formatted += " " + numbers.substring(5, 7);
      if (numbers.length >= 8) formatted += " " + numbers.substring(7, 9);

      this.value = formatted;
    });

    // Запрещаем удалять +998
    phoneInput.addEventListener("keydown", function (e) {
      if (this.selectionStart <= 5 && (e.key === "Backspace" || e.key === "Delete")) {
        e.preventDefault();
      }
    });
  }

  // 📞 Общая функция валидации узбекского номера
  function isValidUzbekPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return /^\+?998/.test(digits) && digits.length === 12;
  }

  // ✍️ Проверка, чтобы сообщение было не пустым
  function isValidMessage(msg) {
    return msg.trim().length > 0;
  }

  // ✅ Обработка формы "Контакты"
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const phone = phoneInput.value;
      const userMessage = document.getElementById("userMessage").value;

      if (!isValidUzbekPhone(phone)) {
        contactFeedback.textContent = "Введите полный номер телефона (+998XXXXXXXXX)";
        contactFeedback.style.color = "red";
        return;
      }

      if (!isValidMessage(userMessage)) {
        contactFeedback.textContent = "Напишите ваш вопрос";
        contactFeedback.style.color = "red";
        return;
      }

      fetch("http://localhost:3000/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: document.getElementById("name").value,
          phone: phone,
          message: userMessage,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          contactFeedback.textContent = "Заявка отправлена!";
          contactFeedback.style.color = "green";
          contactForm.reset();
          if (phoneInput) {
            phoneInput.value = "+998 ";
          }
        })
        .catch(() => {
          contactFeedback.textContent = "Ошибка отправки";
          contactFeedback.style.color = "red";
        });
    });
  }

  // 📅 Форма бронирования занятия
  const bookingForm = document.getElementById("bookingForm");
  const bookingFeedback = document.getElementById("bookingFeedback");

  if (bookingForm) {
    // Форматирование телефона для бронирования
    const phoneBookingInput = document.getElementById("phoneBooking");

    if (phoneBookingInput) {
      // Устанавливаем начальный формат
      phoneBookingInput.value = "+998 ";

      phoneBookingInput.addEventListener("input", function () {
        let numbers = this.value.replace(/\D/g, "");

        if (numbers.startsWith("998")) {
          numbers = numbers.slice(3);
        }

        numbers = numbers.substring(0, 9);

        let formatted = "+998 ";

        if (numbers.length > 0) formatted += numbers.substring(0, 2);
        if (numbers.length >= 3) formatted += " " + numbers.substring(2, 5);
        if (numbers.length >= 6) formatted += " " + numbers.substring(5, 7);
        if (numbers.length >= 8) formatted += " " + numbers.substring(7, 9);

        this.value = formatted;
      });

      // Запрещаем удалять +998
      phoneBookingInput.addEventListener("keydown", function (e) {
        if (
          this.selectionStart <= 5 &&
          (e.key === "Backspace" || e.key === "Delete")
        ) {
          e.preventDefault();
        }
      });
    }

    bookingForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const name = document.getElementById("nameBooking").value.trim();
      const phone = document.getElementById("phoneBooking").value.trim();
      const date = document.getElementById("bookingDate").value;
      const time = document.getElementById("bookingTime").value;

      // Проверка обязательных полей
      if (!name || !date || !time) {
        bookingFeedback.textContent = "Заполните все поля";
        bookingFeedback.style.color = "red";
        return;
      }

      // ВАЛИДАЦИЯ НОМЕРА ТЕЛЕФОНА — как в регистрации
      if (!phone) {
        bookingFeedback.textContent = "Введите номер телефона";
        bookingFeedback.style.color = "red";
        return;
      }

      const phoneDigits = phone.replace(/\D/g, "");
      if (!(/^\+?998/.test(phoneDigits) && phoneDigits.length === 12)) {
        bookingFeedback.textContent =
          "Введите полный номер телефона (+998XXXXXXXXX)";
        bookingFeedback.style.color = "red";
        return;
      }

      const bookingData = { name, phone, date, time };

      try {
        const res = await fetch("http://localhost:3000/booking", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        const data = await res.json();

        if (res.ok) {
          bookingFeedback.textContent = "Занятие забронировано!";
          bookingFeedback.style.color = "green";
          bookingForm.reset();
          if (phoneBookingInput) {
            phoneBookingInput.value = "+998 ";
          }
        } else {
          bookingFeedback.textContent = data.error || "Ошибка";
          bookingFeedback.style.color = "red";
        }
      } catch (error) {
        bookingFeedback.textContent = "Не удалось подключиться к серверу";
        bookingFeedback.style.color = "red";
        console.error("Ошибка запроса:", error);
      }
    });
  }
});