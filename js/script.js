const form = document.getElementById('signupForm');
const message = document.getElementById('message');

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;

  if (name === '' || phone === '') {
    message.textContent = 'Пожалуйста, заполните все поля';
    message.style.color = 'red';
  } else {
    message.textContent = 'Спасибо! Ваша заявка отправлена.';
    message.style.color = 'green';
    form.reset();
  }
});