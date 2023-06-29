
function initializeMap() {
    let mapProperties = {
        zoom: 8,
        center: { lat: 50.625898, lng: 26.200207 }
    }

    let map = new google.maps.Map(document.getElementById("map_canvas"), mapProperties);
}
