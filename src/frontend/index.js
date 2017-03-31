var FoodMap = undefined

function _initMapForm() {
    document.getElementById("map-form").addEventListener('‌​submit', function(event){event.preventDefault();});
}

function initMap() {
    FoodMap = {}
    FoodMap["directionsService"] = new google.maps.DirectionsService()
    FoodMap["directionsDisplay"] = new google.maps.DirectionsRenderer()
    FoodMap.infoWindows = []
        
    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 41.8781, lng: -87.6298},
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        zoom: 8
    });
    FoodMap.directionsDisplay.setMap(map);
    FoodMap.googleMap = map;

    _initMapForm()
}

function getInfoFromForm() {
    var formElements = document.getElementById('map-form').elements;
    return {
        startingLocation: formElements[0].value,
        endingLocation: formElements[1].value
    }
}

function updateMap() {
    var FoodMap = window.FoodMap;
    if ((typeof FoodMap === undefined)){
        return;
    }

    formData = getInfoFromForm();

    var navigator = new Promise(function(resolve, reject) {
        makeDirections(formData.startingLocation, formData.endingLocation, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                FoodMap.directionsDisplay.setDirections(response);
                resolve(response);
            }
            else {
                reject(status);
            }
        });
    });

    navigator.then(function(response) {
        var suggestedStops = searchForStops(response);
        for (var i=0; i < suggestedStops.length; i++){
            addLocationToMap(suggestedStops[i]);
        }
        return;
    }, function(err) {
        throw new Error('fetching directions failed with status: ' + status);
    });
}

function addLocationToMap(location) {
    var FoodMap = window.FoodMap;
    if ((typeof FoodMap === undefined)){
        return;
    }

    var infoWindowContent = "<div class='info-window'>"
    infoWindowContent += "<h1>Embassy to Flavortown:</h1>"
    infoWindowContent += "<h2>" + location.title + "</h2>"
    infoWindowContent += "<p>" + location.formattedAddress + "</p>"
    infoWindowContent += "<a href='" + location.website + "'>website</a>"
    infoWindowContent += "</div>"

    var infoWindow = new google.maps.InfoWindow({
        content: infoWindowContent
    });

    var markerPosition = {
        lat: +location.address.lat,
        lng: +location.address.lng
    }

    var marker = new google.maps.Marker({
      position: markerPosition,
      title: location.title,
      map: FoodMap.googleMap
    });

    marker.addListener('click', function(){
        FoodMap.infoWindows.map(function(infoWindow){
            infoWindow.close()
        })
        infoWindow.open(FoodMap.googleMap, marker);
    })
    FoodMap.infoWindows.push(infoWindow);
}

function makeDirections(startingLocation, endingLocation, callback) {
    var FoodMap = window.FoodMap;
    if ((typeof FoodMap === undefined)){
        return;
    }

    var request = {
        origin: startingLocation, 
        destination: endingLocation,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    return FoodMap.directionsService.route(request, callback);
}

function getHalfwayPoint(mapResponse) {
    var overview_path = mapResponse.routes[0].overview_path;
    var path_halfway_point = Math.floor(overview_path.length/2);
    var midpoint = {
        latitude: overview_path[path_halfway_point].lat(),
        longitude: overview_path[path_halfway_point].lng()
    };

    return midpoint;
}

function searchForStops(mapResponse) {
    var drivingPath = mapResponse.routes[0].overview_path;

    if ((confirmArrival().flavortown != true) || (!flavortown)) {
        throw new Error('flavortown assets have not loaded');
        return;
    }
    if (typeof haversine === undefined){
        throw new Error('haversine module was not loaded');
        return;
    }

    var checkEvery = 10;
    while((checkEvery*10 / drivingPath.length) > 10) {
        checkEvery = checkEvery * 10;
    }

    var count = checkEvery;
    var result = [];
    while(count < drivingPath.length) {
        var pathPoint = {
            latitude: drivingPath[count].lat(),
            longitude: drivingPath[count].lng()
        }
        var distance = 0;
        var minDistance = minDistanceLocation = undefined;
        for (var i=0; i < flavortown.length; i++){
            var location = flavortown[i]
            var locationLatLng = {
                latitude: +location['address']['lat'],
                longitude: +location['address']['lng']
            };
            distance = haversine(pathPoint, locationLatLng, {unit: 'mile'});
            if (minDistance === undefined || minDistance > distance){
                minDistance = distance;
                minDistanceLocation = location;
            }
        }
        result.push(minDistanceLocation);
        count = count + checkEvery;
    }
    return result;
}

function addAllLocations() {
    FoodMap = window.FoodMap;
    for (var i=0; i < flavortown.length; i++){
        var location = flavortown[i]
        var markerPosition = {
            lat: +location.address.lat,
            lng: +location.address.lng
        }

        var marker = new google.maps.Marker({
          position: markerPosition,
          title: location.title,
          map: FoodMap.googleMap
        });
    }
}