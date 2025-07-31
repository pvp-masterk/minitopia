document.addEventListener('DOMContentLoaded', function () {
    const supabaseUrl = 'https://rdomgvvjbjfrvkbhjxds.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb21ndnZqYmpmcnZrYmhqeGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjY5NTEsImV4cCI6MjA2OTIwMjk1MX0.3CMfwZ_HocNzkyvuYjvFL3lypZX2JL2kXvk3kL5AB54'; // your anon key
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

    const createBtn = document.getElementById('createBtn');
    const createModal = document.getElementById('createModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const postForm = document.getElementById('postForm');
    const postsGrid = document.querySelector('.posts-grid');
    const activityTimeline = document.querySelector('.activity-timeline');

    // Generate unique 8-character post ID
    function generateId(length = 8) {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    // Load all posts from Supabase
    async function loadPosts() {
        postsGrid.innerHTML = '';
        activityTimeline.innerHTML = '';

        const { data: posts, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error loading posts:', error);
            return;
        }

        posts.forEach(post => {
            const card = createPostCard({
                ...post,
                date: post.created_at,
                excerpt: post.content.substring(0, 150) + '...'
            });
            postsGrid.appendChild(card);

            const activity = createActivityItem({
                date: post.created_at,
                content: `<strong>${post.author}</strong> published: <em>${post.title}</em>`
            });
            activityTimeline.appendChild(activity);
        });
    }

    const user = supabase.auth.getUser();

// Handle sign-in
document.getElementById('loginBtn').addEventListener('click', async () => {
  supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: 'https://minitopia.vercel.app' // Or http://localhost:3000
  }
  )};
});



// Handle sign-out
document.getElementById('logoutBtn').addEventListener('click', async () => {
  await supabase.auth.signOut();
  location.reload();
});

// Update UI on auth state
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session?.user) {
    const user = session.user;
    showUserAvatar(user);
  } else {
    showLoginButton();
  }
});

    function showUserAvatar(user) {
  document.getElementById('loginBtn').classList.add('hidden');
  const avatarUrl = user.user_metadata?.avatar_url || 'default-avatar.png';
  const email = user.email;
  const avatar = document.getElementById('userAvatar');
  const dropdown = document.getElementById('userDropdown');

  avatar.src = avatarUrl;
  document.getElementById('userEmail').textContent = email;

  document.getElementById('userMenu').classList.remove('hidden');

  avatar.addEventListener('click', () => {
    dropdown.classList.toggle('hidden');
  });
}

function showLoginButton() {
  document.getElementById('loginBtn').classList.remove('hidden');
  document.getElementById('userMenu').classList.add('hidden');
}



    // Handle form submission
    postForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('postTitle').value;
        const author = document.getElementById('postAuthor').value;
        const category = document.getElementById('postCategory').value;
        const content = document.getElementById('postContent').innerHTML;
        const image = document.getElementById('postImage').value || 'https://via.placeholder.com/600x400?text=6b6t+Blog';
        const newId = generateId();

        const { error } = await supabase.from('posts').insert([
  {
    post_id: newId, // ✅ use post_id, NOT id
    title,
    author,
    category,
    content,
    image
  }
]);

        window.location.href = `post.html?post_id=${newId}`;


        if (error) {
            alert('Error publishing post!');
            console.error(error);
            return;
        }

        await loadPosts();
        postForm.reset();
        document.getElementById('postContent').innerHTML = '';
        createModal.classList.remove('active');
        alert('Post published successfully!');
        window.location.href = `post.html?post_id=${newId}`;
    });

    // Create post card
    function createPostCard(post) {
        const card = document.createElement('article');
        card.className = 'post-card glass';
        card.innerHTML = `
            <img src="${post.image}" alt="${post.title}" class="post-card-image">
            <div class="post-card-content">
                <span class="post-card-category">${getCategoryName(post.category)}</span>
                <h3 class="post-card-title">${post.title}</h3>
                <div class="post-card-meta">
                    <span>By ${post.author}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
                <p class="post-card-excerpt">${post.excerpt}</p>
            </div>`;
        card.addEventListener('click', () => {
            window.location.href = `post.html?post_id=${post.id}`;
        });
        return card;
    }

    // Create activity item
    function createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-date">${formatDate(activity.date)}</div>
            <div class="timeline-content glass">${activity.content}</div>`;
        return item;
    }

    function formatDate(dateString) {
        return new Date(dateString).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function getCategoryName(category) {
        const categories = {
            story: 'Survival Story',
            base: 'Base Showcase',
            guide: 'Guide',
            event: 'Server Event',
            other: 'Other'
        };
        return categories[category] || 'Unknown';
    }

    // Modal controls
    createBtn.addEventListener('click', async () => {
  const session = await supabase.auth.getSession();
  if (!session.data.session) {
    alert('You must be logged in to create a post.');
    return;
  }
  createModal.classList.add('active');
});
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => createModal.classList.remove('active')));
    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) createModal.classList.remove('active');
    });

    // Hero scroll
    document.querySelector('.hero-scroll').addEventListener('click', () => {
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    });

    // Rich text shortcuts
    document.addEventListener('keydown', function (e) {
        const editor = document.getElementById('postContent');
        if (document.activeElement === editor) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault(); document.execCommand('bold');
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault(); document.execCommand('italic');
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault(); document.execCommand('underline');
            }
        }
    });

    // Load everything
    loadPosts();
});
