// Dados mockados do cardápio por unidade
const cardapios = {
  recife: [
    { id: 1, nome: "Baião de Dois", descricao: "Arroz, feijão de corda, queijo coalho e carne seca", preco: 22.90 },
    { id: 2, nome: "Tapioca de Carne de Sol", descricao: "Tapioca recheada com carne de sol e queijo", preco: 14.50 },
    { id: 3, nome: "Caldo de Sururu", descricao: "Caldo tradicional com sururu e temperos", preco: 12.00 },
    { id: 4, nome: "Suco de Caju", descricao: "Natural, 400ml", preco: 7.00 },
    { id: 5, nome: "Cartola", descricao: "Banana, queijo e canela", preco: 9.50 }
  ],
  olinda: [
    { id: 1, nome: "Baião de Dois", descricao: "Arroz, feijão de corda, queijo coalho e carne seca", preco: 21.90 },
    { id: 2, nome: "Acarajé", descricao: "Bolinho de feijão com vatapá e camarão", preco: 13.00 },
    { id: 3, nome: "Cuscuz Nordestino", descricao: "Cuscuz com ovo e queijo", preco: 11.50 },
    { id: 4, nome: "Suco de Acerola", descricao: "Natural, 400ml", preco: 6.50 },
    { id: 5, nome: "Doce de Leite", descricao: "Caseiro", preco: 5.00 }
  ],
  jaboatao: [
    { id: 1, nome: "Baião de Dois", descricao: "Arroz, feijão de corda, queijo coalho e carne seca", preco: 20.90 },
    { id: 2, nome: "Escondidinho de Carne Seca", descricao: "Purê de macaxeira com carne seca", preco: 18.00 },
    { id: 3, nome: "Buchada", descricao: "Porção pequena", preco: 16.00 },
    { id: 4, nome: "Suco de Goiaba", descricao: "Natural, 400ml", preco: 6.00 },
    { id: 5, nome: "Bolo de Rolo", descricao: "Fatia", preco: 8.00 }
  ]
};

const nomesUnidades = {
  recife: "Recife - Centro",
  olinda: "Olinda - Bairro Novo",
  jaboatao: "Jaboatão - Prazeres"
};

// Estado da aplicação
let unidadeAtual = "recife";
let carrinho = [];
let usuarioLogado = null;
let pontos = 0;
let pedidoAtual = null;

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
  // Verifica se já aceitou LGPD
  if (localStorage.getItem("lgpdAceito") === "sim") {
    document.getElementById("lgpd-banner").style.display = "none";
  }
  
  carregarCardapio();
  atualizarCarrinho();
});

// Navegação entre telas
function mostrarTela(nome) {
  document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
  
  if (nome === "login") {
    document.getElementById("tela-login").classList.add("ativa");
  } else if (nome === "cadastro") {
    document.getElementById("tela-cadastro").classList.add("ativa");
  } else {
    document.getElementById("tela-" + nome).classList.add("ativa");
  }
}

// Trocar unidade
function trocarUnidade() {
  unidadeAtual = document.getElementById("select-unidade").value;
  document.getElementById("nome-unidade").textContent = nomesUnidades[unidadeAtual];
  carregarCardapio();
}

// Carregar cardápio
function carregarCardapio() {
  const lista = document.getElementById("lista-cardapio");
  lista.innerHTML = "";
  
  cardapios[unidadeAtual].forEach(produto => {
    const div = document.createElement("div");
    div.className = "produto";
    div.innerHTML = `
      <div class="produto-info">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao}</p>
        <p class="preco">R$ ${produto.preco.toFixed(2)}</p>
      </div>
      <button class="btn-add" onclick="adicionarCarrinho(${produto.id})">Adicionar</button>
    `;
    lista.appendChild(div);
  });
}

// Carrinho
function adicionarCarrinho(id) {
  const produto = cardapios[unidadeAtual].find(p => p.id === id);
  if (!produto) return;
  
  const itemExistente = carrinho.find(i => i.id === id);
  if (itemExistente) {
    itemExistente.qtd += 1;
  } else {
    carrinho.push({ ...produto, qtd: 1 });
  }
  
  atualizarCarrinho();
  alert(produto.nome + " adicionado ao carrinho!");
}

function atualizarCarrinho() {
  const container = document.getElementById("itens-carrinho");
  const qtdSpan = document.getElementById("qtd-carrinho");
  const totalSpan = document.getElementById("total-carrinho");
  
  qtdSpan.textContent = carrinho.reduce((acc, i) => acc + i.qtd, 0);
  
  if (carrinho.length === 0) {
    container.innerHTML = "<p>Carrinho vazio.</p>";
    totalSpan.textContent = "0,00";
    return;
  }
  
  let html = "";
  let total = 0;
  
  carrinho.forEach(item => {
    const subtotal = item.preco * item.qtd;
    total += subtotal;
    html += `
      <div class="item-carrinho">
        <span>${item.nome} x${item.qtd}</span>
        <span>R$ ${subtotal.toFixed(2)}</span>
      </div>
    `;
  });
  
  container.innerHTML = html;
  totalSpan.textContent = total.toFixed(2);
}

function irParaPagamento() {
  if (carrinho.length === 0) {
    alert("Adicione itens ao carrinho primeiro.");
    return;
  }
  
  const total = carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0);
  document.getElementById("total-pagamento").textContent = total.toFixed(2);
  mostrarTela("pagamento");
}

// Simulação de pagamento externo
function simularPagamento() {
  const total = carrinho.reduce((acc, i) => acc + (i.preco * i.qtd), 0);
  
  // Simula envio para serviço externo
  alert("Redirecionando para o pagamento externo...\n\n(Em um sistema real, aqui abriria a tela do PIX/Cartão)");
  
  // Simula retorno de sucesso
  setTimeout(function() {
    // Gera pontos (1 ponto a cada R$10)
    const pontosGanhos = Math.floor(total / 10);
    pontos += pontosGanhos;
    document.getElementById("pontos-usuario").textContent = pontos;
    
    // Cria pedido
    pedidoAtual = {
      id: Math.floor(Math.random() * 10000),
      itens: [...carrinho],
      total: total,
      status: "Recebido",
      unidade: nomesUnidades[unidadeAtual]
    };
    
    // Limpa carrinho
    carrinho = [];
    atualizarCarrinho();
    
    // Atualiza tela de status
    atualizarStatusPedido();
    
    alert("Pagamento confirmado!\nPedido nº " + pedidoAtual.id + "\nVocê ganhou " + pontosGanhos + " pontos.");
    mostrarTela("pedido");
  }, 1500);
}

function atualizarStatusPedido() {
  const container = document.getElementById("status-pedido");
  
  if (!pedidoAtual) {
    container.innerHTML = "<p>Nenhum pedido em andamento.</p>";
    return;
  }
  
  container.innerHTML = `
    <div class="status-box">
      <p><strong>Pedido #${pedidoAtual.id}</strong></p>
      <p>Unidade: ${pedidoAtual.unidade}</p>
      <p>Total: R$ ${pedidoAtual.total.toFixed(2)}</p>
      <p>Status: <strong>${pedidoAtual.status}</strong></p>
      <p style="margin-top:10px; font-size:13px;">Em breve a cozinha vai começar a preparar.</p>
    </div>
  `;
  
  // Simula mudança de status
  setTimeout(function() {
    if (pedidoAtual) {
      pedidoAtual.status = "Em preparo";
      atualizarStatusPedido();
    }
  }, 5000);
  
  setTimeout(function() {
    if (pedidoAtual) {
      pedidoAtual.status = "Pronto para retirada";
      atualizarStatusPedido();
    }
  }, 12000);
}

// Login e Cadastro (simulados)
function fazerLogin(event) {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const aceite = document.getElementById("aceite-lgpd").checked;
  
  if (!aceite) {
    alert("Você precisa aceitar a Política de Privacidade (LGPD).");
    return;
  }
  
  usuarioLogado = { email: email, nome: "Cliente" };
  document.getElementById("btn-login").textContent = "Olá, Cliente";
  alert("Login realizado com sucesso!");
  mostrarTela("inicio");
}

function fazerCadastro(event) {
  event.preventDefault();
  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email-cad").value;
  const aceite = document.getElementById("aceite-lgpd-cad").checked;
  
  if (!aceite) {
    alert("É necessário autorizar o uso dos dados (LGPD) para criar a conta.");
    return;
  }
  
  usuarioLogado = { email: email, nome: nome };
  document.getElementById("btn-login").textContent = "Olá, " + nome.split(" ")[0];
  alert("Cadastro realizado! Bem-vindo(a), " + nome);
  mostrarTela("inicio");
}

function mostrarCadastro() {
  mostrarTela("cadastro");
}

// LGPD
function aceitarLGPD() {
  localStorage.setItem("lgpdAceito", "sim");
  document.getElementById("lgpd-banner").style.display = "none";
}

function recusarLGPD() {
  alert("Algumas funcionalidades (como fidelidade) podem ficar limitadas sem o consentimento.");
  document.getElementById("lgpd-banner").style.display = "none";
}

function mostrarPolitica() {
  document.getElementById("modal-politica").classList.add("ativo");
}

function fecharPolitica() {
  document.getElementById("modal-politica").classList.remove("ativo");
}
