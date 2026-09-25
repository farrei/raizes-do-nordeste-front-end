// Cardapio mockado com imagens
const cardapios = {
  recife: [
    { id: 1, nome: "Baiao de Dois", descricao: "Arroz, feijao de corda, queijo coalho e carne seca", preco: 22.90, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { id: 2, nome: "Tapioca de Carne de Sol", descricao: "Tapioca recheada com carne de sol e queijo", preco: 14.50, img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
    { id: 3, nome: "Caldo de Sururu", descricao: "Caldo tradicional com sururu e temperos", preco: 12.00, img: "https://images.unsplash.com/photo-1547592166-23acba624fba?w=400&q=80" },
    { id: 4, nome: "Suco de Caju", descricao: "Natural, 400ml", preco: 7.00, img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80" },
    { id: 5, nome: "Cartola", descricao: "Banana, queijo e canela", preco: 9.50, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" }
  ],
  olinda: [
    { id: 1, nome: "Baiao de Dois", descricao: "Arroz, feijao de corda, queijo coalho e carne seca", preco: 21.90, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { id: 2, nome: "Acaraje", descricao: "Bolinho de feijao com vatapa e camarao", preco: 13.00, img: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=80" },
    { id: 3, nome: "Cuscuz Nordestino", descricao: "Cuscuz com ovo e queijo", preco: 11.50, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
    { id: 4, nome: "Suco de Acerola", descricao: "Natural, 400ml", preco: 6.50, img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80" },
    { id: 5, nome: "Doce de Leite", descricao: "Caseiro", preco: 5.00, img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" }
  ],
  jaboatao: [
    { id: 1, nome: "Baiao de Dois", descricao: "Arroz, feijao de corda, queijo coalho e carne seca", preco: 20.90, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80" },
    { id: 2, nome: "Escondidinho de Carne Seca", descricao: "Pure de macaxeira com carne seca", preco: 18.00, img: "https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80" },
    { id: 3, nome: "Buchada", descricao: "Porcao pequena", preco: 16.00, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80" },
    { id: 4, nome: "Suco de Goiaba", descricao: "Natural, 400ml", preco: 6.00, img: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=400&q=80" },
    { id: 5, nome: "Bolo de Rolo", descricao: "Fatia", preco: 8.00, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80" }
  ]
};

const nomesUnidades = {
  recife: "Recife - Centro",
  olinda: "Olinda - Bairro Novo",
  jaboatao: "Jaboatao - Prazeres"
};

let unidadeAtual = "recife";
let carrinho = [];
let pontos = 0;
let pedidoAtual = null;

function iniciarFumaca() {
  const canvas = document.getElementById("smoke-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let w, h;
  const particulas = [];
  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);
  for (let i = 0; i < 28; i++) {
    particulas.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 20 + Math.random() * 50,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.15 - Math.random() * 0.25,
      alpha: 0.02 + Math.random() * 0.04
    });
  }
  function desenhar() {
    ctx.clearRect(0, 0, w, h);
    particulas.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y + p.r < 0) { p.y = h + p.r; p.x = Math.random() * w; }
      if (p.x < -p.r) p.x = w + p.r;
      if (p.x > w + p.r) p.x = -p.r;
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
      grad.addColorStop(0, "rgba(200,180,150," + p.alpha + ")");
      grad.addColorStop(1, "rgba(200,180,150,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(desenhar);
  }
  desenhar();
}

function mostrarTela(nome) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  const el = document.getElementById("tela-" + nome);
  if (el) el.classList.add("ativa");
  document.querySelectorAll(".nav-btn").forEach(b => {
    b.classList.toggle("ativo", b.dataset.tela === nome);
  });
  const nav = document.getElementById("main-nav");
  if (nav) nav.classList.remove("aberto");
}

function carregarCardapio() {
  const lista = document.getElementById("lista-cardapio");
  if (!lista) return;
  lista.innerHTML = "";
  cardapios[unidadeAtual].forEach(p => {
    const card = document.createElement("div");
    card.className = "produto-card";
    card.innerHTML =
      '<img src="' + p.img + '" alt="' + p.nome + '" loading="lazy">' +
      '<div class="produto-body">' +
        '<h3>' + p.nome + '</h3>' +
        '<p class="desc">' + p.descricao + '</p>' +
        '<div class="produto-footer">' +
          '<span class="preco">R$ ' + p.preco.toFixed(2) + '</span>' +
          '<button type="button" class="btn-add" data-id="' + p.id + '">Adicionar</button>' +
        '</div>' +
      '</div>';
    lista.appendChild(card);
  });
  lista.querySelectorAll(".btn-add").forEach(btn => {
    btn.addEventListener("click", function () {
      adicionarCarrinho(parseInt(this.dataset.id, 10));
    });
  });
}

function adicionarCarrinho(id) {
  const produto = cardapios[unidadeAtual].find(p => p.id === id);
  if (!produto) return;
  const existente = carrinho.find(i => i.id === id);
  if (existente) existente.qtd += 1;
  else carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, qtd: 1 });
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const container = document.getElementById("itens-carrinho");
  const qtdSpan = document.getElementById("qtd-carrinho");
  const totalSpan = document.getElementById("total-carrinho");
  if (!container) return;
  const totalQtd = carrinho.reduce((a, i) => a + i.qtd, 0);
  if (qtdSpan) qtdSpan.textContent = totalQtd;
  if (carrinho.length === 0) {
    container.innerHTML = "<p style='color:#666;text-align:center'>Carrinho vazio.</p>";
    if (totalSpan) totalSpan.textContent = "0,00";
    return;
  }
  let html = "";
  let total = 0;
  carrinho.forEach(item => {
    const sub = item.preco * item.qtd;
    total += sub;
    html += '<div class="item-carrinho"><span>' + item.nome + ' x' + item.qtd +
      '</span><span>R$ ' + sub.toFixed(2) + '</span></div>';
  });
  container.innerHTML = html;
  if (totalSpan) totalSpan.textContent = total.toFixed(2);
}

function irParaPagamento() {
  if (carrinho.length === 0) {
    alert("Adicione itens ao carrinho primeiro.");
    return;
  }
  const total = carrinho.reduce((a, i) => a + i.preco * i.qtd, 0);
  document.getElementById("total-pagamento").textContent = total.toFixed(2);
  mostrarTela("pagamento");
}

function simularPagamento() {
  const total = carrinho.reduce((a, i) => a + i.preco * i.qtd, 0);
  alert("Redirecionando para o pagamento externo...\n\n(Em um sistema real, aqui abriria a tela do PIX/Cartao)");
  setTimeout(function () {
    const ganhos = Math.floor(total / 10);
    pontos += ganhos;
    const ptsEl = document.getElementById("pontos-usuario");
    if (ptsEl) ptsEl.textContent = pontos;
    pedidoAtual = {
      id: Math.floor(Math.random() * 9000) + 1000,
      total: total,
      status: "Recebido",
      unidade: nomesUnidades[unidadeAtual]
    };
    carrinho = [];
    atualizarCarrinho();
    atualizarStatusPedido();
    alert("Pagamento confirmado!\nPedido n " + pedidoAtual.id + "\nVoce ganhou " + ganhos + " pontos.");
    mostrarTela("pedido");
  }, 1200);
}

function atualizarStatusPedido() {
  const container = document.getElementById("status-pedido");
  if (!container) return;
  if (!pedidoAtual) {
    container.innerHTML = '<p class="vazio">Nenhum pedido em andamento.</p>';
    return;
  }
  container.innerHTML =
    '<div class="status-box">' +
      '<p><strong>Pedido #' + pedidoAtual.id + '</strong></p>' +
      '<p>Unidade: ' + pedidoAtual.unidade + '</p>' +
      '<p>Total: R$ ' + pedidoAtual.total.toFixed(2) + '</p>' +
      '<p>Status: <strong>' + pedidoAtual.status + '</strong></p>' +
      '<p style="margin-top:8px;font-size:13px;color:#666">Aguarde a atualizacao do status.</p>' +
    '</div>';
  setTimeout(function () {
    if (pedidoAtual && pedidoAtual.status === "Recebido") {
      pedidoAtual.status = "Em preparo";
      atualizarStatusPedido();
    }
  }, 5000);
  setTimeout(function () {
    if (pedidoAtual && pedidoAtual.status === "Em preparo") {
      pedidoAtual.status = "Pronto para retirada";
      atualizarStatusPedido();
    }
  }, 11000);
}

document.addEventListener("DOMContentLoaded", function () {
  iniciarFumaca();
  if (localStorage.getItem("lgpdAceito") === "sim") {
    const b = document.getElementById("lgpd-banner");
    if (b) b.style.display = "none";
  }
  carregarCardapio();
  atualizarCarrinho();
  document.querySelectorAll("[data-tela]").forEach(el => {
    el.addEventListener("click", function (e) {
      e.preventDefault();
      mostrarTela(this.dataset.tela);
    });
  });
  document.getElementById("menu-toggle").addEventListener("click", function () {
    document.getElementById("main-nav").classList.toggle("aberto");
  });
  document.getElementById("select-unidade").addEventListener("change", function () {
    unidadeAtual = this.value;
    document.getElementById("nome-unidade").textContent = nomesUnidades[unidadeAtual];
    carregarCardapio();
  });
  document.getElementById("btn-finalizar").addEventListener("click", irParaPagamento);
  document.getElementById("btn-pagar").addEventListener("click", simularPagamento);
  document.getElementById("form-login").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!document.getElementById("aceite-lgpd").checked) {
      alert("Voce precisa aceitar a Politica de Privacidade (LGPD).");
      return;
    }
    document.getElementById("btn-login").textContent = "Ola, Cliente";
    alert("Login realizado com sucesso!");
    mostrarTela("inicio");
  });
  document.getElementById("form-cadastro").addEventListener("submit", function (e) {
    e.preventDefault();
    if (!document.getElementById("aceite-lgpd-cad").checked) {
      alert("E necessario autorizar o uso dos dados (LGPD) para criar a conta.");
      return;
    }
    const nome = document.getElementById("nome").value;
    document.getElementById("btn-login").textContent = "Ola, " + nome.split(" ")[0];
    alert("Cadastro realizado! Bem-vindo(a), " + nome);
    mostrarTela("inicio");
  });
  document.getElementById("link-cadastro").addEventListener("click", function (e) {
    e.preventDefault();
    mostrarTela("cadastro");
  });
  document.getElementById("link-voltar-login").addEventListener("click", function (e) {
    e.preventDefault();
    mostrarTela("login");
  });
  function abrirModal() { document.getElementById("modal-politica").hidden = false; }
  function fecharModal() { document.getElementById("modal-politica").hidden = true; }
  document.getElementById("link-politica-banner").addEventListener("click", function (e) {
    e.preventDefault();
    abrirModal();
  });
  document.getElementById("link-politica-footer").addEventListener("click", function (e) {
    e.preventDefault();
    abrirModal();
  });
  document.getElementById("btn-fechar-modal").addEventListener("click", fecharModal);
  document.getElementById("btn-aceitar-lgpd").addEventListener("click", function () {
    localStorage.setItem("lgpdAceito", "sim");
    document.getElementById("lgpd-banner").style.display = "none";
  });
  document.getElementById("btn-recusar-lgpd").addEventListener("click", function () {
    alert("Algumas funcionalidades (como fidelidade) podem ficar limitadas sem o consentimento.");
    document.getElementById("lgpd-banner").style.display = "none";
  });
});
