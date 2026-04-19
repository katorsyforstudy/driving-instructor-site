// admin.js
document.addEventListener("DOMContentLoaded", async () => {
  const bookingsList = document.getElementById("bookingsList");

  try {
    const res = await fetch("http://localhost:3000/bookings");
    const bookings = await res.json();

    if (Array.isArray(bookings) && bookings.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Пока нет броней";
      li.style.fontStyle = "italic";
      bookingsList.appendChild(li);
      return;
    }

    bookings.forEach((b) => {
      const li = document.createElement("li");
      li.textContent = `${b.name} • ${b.phone} • ${b.date} ${b.time}`;
      bookingsList.appendChild(li);
    });
  } catch (error) {
    console.error("Ошибка загрузки броней:", error);
    const li = document.createElement("li");
    li.textContent = "Ошибка загрузки броней";
    li.style.color = "red";
    bookingsList.appendChild(li);
  }
});