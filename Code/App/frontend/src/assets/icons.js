import L from 'leaflet';

// Ειδικά Εικονίδια για το Leaflet

export const icons ={
    // Εικόνα για την βάση
        baseIcon : L.icon({
        iconUrl: require('./icon_pngs/base.png'),
        iconSize: [64, 64],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για τον διασώστη
    rescueIcon : L.icon({
        iconUrl: require('./icon_pngs/rescuer.png'),
        icon_pngsize: [50, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για τα αιτήματα
        requestIcon : L.icon({
        iconUrl: require('./icon_pngs/request.png'),
        icon_pngsize: [50, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για αναληφθέντα αιτήματα
        requestIcon : L.icon({
        iconUrl: require('./icon_pngs/request_ok.png'),
        icon_pngsize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για τους εθελοντές
        volunteerIcon : L.icon({
        iconUrl: require('./icon_pngs/volunteer.png'),
        icon_pngsize: [50, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για αναληφθήσα προσφορά
        offerIcon : L.icon({
        iconUrl: require('./icon_pngs/volunteer_ok.png'),
        icon_pngsize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    })};
    
    