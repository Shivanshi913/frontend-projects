// Simple localStorage-backed blog engine
// Data shape:
// post: { id, title, content, category, tags: string[], createdAt:number, comments: Comment[] }
// comment: { id, author, text, createdAt:number }

(function(){
  const STORAGE_KEY = 'techblog_posts_v1';

  function readPosts(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); } catch { return []; }
  }
  function writePosts(posts){ localStorage.setItem(STORAGE_KEY, JSON.stringify(posts)); }

  function ensureSeed(){
    const posts = readPosts();
    if (posts.length === 0) {
      const now = Date.now();
      const seeded = [
        {
          id: cryptoRandomId(),
          title: 'Welcome to TechBlog',
          category: 'General',
          tags: ['welcome','getting-started'],
          content: 'This is a simple blog powered by localStorage. Create your first post using the Write page!\n\nUse categories and tags to organize your content.',
          createdAt: now - 1000 * 60 * 60 * 24,
          comments: [
            { id: cryptoRandomId(), author: 'Admin', text: 'Feel free to leave a comment!', createdAt: now - 1000 * 60 * 60 * 12 }
          ]
        },
        {
          id: cryptoRandomId(),
          title: 'JavaScript Tips for Beginners',
          category: 'Programming',
          tags: ['javascript','tips'],
          content: 'Here are a few practical tips to improve your JS skills...\n\n1) Read the MDN docs\n2) Practice daily\n3) Build small projects',
          createdAt: now - 1000 * 60 * 60 * 6,
          comments: []
        }
      ];
      writePosts(seeded);
    }
  }

  function cryptoRandomId(){
    if (window.crypto && crypto.getRandomValues) {
      const buf = new Uint8Array(8); crypto.getRandomValues(buf);
      return Array.from(buf).map(b=>b.toString(16).padStart(2,'0')).join('');
    }
    return Math.random().toString(36).slice(2, 10);
  }

  function formatDate(ts){
    const d = new Date(ts);
    return d.toLocaleString();
  }

  function uniqueSorted(arr){
    return Array.from(new Set(arr)).sort((a,b)=> a.localeCompare(b));
  }

  function getAllCategories(posts){
    return uniqueSorted(posts.map(p=>p.category).filter(Boolean));
  }
  function getAllTags(posts){
    return uniqueSorted(posts.flatMap(p=>p.tags||[]).filter(Boolean));
  }

  // Page routers
  document.addEventListener('DOMContentLoaded', () => {
    ensureSeed();
    const page = document.body.getAttribute('data-page');
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    switch(page){
      case 'home': initHome(); break;
      case 'new': initNew(); break;
      case 'post': initPost(); break;
    }
  });

  // Home page
  function initHome(){
    const posts = readPosts().sort((a,b)=> b.createdAt - a.createdAt);

    const search = document.getElementById('search');
    const categoryFilter = document.getElementById('categoryFilter');
    const tagFilter = document.getElementById('tagFilter');
    const list = document.getElementById('postsList');

    // Populate categories
    getAllCategories(posts).forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat; categoryFilter.appendChild(opt);
    });

    function render(){
      const q = (search.value || '').toLowerCase().trim();
      const cat = (categoryFilter.value || '').trim();
      const tagsRaw = (tagFilter.value || '').toLowerCase().split(',').map(s=>s.trim()).filter(Boolean);

      const filtered = posts.filter(p => {
        const matchesQuery = !q || [p.title, p.content, p.category, (p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
        const matchesCat = !cat || p.category === cat;
        const matchesTags = tagsRaw.length === 0 || tagsRaw.every(t => (p.tags||[]).map(x=>x.toLowerCase()).includes(t));
        return matchesQuery && matchesCat && matchesTags;
      });

      list.innerHTML = '';
      if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.textContent = 'No posts found.';
        empty.style.color = '#64748b';
        list.appendChild(empty);
        return;
      }

      filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'post-card';
        const href = `post.html?id=${encodeURIComponent(p.id)}`;
        card.innerHTML = `
          <h3><a href="${href}">${escapeHtml(p.title)}</a></h3>
          <div class="meta">${escapeHtml(p.category || 'Uncategorized')} • ${formatDate(p.createdAt)}</div>
          <p>${escapeHtml((p.content||'').slice(0, 140))}${p.content.length > 140 ? '...' : ''}</p>
          <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
        `;
        list.appendChild(card);
      });
    }

    [search, categoryFilter, tagFilter].forEach(el => el && el.addEventListener('input', render));
    render();
  }

  // New post page
  function initNew(){
    const form = document.getElementById('postForm');
    const catList = document.getElementById('categoryList');
    const posts = readPosts();
    getAllCategories(posts).forEach(cat => {
      const o = document.createElement('option'); o.value = cat; catList.appendChild(o);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = String(fd.get('title')||'').trim();
      const category = String(fd.get('category')||'').trim() || 'Uncategorized';
      const tags = String(fd.get('tags')||'').split(',').map(s=>s.trim()).filter(Boolean);
      const content = String(fd.get('content')||'').trim();

      if (!title || !content) { alert('Title and content are required.'); return; }

      const newPost = {
        id: cryptoRandomId(),
        title, category, tags, content,
        createdAt: Date.now(),
        comments: []
      };
      const all = readPosts();
      all.push(newPost);
      writePosts(all);
      window.location.href = `post.html?id=${encodeURIComponent(newPost.id)}`;
    });
  }

  // Post detail page
  function initPost(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const posts = readPosts();
    const post = posts.find(p => p.id === id);
    if (!post) { window.location.href = 'blog.html'; return; }

    const titleEl = document.getElementById('postTitle');
    const metaEl = document.getElementById('postMeta');
    const tagsEl = document.getElementById('postTags');
    const contentEl = document.getElementById('postContent');
    const listEl = document.getElementById('commentsList');
    const form = document.getElementById('commentForm');

    titleEl.textContent = post.title;
    metaEl.textContent = `${post.category || 'Uncategorized'} • ${formatDate(post.createdAt)}`;
    tagsEl.innerHTML = (post.tags||[]).map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('');
    contentEl.textContent = post.content;

    function renderComments(){
      listEl.innerHTML = '';
      if (!post.comments || post.comments.length === 0) {
        const empty = document.createElement('div');
        empty.textContent = 'No comments yet.'; empty.style.color = '#64748b';
        listEl.appendChild(empty); return;
      }
      post.comments.sort((a,b)=> a.createdAt - b.createdAt).forEach(c => {
        const el = document.createElement('div');
        el.className = 'comment';
        el.innerHTML = `
          <div class="meta">${escapeHtml(c.author || 'Anonymous')} • ${formatDate(c.createdAt)}</div>
          <div>${escapeHtml(c.text)}</div>
          <div class="actions"><button class="btn secondary" data-del="${c.id}">Delete</button></div>
        `;
        listEl.appendChild(el);
      });

      listEl.querySelectorAll('button[data-del]').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid = btn.getAttribute('data-del');
          post.comments = post.comments.filter(c => c.id !== cid);
          writePosts(posts);
          renderComments();
        });
      });
    }
    renderComments();

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const author = String(fd.get('author')||'').trim() || 'Anonymous';
      const text = String(fd.get('text')||'').trim();
      if (!text) { alert('Please write a comment.'); return; }
      post.comments = post.comments || [];
      post.comments.push({ id: cryptoRandomId(), author, text, createdAt: Date.now() });
      writePosts(posts);
      form.reset();
      renderComments();
    });
  }

  function escapeHtml(str){
    return String(str)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#39;');
  }
})();


