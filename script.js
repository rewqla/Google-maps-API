let map, geocoder, resultContainer, action;
function initializeMap() {
    console.log(navigator.language)
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

    const infowindow = new google.maps.InfoWindow();
    const infowindowContent = document.getElementById("infowindow-content");

    infowindow.setContent(infowindowContent);

    const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
    });

    autocomplete.addListener("place_changed", () => {
        console.log("changed")
        infowindow.close();
        marker.setVisible(false);

        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
            window.alert(
                "No details available for input: '" + place.name + "'"
            );
            return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);
        }

        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent =
            place.formatted_address;
        infowindow.open(map, marker);
    })
}