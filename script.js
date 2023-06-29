let map, geocoder, resultContainer, action;
function initializeMap() {
    let mapProperties = {
        zoom: 8,
        center: { lat: 50.625898, lng: 26.200207 }
    }

    map = new google.maps.Map(document.getElementById("map_canvas"), mapProperties);
    geocoder = new google.maps.Geocoder();
    resultContainer = document.getElementById("result_container");
    action = document.getElementById("action");
}

function geocodeAddress() {
    const address = document.getElementById("address").value;

    const request = {
        address: address
    };

    geocoder.geocode(request)
        .then((result) => {
            const { results } = result;
            const formattedAddress = results[0].formatted_address;
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            const resultText = `Address: ${formattedAddress}\nCoordinates: ${lat}, ${lng}`;

            resultContainer.innerText = resultText;
            action.innerText = "Geocoding address";
        })
        .catch((e) => {
            alert("Geocode was not successful for the following reason: " + e);
        });
}