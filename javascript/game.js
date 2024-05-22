const gamesTable = document.getElementById("gamesTable");
const sortOptions = document.getElementById("sortOptions");
const addGameBtn = document.getElementById("addGameBtn");
const addGameModal = document.getElementById("addGameModal");
const addGameForm = document.getElementById("addGameForm");

let gameData = []; // Массив для хранения данных об играх

// Функция для отображения данных об играх в таблице
function renderGames(games) {
  gamesTable.querySelector("tbody").innerHTML = ""; // Очистка тела таблицы

  games.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${game.date}</td>
          <td>${game.players.join(", ")}</td>
          <td>${game.winner === "Mafia" ? "Мафия" : "Граждане"}</td>
          <td>${game.type}</td>
          <td>${game.duration} минут</td>
        `;
    gamesTable.querySelector("tbody").appendChild(row);
  });
}

// Загрузка данных об играх из Local Storage (если они доступны)
function loadGameData() {
  const storedGames = localStorage.getItem("mafiaGames");
  if (storedGames) {
    gameData = JSON.parse(storedGames);
    renderGames(gameData);
  } else {
    // Если нет игр в Local Storage, загрузка из games.json
    fetch("games.json")
      .then((response) => response.json())
      .then((data) => {
        gameData = data;
        renderGames(gameData);
      })
      .catch((error) => {
        console.error("Error loading JSON file", error);
        // Обработка ошибок, например, вывод сообщения пользователю
        const errorRow = document.createElement("tr");
        errorRow.innerHTML = `
          <td colspan="5">Ошибка загрузки данных об играх. Пожалуйста, попробуйте позже.</td>
        `;
        gamesTable.querySelector("tbody").appendChild(errorRow);
      });
  }
}

// Сохранение данных об играх в Local Storage
function saveGameData() {
  localStorage.setItem("mafiaGames", JSON.stringify(gameData));
}

// Загрузка начальных данных об играх
loadGameData();

// Обработчик события для выбора фильтра
sortOptions.addEventListener("change", () => {
  const filter = sortOptions.value;
  let filteredGames = [...gameData];

  if (filter === "year") {
    filteredGames = filteredGames.filter((game) => {
      const gameDate = new Date(game.date);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return gameDate >= oneYearAgo;
    });
  } else if (filter === "month") {
    filteredGames = filteredGames.filter((game) => {
      const gameDate = new Date(game.date);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return gameDate >= oneMonthAgo;
    });
  }

  renderGames(filteredGames);
});

// Обработчик события для кнопки "Добавить игру" для отображения модального окна
addGameBtn.addEventListener("click", () => {
  addGameModal.style.display = "block";
});

// Обработчик события для закрытия модального окна
addGameModal.addEventListener("click", (event) => {
  if (event.target === addGameModal) {
    addGameModal.style.display = "none";
  }
});

// Обработчик события для отправки формы добавления новой игры
addGameForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const date = addGameForm.gameDate.value;
  const players = addGameForm.gamePlayers.value
    .split(",")
    .map((player) => player.trim());
  const winner = addGameForm.gameWinner.value;
  const type = addGameForm.gameType.value;
  const duration = addGameForm.gameDuration.value;

  // Создание объекта новой игры
  const newGame = {
    date,
    players,
    winner,
    type,
    duration,
  };

  // Добавление новой игры в данные и повторная отрисовка таблицы
  gameData.push(newGame);
  renderGames(gameData);

  // Сохранение обновленных данных в Local Storage
  saveGameData();

  // Очистка формы и закрытие модального окна
  addGameForm.reset();
  addGameModal.style.display = "none";
});

function sendGamesToServer() {
  const localStorageData = JSON.parse(localStorage.getItem("mafiaGames"));
  fetch("http://localhost:3000/saveGames", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(localStorageData),
  })
    .then((response) => {
      if (response.ok) {
        console.log("Data sent to server successfully");
        localStorage.removeItem("mafiaGames");
      } else {
        console.error("Error sending data to the server");
      }
    })
    .catch((error) => {
      console.error("Error sending data:", error);
    });
  console.log("Отправка данных на сервер...");
}

window.addEventListener("beforeunload", function (event) {
  sendGamesToServer(); // Отправляем данные на сервер
});
