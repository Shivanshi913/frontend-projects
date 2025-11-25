// Data keys
const RECIPES_KEY = 'rb_recipes_v1';
const FAVS_KEY = 'rb_favorites_v1';
const COMMENTS_KEY = 'rb_comments_v1';

// Seed sample recipes
const sampleRecipes = [
  {
    id: 'r1',
    name: 'Classic Pancakes',
    description: 'Fluffy, buttery pancakes perfect for breakfast.',
    image: 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?q=80&w=1200&auto=format&fit=crop',
    category: 'breakfast',
    prepTime: 10,
    cookTime: 15,
    ingredients: [
      '1 1/2 cups all-purpose flour',
      '3 1/2 tsp baking powder',
      '1 tbsp sugar',
      '1/4 tsp salt',
      '1 1/4 cups milk',
      '1 egg',
      '3 tbsp melted butter'
    ],
    instructions: [
      'Whisk dry ingredients in a bowl.',
      'Add milk, egg, and butter; whisk until just combined.',
      'Cook 1/4 cup batter on a greased pan until golden on both sides.'
    ]
  },
  {
    id: 'r2',
    name: 'Spaghetti Aglio e Olio',
    description: 'Simple Italian pasta with garlic, chili, and olive oil.',
    image: 'https://images.unsplash.com/photo-1523986371872-9d3ba2e2a389?q=80&w=1200&auto=format&fit=crop',
    category: 'dinner',
    prepTime: 5,
    cookTime: 15,
    ingredients: [
      '200g spaghetti',
      '4 cloves garlic, sliced',
      '1/2 tsp chili flakes',
      '3 tbsp extra virgin olive oil',
      'Parsley, chopped',
      'Salt'
    ],
    instructions: [
      'Boil pasta in salted water until al dente.',
      'Sauté garlic and chili in olive oil on low heat.',
      'Toss pasta with oil, add parsley, and serve.'
    ]
  },
  {
    id: 'r3',
    name: 'Chocolate Brownies',
    description: 'Rich, fudgy brownies with a crackly top.',
    image: 'https://images.unsplash.com/photo-1589307004173-3c95204a2d1f?q=80&w=1200&auto=format&fit=crop',
    category: 'dessert',
    prepTime: 15,
    cookTime: 25,
    ingredients: [
      '1/2 cup butter',
      '1 cup sugar',
      '2 eggs',
      '1/3 cup cocoa powder',
      '1/2 cup flour',
      '1 tsp vanilla',
      'Pinch of salt'
    ],
    instructions: [
      'Melt butter; whisk in sugar, eggs, and vanilla.',
      'Add cocoa, flour, salt; mix just until combined.',
      'Bake at 175°C for 20–25 mins.'
    ]
  },
  {
    id: 'r4',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based mango drink.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c09ef43?q=80&w=1200&auto=format&fit=crop',
    category: 'beverage',
    prepTime: 5,
    cookTime: 0,
    ingredients: [
      '1 ripe mango, chopped',
      '1 cup yogurt',
      '1/2 cup milk',
      '1–2 tbsp sugar',
      'Pinch of cardamom'
    ],
    instructions: [
      'Blend all ingredients until smooth.',
      'Serve chilled.'
    ]
  }
];

// Storage helpers
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
function write(key, value) { localStorage.setItem(key, JSON.stringify(value)); }

// Initialize recipes if missing
function ensureSeed() {
  const existing = read(RECIPES_KEY, null);
  if (!existing) write(RECIPES_KEY, sampleRecipes);
  if (!read(FAVS_KEY, null)) write(FAVS_KEY, []);
  if (!read(COMMENTS_KEY, null)) write(COMMENTS_KEY, {});
}

// Calculate average rating
function getAverageRating(recipeId) {
  const comments = read(COMMENTS_KEY, {});
  const list = comments[recipeId] || [];
  if (!list.length) return { avg: 0, count: 0 };
  const avg = list.reduce((a, c) => a + (c.rating || 0), 0) / list.length;
  return { avg, count: list.length };
}

// Render star icons
function renderStars(value) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  let html = '';
  for (let i = 0; i < full; i++) html += '<i class="fas fa-star"></i>';
  if (half) html += '<i class="fas fa-star-half-alt"></i>';
  for (let i = full + (half ? 1 : 0); i < 5; i++) html += '<i class="far fa-star"></i>';
  return html;
}

// Filters
function applyFilters() {
  const q = (document.getElementById('search')?.value || '').toLowerCase();
  const cat = document.getElementById('category-filter')?.value || 'all';
  const sort = document.getElementById('sort-select')?.value || 'latest';
  const recipes = read(RECIPES_KEY, []);

  let list = recipes.filter(r => (cat === 'all' || r.category === cat) && (r.name.toLowerCase().includes(q) || (r.description||'').toLowerCase().includes(q)));
  if (sort === 'rating') {
    list.sort((a, b) => getAverageRating(b.id).avg - getAverageRating(a.id).avg);
  } else if (sort === 'time') {
    const total = (x) => (x.prepTime||0) + (x.cookTime||0);
    list.sort((a, b) => total(a) - total(b));
  } else {
    list = list.reverse();
  }
  renderGrid(list);
}

// Render grid
function renderGrid(recipes) {
  const grid = document.getElementById('recipes-grid');
  const favs = new Set(read(FAVS_KEY, []));
  grid.innerHTML = recipes.map(r => {
    const { avg, count } = getAverageRating(r.id);
    return `
      <article class="recipe-card" data-id="${r.id}">
        <div class="card-top">
          <img class="recipe-image" src="${r.image}" alt="${r.name}">
          <button class="fav-btn" title="Favorite" data-fav="${r.id}"><i class="${favs.has(r.id) ? 'fas' : 'far'} fa-heart"></i></button>
        </div>
        <div class="recipe-content">
          <div class="recipe-meta">
            <span class="recipe-category">${r.category}</span>
            <span class="recipe-time">${(r.prepTime||0) + (r.cookTime||0)} min</span>
          </div>
          <h3 class="recipe-title">${r.name}</h3>
          <p class="recipe-description">${r.description || ''}</p>
          <div class="rating-inline">
            <span class="stars">${renderStars(avg)}</span>
            <span class="count">(${count})</span>
          </div>
          <div class="recipe-actions">
            <button class="btn btn-primary" data-view="${r.id}">View Recipe</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  // Handlers
  grid.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => openModal(btn.getAttribute('data-view'))));
  grid.querySelectorAll('[data-fav]').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFavorite(btn.getAttribute('data-fav'));
  }));
}

function toggleFavorite(id) {
  const favs = new Set(read(FAVS_KEY, []));
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  write(FAVS_KEY, Array.from(favs));
  applyFilters();
  renderFavorites();
}

// Favorites section
function renderFavorites() {
  const favGrid = document.getElementById('favorites-grid');
  if (!favGrid) return;
  const favs = new Set(read(FAVS_KEY, []));
  const recipes = read(RECIPES_KEY, []);
  const list = recipes.filter(r => favs.has(r.id));
  favGrid.innerHTML = list.length ? list.map(r => `
    <article class="recipe-card" data-id="${r.id}">
      <img class="recipe-image" src="${r.image}" alt="${r.name}">
      <div class="recipe-content">
        <h3 class="recipe-title">${r.name}</h3>
        <div class="recipe-actions">
          <button class="btn btn-primary" data-view="${r.id}">View Recipe</button>
        </div>
      </div>
    </article>
  `).join('') : '<p>No favorites yet.</p>';
  favGrid.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => openModal(btn.getAttribute('data-view'))));
}

// Modal rendering
function openModal(id) {
  const recipes = read(RECIPES_KEY, []);
  const r = recipes.find(x => x.id === id);
  if (!r) return;
  const modal = document.getElementById('recipe-modal');
  const wrap = document.getElementById('modal-content');
  const { avg, count } = getAverageRating(r.id);
  wrap.innerHTML = `
    <div class="recipe-detail">
      <div class="recipe-detail-header">
        <img class="recipe-detail-image" src="${r.image}" alt="${r.name}">
        <div class="recipe-detail-info">
          <h1>${r.name}</h1>
          <div class="recipe-detail-meta">
            <span class="recipe-category">${r.category}</span>
            <span class="recipe-time">Prep ${r.prepTime||0}m • Cook ${r.cookTime||0}m</span>
          </div>
          <div class="recipe-rating">
            <div class="stars">${renderStars(avg)}</div>
            <span class="rating-text">${avg.toFixed(1)} / 5 (${count})</span>
          </div>
        </div>
      </div>
      <div class="recipe-detail-section">
        <h3>Ingredients</h3>
        <ul class="ingredients-list">${(r.ingredients||[]).map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
      <div class="recipe-detail-section">
        <h3>Instructions</h3>
        <ol class="instructions-list">${(r.instructions||[]).map(i => `<li>${i}</li>`).join('')}</ol>
      </div>
      <div class="comments-section">
        <h3>Comments</h3>
        <div id="comments"></div>
        <div class="add-comment">
          <h4>Add a comment</h4>
          <form id="comment-form" class="comment-form">
            <div class="comment-form-row">
              <input id="comment-author" type="text" placeholder="Your name" required>
              <div class="rating-input">
                <span>Rating:</span>
                <div class="rating-stars">
                  ${[5,4,3,2,1].map(v => `<input id="star-${v}" name="rating" type="radio" value="${v}"><label for="star-${v}">★</label>`).join('')}
                </div>
              </div>
            </div>
            <textarea id="comment-text" rows="3" placeholder="Write your comment..." required></textarea>
            <button class="btn btn-primary" type="submit">Post Comment</button>
          </form>
        </div>
      </div>
    </div>
  `;
  renderComments(r.id);
  document.querySelector('#comment-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const author = document.getElementById('comment-author').value.trim() || 'Anonymous';
    const text = document.getElementById('comment-text').value.trim();
    const rating = Number(document.querySelector('input[name="rating"]:checked')?.value || 0);
    if (!text) return;
    const all = read(COMMENTS_KEY, {});
    const list = all[r.id] || [];
    list.push({ author, text, rating, date: new Date().toISOString() });
    all[r.id] = list;
    write(COMMENTS_KEY, all);
    renderComments(r.id);
    (e.target).reset();
    applyFilters();
  });
  modal.style.display = 'block';
  modal.querySelector('.close').onclick = () => modal.style.display = 'none';
  window.onclick = (ev) => { if (ev.target === modal) modal.style.display = 'none'; };
}

function renderComments(recipeId) {
  const container = document.getElementById('comments');
  const all = read(COMMENTS_KEY, {});
  const list = all[recipeId] || [];
  container.innerHTML = list.length ? list.map(c => `
    <div class="comment">
      <div class="comment-header">
        <span class="comment-author">${c.author}</span>
        <span class="comment-date">${new Date(c.date).toLocaleDateString()}</span>
      </div>
      <div class="comment-rating">${renderStars(c.rating || 0)}</div>
      <div class="comment-text">${c.text}</div>
    </div>
  `).join('') : '<p>No comments yet. Be the first!</p>';
}

// Add recipe form
function initAddRecipe() {
  const form = document.getElementById('recipe-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('recipe-name').value.trim();
    const image = document.getElementById('recipe-image').value.trim() || 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?q=80&w=1200&auto=format&fit=crop';
    const description = document.getElementById('recipe-description').value.trim();
    const ingredients = document.getElementById('recipe-ingredients').value.split('\n').map(s => s.trim()).filter(Boolean);
    const instructions = document.getElementById('recipe-instructions').value.split('\n').map(s => s.trim()).filter(Boolean);
    const category = document.getElementById('recipe-category').value;
    const prepTime = Number(document.getElementById('recipe-prep-time').value || 0);
    const cookTime = Number(document.getElementById('recipe-cook-time').value || 0);
    if (!name || !ingredients.length || !instructions.length) return;
    const recipes = read(RECIPES_KEY, []);
    recipes.push({ id: 'r' + (Date.now()), name, description, image, category, prepTime, cookTime, ingredients, instructions });
    write(RECIPES_KEY, recipes);
    form.reset();
    document.querySelector('[data-section="recipes"]').click();
    applyFilters();
  });
}

// Nav switching
function initNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const section = btn.getAttribute('data-section');
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      if (section === 'recipes') document.getElementById('recipes-section').classList.add('active');
      if (section === 'add-recipe') document.getElementById('add-recipe-section').classList.add('active');
      if (section === 'favorites') { document.getElementById('favorites-section').classList.add('active'); renderFavorites(); }
    });
  });
}

// Controls
function initControls() {
  ['search','category-filter','sort-select'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', applyFilters);
    if (el && el.tagName === 'SELECT') el.addEventListener('change', applyFilters);
  });
}

// Boot
window.addEventListener('DOMContentLoaded', () => {
  ensureSeed();
  initNav();
  initControls();
  initAddRecipe();
  applyFilters();
  renderFavorites();
});



