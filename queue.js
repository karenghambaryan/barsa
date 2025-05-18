// Инициализируем массивы для очереди и допустимых игроков
let queue = [];
let allowedPlayers = [];

// Создаём объект XMLHttpRequest для загрузки players.json
const xhr = new XMLHttpRequest();
xhr.open("GET", "players.json", true); // Асинхронный GET-запрос

// Обработка успешной загрузки файла
xhr.onload = function () {
  if (xhr.status === 200) { // Если статус OK
    try {
      allowedPlayers = JSON.parse(xhr.responseText); // Парсим JSON в массив
    } catch (e) {
      console.error("JSON parsing error", e); // Если JSON невалиден
    }
  } else {
    console.error("Error loading players.json:", xhr.status); // Ошибка запроса
  }
};

// Обработка ошибок сети
xhr.onerror = function () {
  console.error("Connection error loading players.json");
};

// Отправка запроса
xhr.send();

// Функция добавления игрока в очередь
function enqueuePlayer() {
  const input = document.getElementById("playerInput"); // Получаем поле ввода
  const name = input.value.trim(); // Убираем пробелы по краям

  const validName = /^[A-Za-zА-Яа-яЁё\s]+$/; // Регулярное выражение: только буквы и пробелы

  if (!name) return; // Пустой ввод — ничего не делаем

  if (!validName.test(name)) { // Проверка допустимых символов
    alert("Player name must contain only letters!");
    return;
  }

  const nameLower = name.toLowerCase(); // Имя в нижнем регистре для сравнения
  const allowedLower = allowedPlayers.map(p => p.toLowerCase()); // Допустимые имена (нижний регистр)
  const queueLower = queue.map(p => p.toLowerCase()); // Игроки в очереди (нижний регистр)

  if (!allowedLower.includes(nameLower)) { // Если игрока нет в списке
    alert("There is no such player on the FC Barcelona list!");
    return;
  }

  if (queueLower.includes(nameLower)) { // Если игрок уже в очереди
    alert("There is already such a player in the queue!");
    return;
  }

  // Находим оригинальное имя (с правильным регистром) и добавляем в очередь
  const originalName = allowedPlayers.find(p => p.toLowerCase() === nameLower);
  queue.push(originalName);
  input.value = ""; // Очищаем поле ввода
  renderQueue(); // Перерисовываем очередь
}

// Функция удаления первого игрока из очереди
function dequeuePlayer() {
  if (queue.length > 0) {
    queue.shift(); // Удаляем первого
    renderQueue(); // Обновляем список
  } else {
    alert("The queue is empty!"); // Очередь уже пуста
  }
}

// Функция отображения очереди
function renderQueue() {
  const list = document.getElementById("queueList"); // Список на странице
  list.innerHTML = ""; // Очищаем старый список

  queue.forEach((player, index) => {
    const li = document.createElement("li"); // Создаём элемент списка
    li.textContent = `${index + 1}. ${player}`; // Пронумеровываем
    list.appendChild(li); // Добавляем в DOM
  });
}

// Позволяет нажимать Enter для добавления игрока
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("playerInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      enqueuePlayer(); // Если нажата клавиша Enter — добавляем игрока
    }
  });
});
