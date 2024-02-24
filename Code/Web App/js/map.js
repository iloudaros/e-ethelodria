$(document).ready(function () {
    var map = L.map('map').setView([39.3622, 22.9424], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // Add Locate Control
    L.control.locate().addTo(map);

    // Fetch markers from the server
    $.ajax({
        url: 'php/get_markers.php',
        method: 'GET',
        success: function (data) {
            var markers = JSON.parse(data);

            markers.forEach(function (marker) {
                L.marker([marker.lat, marker.lng]).addTo(map)
                    .bindPopup(marker.name);
            });
        }
    });
});
