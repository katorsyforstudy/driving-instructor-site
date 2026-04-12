document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signupForm');
  const message = document.getElementById('formFeedback');
  const phoneInput = document.getElementById('phone');

  // Сразу вставляем код страны
  phoneInput.value = "+998 ";

  phoneInput.addEventListener('input', function () {
    let numbers = this.value.replace(/\D/g, '');

    // убираем 998 если пользователь пытается его ввести
    if (numbers.startsWith("998")) {
      numbers = numbers.slice(3);
    }

    // ограничиваем до 9 цифр
    numbers = numbers.substring(0, 9);

    let formatted = "+998 ";

    if (numbers.length > 0) formatted += numbers.substring(0, 2);
    if (numbers.length >= 3) formatted += " " + numbers.substring(2, 5);
    if (numbers.length >= 6) formatted += " " + numbers.substring(5, 7);
    if (numbers.length >= 8) formatted += " " + numbers.substring(7, 9);

    this.value = formatted;
  });

  // запрещаем удалять +998
  phoneInput.addEventListener('keydown', function(e) {
    if (this.selectionStart <= 5 && (e.key === "Backspace" || e.key === "Delete")) {
      e.preventDefault();
    }
  });

  // проверка номера
  function isValidUzbekPhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 12; // 998 + 9 цифр
  }

  // проверка сообщения
  function isValidMessage(msg) {
    return msg.trim().length > 0;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const phone = phoneInput.value;
    const userMessage = document.getElementById('userMessage').value;

    if (!isValidUzbekPhone(phone)) {
      message.textContent = "Введите полный номер телефона";
      message.style.color = "red";
      return;
    }

    if (!isValidMessage(userMessage)) {
      message.textContent = "Напишите ваш вопрос";
      message.style.color = "red";
      return;
    }

    fetch('http://localhost:3000/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: document.getElementById('name').value,
    phone: phoneInput.value,
    message: userMessage
  })
})
.then(res => res.json())
.then(data => {
  message.textContent = "Заявка отправлена!";
  message.style.color = "green";

  form.reset();
  phoneInput.value = "+998 ";
})
.catch(() => {
  message.textContent = "Ошибка отправки";
  message.style.color = "red";
});
  });
});