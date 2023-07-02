let map, geocoder, resultContainer, action, infoWindow;
function initializeMap() {
    let mapProperties = {
        zoom: 8,
        center: { lat: 50.625898, lng: 26.200207 }
    }

    map = new google.maps.Map(document.getElementById("map_canvas"), mapProperties);
    geocoder = new google.maps.Geocoder();
    resultContainer = document.getElementById("result_container");
    action = document.getElementById("action");

    autocompleteAddress();
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

//add &libraries=places to google script
function autocompleteAddress() {
    const autoAddress = document.getElementById("auto-address");
    const options = {
        fields: ["formatted_address", "geometry", "name"],
        strictBounds: false,
        types: ["establishment"],
    };

    const autocomplete = new google.maps.places.Autocomplete(autoAddress, options);
    autocomplete.bindTo("bounds", map);

    infoWindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");

    infoWindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
        action.innerText = "Auto complete address"
        infoWindow.close();
        marker.setVisible(false);

        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            resultContainer.innerText = "No details available for input: '" + place.name + "'";
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        const resultText = `Name: ${place.name}\nAddress: ${place.formatted_address}\nCoordinates: ${place.geometry.location.lat()}, ${place.geometry.location.lng()}`;
        resultContainer.innerText = resultText;

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent = place.formatted_address;
        infoWindow.open(map, marker);
    })
}

function currentLocation() {
    infoWindow = new google.maps.InfoWindow();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                const marker = new google.maps.Marker({
                    position: pos,
                    map: map
                });

                infoWindow.setPosition(pos);
                infoWindow.setContent("Your current location ");
                infoWindow.open(map, marker);
                map.setCenter(pos);
                map.setZoom(15);

            },
            () => {
                resultContainer.innerText = "Error: The Geolocation service failed.";
            }
        );
    } else {
        // Browser doesn't support Geolocation
        resultContainer.innerText = "Error: Your browser doesn't support geolocation.";

    }
}

