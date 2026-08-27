// Registro do Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(console.error);
}

// Banco de dados simulado de produtos recomendados para Cronograma Capilar
let products = [
  {
    id: 1,
    name: "Máscara Hidratação Profunda Babosa",
    category: "Hidratação",
    desc: "Rica em água e extrato vegetal para maciez e brilho imediato.",
    img: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 2,
    name: "Óleo Nutritivo de Argan e Abacate",
    category: "Nutrição",
    desc: "Reposição lipídica poderosa para combater o frizz e pontas duplas.",
    img: "https://images.unsplash.com/photo-1608248597359-99446d1bf259?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: 3,
    name: "Máscara Reconstrutora com Queratina",
    category: "Reconstrução",
    desc: "Devolve a massa capilar e fortalece fios danificados por química.",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80"
  }
];

let currentFilter = 'all';

// Função que simula o carregamento com Skeleton Screen na Aba de Produtos
function loadProducts(filter = 'all') {
  const container = document.getElementById('products-container');
  
  // 1. Mostra o Skeleton Screen pulsante
  container.innerHTML = `
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    </div>
    <div class="skeleton-card">
      <div class="skeleton skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
        <div class="skeleton skeleton-text short"></div>
      </div>
    </div>
  `;

  // 2. Simula latência de rede (1.2 segundos) e preenche com os cards reais
  setTimeout(() => {
    container.innerHTML = '';
    
    const filtered = filter === 'all' 
      ? products 
      : products.filter(p => p.category === filter);

    if (filtered.length === 0) {
      container.innerHTML = '<p style="text-align:center; color:#64748b; padding:20px;">Nenhum produto encontrado nesta categoria.</p>';
      return;
    }

    filtered.forEach(item => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="${item.img}" alt="${item.name}" loading="lazy">
        <div class="product-info">
          <div class="product-header">
            <h3>${item.name}</h3>
            <span class="product-category">${item.category}</span>
          </div>
          <p>${item.desc}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }, 1200);
}

// Carregar feed inicial da rotina
function loadFeed() {
  const container = document.getElementById('cards-container');
  container.innerHTML = `
    <div class="card">
      <div class="card-tag">Hoje é dia de:</div>
      <h2 style="margin: 8px 0; color: var(--blue-800);">Hidratação Capilar</h2>
      <p>Foco em devolver a umidade natural aos fios. Use sua máscara favorita com d-pantenol ou babosa por 10 minutos.</p>
    </div>
  `;
}

// Navegação Inferior (Abas)
document.querySelectorAll('.nav-item[data-target]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));

    btn.classList.add('active');
    const targetView = document.getElementById(btn.dataset.target);
    targetView.classList.add('active');

    if (btn.dataset.target === 'view-products') {
      loadProducts(currentFilter);
    }
  });
});

// Filtros de Categoria de Produtos
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', (e) => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    loadProducts(currentFilter);
  });
});

// Botão de Atualizar
document.getElementById('btn-refresh').addEventListener('click', () => {
  loadFeed();
  loadProducts(currentFilter);
});

// Modal / Bottom Sheet para Adicionar Produto (FAB)
const postModal = document.getElementById('post-modal');
document.getElementById('btn-open-post').addEventListener('click', () => {
  postModal.classList.add('active');
});

document.getElementById('btn-cancel-post').addEventListener('click', () => {
  postModal.classList.remove('active');
});

document.getElementById('btn-save-post').addEventListener('click', () => {
  const name = document.getElementById('input-name').value.trim();
  const category = document.getElementById('input-category').value;
  const desc = document.getElementById('input-desc').value.trim();
  const img = document.getElementById('input-img').value.trim() || 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?auto=format&fit=crop&w=600&q=80';

  if (!name || !desc) {
    alert('Preencha o nome e a descrição do produto!');
    return;
  }

  // Adiciona novo produto na lista
  products.unshift({
    id: Date.now(),
    name,
    category,
    desc,
    img
  });

  // Limpa campos e fecha modal
  document.getElementById('input-name').value = '';
  document.getElementById('input-desc').value = '';
  document.getElementById('input-img').value = '';
  postModal.classList.remove('active');

  // Recarrega lista
  loadProducts(currentFilter);
});

// Inicialização
loadFeed();