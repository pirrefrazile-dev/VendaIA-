
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "VendaIA",
    status: "online",
    message: "Backend do VendaIA funcionando!"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`VendaIA funcionando na porta ${PORT}`);
});
