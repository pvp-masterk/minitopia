document.addEventListener('DOMContentLoaded', function () {
    const supabaseUrl = 'https://rdomgvvjbjfrvkbhjxds.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkb21ndnZqYmpmcnZrYmhqeGRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM2MjY5NTEsImV4cCI6MjA2OTIwMjk1MX0.3CMfwZ_HocNzkyvuYjvFL3lypZX2JL2kXvk3kL5AB54';
    const supabase = supabase.createClient(supabaseUrl, supabaseKey);
    // Sample data for posts (in a real app, this would come from a database)
    const samplePosts = [
        {
            id: 1,
            title: "My First Month on 6b6t",
            author: "AnarchyPlayer",
            date: "2023-05-15",
            category: "story",
            excerpt: "Surviving the first month on 6b6t was harder than I expected. Here's my story of betrayal, survival, and eventually finding a group to call home.",
            image: "https://via.placeholder.com/600x400?text=6b6t+Survival"
        },
        {
            id: 2,
            title: "How to Avoid Griefers",
            author: "BaseProtector",
            date: "2023-05-10",
            category: "guide",
            excerpt: "After losing 3 bases to griefers, I've learned some valuable lessons about hiding your base and protecting your items.",
            image: "https://via.placeholder.com/600x400?text=Griefer+Protection"
        },
        {
            id: 3,
            title: "The Great Spawn War",
            author: "PvPKing",
            date: "2023-05-05",
            category: "event",
            excerpt: "Yesterday's massive PvP battle at spawn was one for the history books. Here's my account of the chaos.",
            image: "https://via.placeholder.com/600x400?text=Spawn+War"
        },
        {
            id: 4,
            title: "Hidden Base Designs",
            author: "Architect",
            date: "2023-04-28",
            category: "guide",
            excerpt: "Creative ways to hide your base that most players won't think to check. Includes redstone contraptions and natural camouflage.",
            image: "https://via.placeholder.com/600x400?text=Hidden+Base"
        },
        {
            id: 5,
            title: "The End Exit Portal Trap",
            author: "TrapMaster",
            date: "2023-04-20",
            category: "guide",
            excerpt: "How I trapped the End exit portal and what I learned from the experience. Over 50 players fell for it before it was discovered!",
            image: "https://via.placeholder.com/600x400?text=End+Trap"
        },
        {
            id: 6,
            title: "Finding the World Border",
            author: "Explorer",
            date: "2023-04-15",
            category: "story",
            excerpt: "My journey to reach the world border and what I found along the way. Includes coordinates of interesting landmarks.",
            image: "https://via.placeholder.com/600x400?text=World+Border"
        }
    ];

    // Sample activity data
    const sampleActivity = [
        {
            date: "2023-05-16",
            content: "New player <strong>NoobSlayer</strong> joined the server for the first time."
        },
        {
            date: "2023-05-15",
            content: "<strong>AnarchyPlayer</strong> published a new post: <em>My First Month on 6b6t</em>"
        },
        {
            date: "2023-05-14",
            content: "Massive PvP battle at spawn with over 30 participants."
        },
        {
            date: "2023-05-12",
            content: "<strong>TrapMaster</strong>'s End portal trap was discovered and disabled."
        },
        {
            date: "2023-05-10",
            content: "<strong>BaseProtector</strong> published a new guide: <em>How to Avoid Griefers</em>"
        }
    ];

    // DOM Elements
    const createBtn = document.getElementById('createBtn');
    const createModal = document.getElementById('createModal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const postForm = document.getElementById('postForm');
    const postsGrid = document.querySelector('.posts-grid');
    const activityTimeline = document.querySelector('.activity-timeline');

    // Load sample data
    async function loadSampleData() {
    // Clear grids
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
        const postCard = createPostCard({
            ...post,
            date: post.created_at,
            excerpt: post.content.substring(0, 150) + '...'
        });
        postsGrid.appendChild(postCard);
    });

    // Optionally generate sample activity from posts
    posts.slice(0, 5).forEach(post => {
        const activityItem = createActivityItem({
            date: post.created_at,
            content: `<strong>${post.author}</strong> published: <em>${post.title}</em>`
        });
        activityTimeline.appendChild(activityItem);
    });
}


    // Create post card element
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
            </div>
        `;
        
        // Add click event to view post (in a real app, this would open the full post)
        card.addEventListener('click', () => {
            alert(`Viewing post: ${post.title}\n\nIn a real application, this would open the full post page.`);
        });
        
        return card;
    }

    // Create activity timeline item
    function createActivityItem(activity) {
        const item = document.createElement('div');
        item.className = 'timeline-item';
        item.innerHTML = `
            <div class="timeline-date">${formatDate(activity.date)}</div>
            <div class="timeline-content glass">${activity.content}</div>
        `;
        return item;
    }

    // Helper function to format date
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Helper function to get category name
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

    // Modal functionality
    createBtn.addEventListener('click', () => {
        createModal.classList.add('active');
    });

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            createModal.classList.remove('active');
        });
    });

    // Close modal when clicking outside
    createModal.addEventListener('click', (e) => {
        if (e.target === createModal) {
            createModal.classList.remove('active');
        }
    });

    // Form submission
    postForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('postTitle').value;
    const author = document.getElementById('postAuthor').value;
    const category = document.getElementById('postCategory').value;
    const content = document.getElementById('postContent').innerHTML;
    const image = document.getElementById('postImage').value || 'https://via.placeholder.com/600x400?text=6b6t+Blog';

    const { error } = await supabase.from('posts').insert([
        {
            title,
            author,
            category,
            content,
            image
        }
    ]);

    if (error) {
        alert('Error publishing post!');
        console.error(error);
        return;
    }

    // Reload posts
    loadSampleData();

    // Reset form
    postForm.reset();
    document.getElementById('postContent').innerHTML = '';
    createModal.classList.remove('active');
    alert('Post published successfully!');
});

        

    // Simple rich text editor functionality for the content area
    document.addEventListener('keydown', function(e) {
        const editor = document.getElementById('postContent');
        if (document.activeElement === editor) {
            // Check for Ctrl/Command + B for bold
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                document.execCommand('bold', false, null);
            }
            // Check for Ctrl/Command + I for italic
            if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
                e.preventDefault();
                document.execCommand('italic', false, null);
            }
            // Check for Ctrl/Command + U for underline
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                document.execCommand('underline', false, null);
            }
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Hero scroll button
    document.querySelector('.hero-scroll').addEventListener('click', () => {
        document.querySelector('.container').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // Initialize the page
    loadSampleData();
});
