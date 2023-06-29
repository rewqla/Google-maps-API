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
        })
        .catch((error) => resultContainer.innerText = "The address geocoder failed due to: " + error)
        .finally(() => action.innerText = "Geocoding coordinates");
    ;
}

function geocodeCoordinates() {
    const coordinates = document.getElementById("coordinates").value;
    const latlngStr = coordinates.split(",", 2);

    const location = {
        lat: parseFloat(latlngStr[0]),
        lng: parseFloat(latlngStr[1]),
    }

    geocoder.geocode({ location: location })
        .then((response) => {
            const { results } = response;
            if (results[0]) {
                const formattedAddress = results[0].formatted_address;
                const resultText = `Address: ${formattedAddress}\nCoordinates: ${location.lat}, ${location.lng}`;

                resultContainer.innerText = resultText;
            } else {
                resultContainer.innerText = "No results found";
            }
        })
        .catch((error) => resultContainer.innerText = "The coordinates geocoder failed due to: " + error)
        .finally(() => action.innerText = "Geocoding coordinates");
}