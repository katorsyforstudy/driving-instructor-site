document.addEventListener("DOMContentLoaded", () => {
  // 🌞/🌑 Переключение светлая/тёмная тема
  // кнопка в header: onclick="document.body.classList.toggle('dark')"
  // CSS-переменные в style.css: :root и .dark


  // ✅ Плавный скроллинг по ссылкам в nav (services / about / contacts)
  document.querySelectorAll("nav a").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });


  // 📩 ФОРМА "Контакты" (заявка /send)
  const contactForm = document.getElementById("signupForm");
  const contactFeedback = document.getElementById("formFeedback");
  const phoneInput = document.getElementById("phone");


  // 🚗 Автоматическое форматирование номера телефона (+998 XX XXX XX XX)
  if (phoneInput) {
    phoneInput.value = "+998 ";

    phoneInput.addEventListener("input", function () {
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

    phoneInput.addEventListener("keydown", function (e) {
      if (
        this.selectionStart <= 5 &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        e.preventDefault();
      }
    });
  }


  // ✅ Валидация номера
  function isValidUzbekPhone(phone) {
    const digits = phone.replace(/\D/g, "");
    return /^\+?998/.test(digits) && digits.length === 12;
  }

  function isValidMessage(msg) {
    return msg.trim().length > 0;
  }


  // ✅ Обработка формы "Контакты" (/send)
  if (contactForm) {
    contactForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const btn = e.target.querySelector("button[type='submit']");
      const originalText = btn.textContent;

      // триггер-прогресс: "⏳ Обработка..."
      btn.textContent = "⏳ Обработка...";
      btn.disabled = true;

      const phone = phoneInput.value;
      const userMessage = document.getElementById("userMessage").value;

      if (!isValidUzbekPhone(phone)) {
        contactFeedback.textContent = "Введите полный номер телефона (+998XXXXXXXXX)";
        contactFeedback.style.color = "red";
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      if (!isValidMessage(userMessage)) {
        contactFeedback.textContent = "Напишите ваш вопрос";
        contactFeedback.style.color = "red";
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      const name = document.getElementById("name").value;

      try {
        const res = await fetch("/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phone, message: userMessage }),
        });

        const data = await res.json();

        if (res.ok) {
          contactFeedback.textContent = "Заявка отправлена!";
          contactFeedback.style.color = "green";
          contactForm.reset();
          if (phoneInput) phoneInput.value = "+998 ";
          btn.textContent = "✓ Отправлено!";
        } else {
          contactFeedback.textContent = data.error || "Ошибка";
          contactFeedback.style.color = "red";
        }
      } catch (error) {
        contactFeedback.textContent = "Ошибка отправки";
        contactFeedback.style.color = "red";
        console.error("Form error", error);
      }

      // через 1.5 секунды вернём текст кнопки
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }


  // 📅 ФОРМА БРОНИРОВАНИЯ занятия (/booking)
  const bookingForm = document.getElementById("bookingForm");
  const bookingFeedback = document.getElementById("bookingFeedback");

  if (bookingForm) {
    const phoneBookingInput = document.getElementById("phoneBooking");

    if (phoneBookingInput) {
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

      const btn = e.target.querySelector("button[type='submit']");
      const originalText = btn.textContent;

      // триггер-прогресс: "⏳ Обработка..."
      btn.textContent = "⏳ Обработка...";
      btn.disabled = true;

      const name = document.getElementById("nameBooking").value.trim();
      const phone = document.getElementById("phoneBooking").value.trim();
      const date = document.getElementById("bookingDate").value;
      const time = document.getElementById("bookingTime").value;

      if (!name || !date || !time) {
        bookingFeedback.textContent = "Заполните все поля";
        bookingFeedback.style.color = "red";
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      if (!phone) {
        bookingFeedback.textContent = "Введите номер телефона";
        bookingFeedback.style.color = "red";
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      const phoneDigits = phone.replace(/\D/g, "");
      if (!(/^\+?998/.test(phoneDigits) && phoneDigits.length === 12)) {
        bookingFeedback.textContent =
          "Введите полный номер телефона (+998XXXXXXXXX)";
        bookingFeedback.style.color = "red";
        btn.disabled = false;
        btn.textContent = originalText;
        return;
      }

      const bookingData = { name, phone, date, time };

      try {
        const res = await fetch("/booking", {
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
          if (phoneBookingInput) phoneBookingInput.value = "+998 ";
          btn.textContent = "✓ Забронировано!";
        } else {
          bookingFeedback.textContent = data.error || "Ошибка";
          bookingFeedback.style.color = "red";
        }
      } catch (error) {
        bookingFeedback.textContent = "Не удалось подключиться к серверу";
        bookingFeedback.style.color = "red";
        console.error("Booking error", error);
      }

      // через 1.5 секунды вернём текст кнопки
      setTimeout(() => {
        btn.textContent = originalText;
        btn.disabled = false;
      }, 1500);
    });
  }
});