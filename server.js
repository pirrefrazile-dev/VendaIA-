
const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

if (
  !process.env.SUPABASE_URL ||
  !process.env.SUPABASE_SECRET_KEY
) {
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
    const { nome, preco, marketplace, link_afiliado } = req.body;

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
        link_afiliado: link_afiliado || null
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
app.get("/importar", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>VendaIA - Importar Produto</title>
      <style>
        body { font-family: Arial; background: #f2f4f7; padding: 20px; }
        .box { max-width: 450px; margin: auto; background: white;
          padding: 20px; border-radius: 12px; }
        input, button { width: 100%; padding: 13px; margin: 8px 0;
          box-sizing: border-box; }
        button { background: #16a34a; color: white; border: 0;
          border-radius: 8px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="box">
        <h2>VendaIA</h2>
        <h3>Importar produto Shopee</h3>
        <form id="form">
          <input id="link" placeholder="Link de afiliado Shopee" required>
          <input id="nome" placeholder="Nome do produto" required>
          <input id="preco" type="number" step="0.01"
            placeholder="Preço (R$)" required>
          <button type="submit">Cadastrar produto</button>
        </form>
        <p id="mensagem"></p>
      </div>
      <script>
        document.getElementById("form").addEventListener("submit", async (e) => {
          e.preventDefault();
          const mensagem = document.getElementById("mensagem");
          mensagem.textContent = "Salvando...";
          try {
            const resposta = await fetch("/api/produtos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                nome: document.getElementById("nome").value,
                preco: document.getElementById("preco").value,
                marketplace: "Shopee",
                link_afiliado: document.getElementById("link").value
              })
            });
            const dados = await resposta.json();
            mensagem.textContent = resposta.ok
              ? "Produto cadastrado com sucesso!"
              : "Erro: " + (dados.error || "Não foi possível cadastrar.");
          } catch (erro) {
            mensagem.textContent = "Erro de conexão. Tente novamente.";
          }
        });
      </script>
    </body>
    </html>
  `);
});app.post("/api/gerar-anuncio", async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({
        error: "Cole o link do produto."
      });
    }

    res.json({
      sucesso: true,
      produto: link,
      titulo: "Oferta especial: confira este produto!",
      descricao: "Aproveite esta oportunidade e confira o produto.",
      hashtags: [
        "#Shopee",
        "#Ofertas",
        "#Achadinhos",
        "#Promocao",
        "#ComprasOnline"
      ],
      video: "Roteiro de vídeo promocional disponível para criação.",
      anuncio: "Confira esta oferta e aproveite!"
    });

  } catch (erro) {
    res.status(500).json({
      error: "Erro ao gerar anúncio."
    });
  }
});app.post("/api/gerar-anuncio", async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res.status(400).json({
        error: "Cole o link do produto."
      });
    }

    res.json({
      sucesso: true,
      produto: link,
      titulo: "Oferta especial: confira este produto!",
      descricao: "Aproveite esta oportunidade e confira o produto.",
      hashtags: [
        "#Shopee",
        "#Ofertas",
        "#Achadinhos",
        "#Promocao",
        "#ComprasOnline"
      ],
      video: "Roteiro de vídeo promocional disponível para criação.",
      anuncio: "Confira esta oferta e aproveite!"
    });

  } catch (erro) {
    res.status(500).json({
      error: "Erro ao gerar anúncio."
    });
  }
});
app.listen(PORT, () => {
  console.log(`VendaIA funcionando na porta ${PORT}`);
});
