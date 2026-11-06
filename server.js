
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let produtos = [];
let proximoId = 1;

app.get("/", (req, res) => {
  res.json({
    app: "VendaIA",
    status: "online",
    message: "VendaIA funcionando!"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Cadastrar produto
app.post("/api/produtos", (req, res) => {
  const { nome, preco, marketplace } = req.body;

  if (!nome || preco === undefined || !Number.isFinite(Number(preco)) || Number(preco) <= 0) {
    return res.status(400).json({
      erro: "Informe nome e preço válido."
    });
  }

  const produto = {
    id: proximoId++,
    nome,
    preco: Number(preco),
    marketplace: marketplace || "Não informado"
  };

  produtos.push(produto);

  res.status(201).json({
    mensagem: "Produto cadastrado!",
    produto
  });
});

// Listar produtos
app.get("/api/produtos", (req, res) => {
  res.json({
    total: produtos.length,
    produtos
  });
});

app.listen(PORT, () => {
  console.log(`VendaIA funcionando na porta ${PORT}`);
});
