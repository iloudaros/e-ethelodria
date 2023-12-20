document.addEventListener('DOMContentLoaded', function () {
    // Default coordinates for Patras, Greece
    const patrasCoordinates = [38.2466, 21.7346];

    // Initialize the map
    const map = L.map('map').setView(patrasCoordinates, 13);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add a marker at the default location
    L.marker(patrasCoordinates).addTo(map)
        .bindPopup('Welcome to Patras, Greece!')
        .openPopup();
});
