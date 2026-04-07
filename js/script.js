const form = document.getElementById('signupForm');
const message = document.getElementById('message');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  message.textContent = "Заявка отправлена!";
});