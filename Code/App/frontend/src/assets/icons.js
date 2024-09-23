import L from 'leaflet';
import './icons.css';

// Εικόνα για τα cluster
import offerClusterIcon from './icon_pngs/offerCluster.png';
import requestClusterIcon from './icon_pngs/requestCluster.png';
import multiClusterIcon from './icon_pngs/multiCluster.png';

import './icons.css';

export const icons = {
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
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για τα αιτήματα
    requestIcon : L.icon({
        iconUrl: require('./icon_pngs/request.png'),
        iconSize: [50, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για αναληφθέντα αιτήματα
    requestIconOk : L.icon({
        iconUrl: require('./icon_pngs/request_ok.png'),
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για τους εθελοντές
    offerIcon : L.icon({
        iconUrl: require('./icon_pngs/volunteer.png'),
        iconSize: [50, 50],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για αναληφθήσα προσφορά
    offerIconOk : L.icon({
        iconUrl: require('./icon_pngs/volunteer_ok.png'),
        iconSize: [40, 40],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    }),
    
    // Εικόνα για cluster αιτημάτων 
    requestClusterIcon: function (cluster) {
        console.log('___Creating request cluster icon'); // Log to verify function call
        return L.divIcon({
            html: `<img src="${requestClusterIcon}" style="width: 40px; height: 40px;" />`,
            className: 'custom-cluster-icon',
            iconSize: L.point(40, 40, true)
        });
    },
    
    
    // Εικόνα για cluster προσφορών
    offerClusterIcon: function (cluster) {
        return L.divIcon({
            html: `<img src="${offerClusterIcon}" style="width: 40px; height: 40px;" />`,
            iconSize: L.point(40, 40, true)
        })
    },
    
    //Εικόνα για μικτό cluster
    multiClusterIcon: function (cluster) {
        return L.divIcon({
            html: `<img src="${multiClusterIcon}" style="width: 40px; height: 40px;" />`,
            iconSize: L.point(40, 40, true)
        })
    }
    
};

