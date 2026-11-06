
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

if (!process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY
  throw new Error("Credenciais do Supabase não configuradas.");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

app.get("/", (req, res) => {
  res.json({
    app: "VendaIA",
    status: "online",
    message: "Banco de dados conectado!"
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Cadastrar produto
app.post("/api/produtos", async (req, res) => {
  try {
    const { nome, preco, marketplace } = req.body;

    if (
      typeof nome !== "string" ||
      !nome.trim() ||
      preco === undefined ||
      !Number.isFinite(Number(preco)) ||
      Number(preco) <= 0
    ) {
      return res.status(400).json({
        erro: "Informe nome e preço válido."
      });
    }

    const { data, error } = await supabase
      .from("produtos")
      .insert({
        nome: nome.trim(),
        preco: Number(preco),
        marketplace: marketplace || "Não informado"
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      mensagem: "Produto cadastrado!",
      produto: data
    });
  } catch (error) {
    console.error("Erro ao cadastrar:", error.message);
    res.status(500).json({
      erro: "Não foi possível cadastrar o produto."
    });
  }
});

// Listar produtos
app.get("/api/produtos", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("produtos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      total: data.length,
      produtos: data
    });
  } catch (error) {
    console.error("Erro ao listar:", error.message);
    res.status(500).json({
      erro: "Não foi possível consultar os produtos."
    });
  }
});

app.listen(PORT, () => {
  console.log(`VendaIA funcionando na porta ${PORT}`);
});
