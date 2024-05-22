const express = require("express");
const fs = require("fs");
const cors = require("cors"); // Импортируйте cors

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors()); // Включите CORS

// Обработчик запросов POST на `/saveGames`
app.post("/saveGames", (req, res) => {
  console.log("Сервер получил данные:", req.body);
  const data = req.body;
  fs.writeFileSync("games.json", JSON.stringify(data), "utf8", (err) => {
    if (err) {
      res.status(500).send("Error saving data");
    } else {
      res.send("Data saved successfully");
    }
  });
});

// Обработчик запросов GET на `/`
app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
