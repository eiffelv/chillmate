// Simulating user authentication
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logout');
const loginFormContainer = document.getElementById('login-form');
const homeContainer = document.getElementById('home');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // You can add authentication logic here
    const username = document.getElementById('username').value;
    
    if (username) {
        alert(`Welcome, ${username}! You are now logged in.`);
        
        // Show logout and hide login form
        logoutBtn.style.display = 'inline';
        loginFormContainer.style.display = 'none';
        homeContainer.style.display = 'block';
    }
});

logoutBtn.addEventListener('click', function() {
    alert('You have logged out.');
    
    // Hide logout and show login form
    logoutBtn.style.display = 'none';
    loginFormContainer.style.display = 'block';
    homeContainer.style.display = 'none';
});

// Real-time password validation for registration form
document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const passwordError = document.getElementById("passwordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");
    const registerForm = document.getElementById("registerForm");

    // Function to validate the password
    function validatePassword() {
        const passwordValue = passwordInput.value;
        const passwordPattern = /(?=.*[A-Z]).{8,}/; // At least one uppercase letter and 8 characters long

        if (!passwordPattern.test(passwordValue)) {
            passwordError.style.display = "block";
            return false; // Invalid password
        } else {
            passwordError.style.display = "none";
            return true; // Valid password
        }
    }

    // Function to check if passwords match
    function validateConfirmPassword() {
        if (passwordInput.value !== confirmPasswordInput.value) {
            confirmPasswordError.style.display = "block";
            return false; // Passwords do not match
        } else {
            confirmPasswordError.style.display = "none";
            return true; // Passwords match
        }
    }

    // Validate password on form submission
    registerForm.addEventListener("submit", function(event) {
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();

        if (!isPasswordValid || !isConfirmPasswordValid) {
            event.preventDefault(); // Stop form submission if validation fails
        }
    });

    // Optional: Validate password and confirm password in real-time as user types
    passwordInput.addEventListener("input", validatePassword);
    confirmPasswordInput.addEventListener("input", validateConfirmPassword);
});

document.getElementById('postForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the values of topic and post content
    const topic = document.getElementById('topic').value;
    const content = document.getElementById('postContent').value;

    // Create a new post
    const postItem = document.createElement('li');
    postItem.className = 'post-item';

    const postTopic = document.createElement('h3');
    postTopic.textContent = topic;

    const postContent = document.createElement('p');
    postContent.textContent = content;

    // Create a like button for each post
    const likeContainer = document.createElement('div');
    likeContainer.className = 'like-container';

    const likeButton = document.createElement('button');
    likeButton.className = 'like-btn';
    likeButton.innerHTML = '<span class="like-icon">👍</span> <span class="like-text">Like</span>';
    
    // Add click event to toggle like state
    likeButton.addEventListener('click', function() {
        likeButton.classList.toggle('liked');
        const likeText = likeButton.querySelector('.like-text');
        if (likeButton.classList.contains('liked')) {
            likeText.textContent = 'Liked';
        } else {
            likeText.textContent = 'Like';
        }
    });

    likeContainer.appendChild(likeButton);

    // Append the post topic, content, and like button to the post item
    postItem.appendChild(postTopic);
    postItem.appendChild(postContent);
    postItem.appendChild(likeContainer);

    // Append the post item to the posts list
    document.getElementById('postsList').appendChild(postItem);

    // Clear the form fields after submitting
    document.getElementById('topic').value = '';
    document.getElementById('postContent').value = '';
});