// forumscript.js
document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Get the input values
    const topic = document.getElementById('topic').value;
    const postContent = document.getElementById('postContent').value;

    // Validate inputs
    if (topic.trim() === "" || postContent.trim() === "") {
        alert("Please fill out both fields!");
        return;
    }

    // Create a new list item for the post
    const postItem = document.createElement('li');
    postItem.classList.add('post-item');
    postItem.innerHTML = `
        <div class="post-author">${topic}</div>
        <div class="post-content">${postContent}</div>
    `;

    // Create a like button container
    const likeContainer = document.createElement('div');
    likeContainer.className = 'like-container';

    // Create a like button element
    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.innerHTML = `
        <span class="like-icon">👍</span> 
        <span class="like-text">Like</span>
    `;

    // Add event listener for the like button to toggle the like state
    likeButton.addEventListener('click', function() {
        likeButton.classList.toggle('liked');
        const likeText = likeButton.querySelector('.like-text');
        if (likeButton.classList.contains('liked')) {
            likeText.textContent = 'Liked';
        } else {
            likeText.textContent = 'Like';
        }
    });

    // Append the like button to the like container
    likeContainer.appendChild(likeButton);

    // Append the like container to the post item
    postItem.appendChild(likeContainer);

    // Append the post item to the posts list
    document.getElementById('postsList').appendChild(postItem);

    // Clear the form
    document.getElementById('topic').value = '';
    document.getElementById('postContent').value = '';
});
