document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader');
    const errorEl = document.getElementById('error');
    const threadContainer = document.getElementById('thread-container');
    const threadTitleEl = document.getElementById('thread-title');
    const postsContainer = document.getElementById('posts-container');

    const params = new URLSearchParams(window.location.search);
    const threadId = params.get('threadId');
    const forumUrl = params.get('url'); // Предполагаем, что URL тоже передается

    if (!threadId || !forumUrl) {
        loader.classList.add('hidden');
        errorEl.textContent = 'Ошибка: Необходимые параметры (threadId, url) отсутствуют.';
        errorEl.classList.remove('hidden');
        return;
    }

    // URL вашего API
    const apiUrl = `http://localhost:5150/api/threads/${threadId}?url=${encodeURIComponent(forumUrl)}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loader.classList.add('hidden');
            threadTitleEl.textContent = data.title;

            data.posts.forEach(post => {
                const postEl = document.createElement('div');
                postEl.className = 'post';

                const authorEl = document.createElement('div');
                authorEl.className = 'post-author';
                authorEl.textContent = post.authorName;

                const timestampEl = document.createElement('div');
                timestampEl.className = 'post-timestamp';
                timestampEl.textContent = new Date(post.timestamp).toLocaleString('ru-RU');

                const contentEl = document.createElement('div');
                contentEl.className = 'post-content';
                contentEl.innerHTML = post.contentHtml;

                postEl.appendChild(authorEl);
                postEl.appendChild(timestampEl);
                postEl.appendChild(contentEl);
                postsContainer.appendChild(postEl);
            });

            threadContainer.classList.remove('hidden');
        })
        .catch(error => {
            console.error('Fetch error:', error);
            loader.classList.add('hidden');
            errorEl.classList.remove('hidden');
        });
});