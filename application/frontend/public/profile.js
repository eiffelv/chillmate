document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const profilesList = document.getElementById('profilesList');

    // Load existing profiles from localStorage
    const loadProfiles = () => {
        const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        profilesList.innerHTML = '<h2>Profiles:</h2>';
        profiles.forEach(profile => {
            const profileDiv = document.createElement('div');
            profileDiv.classList.add('profile');
            profileDiv.innerHTML = `
                <h3>${profile.name}</h3>
                <p>${profile.introduction}</p>
            `;
            profilesList.appendChild(profileDiv);
        });
    };

    // Add new profile
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Get form data
        const name = document.getElementById('name').value;
        const introduction = document.getElementById('introduction').value;

        // Create profile object
        const profile = { name, introduction };

        // Get existing profiles from localStorage
        const profiles = JSON.parse(localStorage.getItem('profiles')) || [];
        profiles.push(profile);

        // Save updated profiles to localStorage
        localStorage.setItem('profiles', JSON.stringify(profiles));

        // Reload profiles
        loadProfiles();

        // Reset form
        profileForm.reset();
    });

    // Initial load of profiles
    loadProfiles();
});
