const products = [
  {
    id: 1,
    name: "Шолом Arai RX-7V Evo",
    category: "helmets",
    description: "Гоночний карбоновий шолом із системою вентиляції VAS та швидкознімним візором.",
    price: 18900,
    badge: "Хіт",
    image: "https://images.unsplash.com/photo-1484176490122-33e0e299756c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Куртка Dainese Carve Master 3",
    category: "jackets",
    description: "Трисезонна текстильна куртка з Gore-Tex та вставками Pro-Armor рівня 2.",
    price: 16450,
    badge: "Новинка",
    image: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Рукавички Rev'It! Hyperspeed",
    category: "gloves",
    description: "Кенгарова шкіра, захисні панелі TPU та сенсорні кінчики для керування гаджетами.",
    price: 4890,
    badge: "Трек",
    image: "https://images.unsplash.com/photo-1571242706646-4a9d4c1f0d35?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Черевики Alpinestars Tech 7 Enduro",
    category: "boots",
    description: "Посилений захист гомілки та щиколотки, антиковзка підошва Michelin, сертифікація CE.",
    price: 12100,
    badge: "Off-road",
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Шолом Shoei Glamster 06",
    category: "helmets",
    description: "Ретро-дизайн, новий стандарт безпеки ECE 22.06, подвійна вентиляція та Pinlock.",
    price: 14200,
    badge: "Neo-Classic",
    image: "https://images.unsplash.com/photo-1617957743091-7ee6e8c228c3?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Куртка Rukka Kingsley",
    category: "jackets",
    description: "5-річна гарантія, Gore-Tex Pro 3L, захист D3O Air та світловідбивачі 3M.",
    price: 27800,
    badge: "Преміум",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Рукавички Furygan Jet Evo III",
    category: "gloves",
    description: "Міський стиль, коротка манжета, вентиляційні панелі та сенсорні вставки.",
    price: 1990,
    badge: "Urban",
    image: "https://images.unsplash.com/photo-1561580125-3f9a1e93d655?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Черевики TCX Street 3 WP",
    category: "boots",
    description: "Водонепроникна мембрана, підошва Ortholite та підсилення ShiftGuard.",
    price: 5650,
    badge: "City",
    image: "https://images.unsplash.com/photo-1484519332611-516457305ff6?auto=format&fit=crop&w=900&q=80"
  }
];

const reviews = [
  {
    name: "Олег К.",
    role: "R1250GS / Adventure",
    text: "Замовляв повний комплект для подорожей. Консультант підібрав куртку та черевики так, що після 1500 км жодного дискомфорту.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1520342868574-5fa3804e551c?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Марина S.",
    role: "CB650R / Urban",
    text: "Швидка доставка і крута упаковка. Шолом прийшов уже з встановленим Pinlock, за що окреме спасибі!",
    rating: 4,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
  },
  {
    name: "Дмитро L.",
    role: "YZF-R6 / Track",
    text: "Комбінезон Track DNA — вогонь! Фітинг під мене зробили за тиждень, поїхав на трекдень повністю готовим.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80"
  }
];

const productGrid = document.querySelector('.product-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const reviewCarousel = document.querySelector('.review-carousel');
const prevButton = document.querySelector('.carousel-button.prev');
const nextButton = document.querySelector('.carousel-button.next');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

function formatPrice(value) {
  return `₴${value.toLocaleString('uk-UA')}`;
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  card.setAttribute('role', 'listitem');
  card.dataset.category = product.category;
  card.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="product-content">
      <div class="product-meta">
        <span class="badge">${product.badge}</span>
        <span class="price">${formatPrice(product.price)}</span>
      </div>
      <h3>${product.name}</h3>
      <p>${product.description}</p>
      <div class="card-actions">
        <button type="button" class="add-to-cart">В кошик</button>
        <button type="button" class="add-to-wishlist" aria-label="Додати до списку бажань">♡ Зберегти</button>
      </div>
    </div>
  `;
  return card;
}

function renderProducts(filter = 'all') {
  productGrid.innerHTML = '';
  const filtered = filter === 'all'
    ? products
    : products.filter(product => product.category === filter);

  filtered.forEach(product => {
    const card = createProductCard(product);
    card.style.animation = 'fadeIn 0.4s ease forwards';
    productGrid.appendChild(card);
  });

  if (filtered.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
      <h3>Скоро оновлення!</h3>
      <p>У цій категорії ми готуємо нові поставки. Підпишіться, щоб отримати повідомлення.</p>
      <a class="button secondary" href="#contact">Зв'яжіться з нами</a>
    `;
    productGrid.appendChild(emptyState);
  }
}

function createReviewCard(review) {
  const card = document.createElement('article');
  card.className = 'review-card';
  card.setAttribute('role', 'listitem');
  card.innerHTML = `
    <div class="reviewer">
      <img src="${review.avatar}" alt="${review.name}">
      <div>
        <strong>${review.name}</strong>
        <div class="role">${review.role}</div>
      </div>
    </div>
    <div class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
    <p>${review.text}</p>
  `;
  return card;
}

function renderReviews(index = 0) {
  reviewCarousel.innerHTML = '';
  const cards = [];
  for (let i = 0; i < reviews.length; i += 1) {
    const card = createReviewCard(reviews[i]);
    cards.push(card);
  }
  cards.forEach(card => reviewCarousel.appendChild(card));

  // простий режим: показувати 1 відгук на мобільних, усі на десктопі
  if (window.innerWidth < 720) {
    cards.forEach((card, idx) => {
      card.style.display = idx === index ? 'flex' : 'none';
    });
  } else {
    cards.forEach(card => {
      card.style.display = 'flex';
    });
  }
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    const currentActive = document.querySelector('.filter-button.active');
    currentActive?.classList.remove('active');
    button.classList.add('active');
    renderProducts(button.dataset.filter);
  });
});

let currentReviewIndex = 0;

prevButton.addEventListener('click', () => {
  currentReviewIndex = (currentReviewIndex - 1 + reviews.length) % reviews.length;
  renderReviews(currentReviewIndex);
});

nextButton.addEventListener('click', () => {
  currentReviewIndex = (currentReviewIndex + 1) % reviews.length;
  renderReviews(currentReviewIndex);
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
  });
});

window.addEventListener('resize', () => {
  renderReviews(currentReviewIndex);
});

renderProducts();
renderReviews();
