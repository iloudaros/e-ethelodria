$(document).ready(function () {
    var map = L.map('map').setView([39.3622, 22.9424], 13); // Default location: Volos, Greece

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.control.locate({
        strings: {
          title: "Show me where I am, yo!"
        }
      })
      .addTo(map);

    // Fetch markers' coordinates from the server
    $.ajax({
        url: 'php/get_markers.php',
        method: 'GET',
        dataType: 'json',
        success: addMarkers(data),
        error: console.error('Error fetching markers:', error);
        });



    function addMarkers(markers) {
        markers.forEach(function (marker) {
            L.marker([marker.lat, marker.lng]).addTo(map)
                .bindPopup(marker.name);
        });
    }


});
