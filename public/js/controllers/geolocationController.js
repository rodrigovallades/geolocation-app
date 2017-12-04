geolocationapp.controller('GeolocationController', ['$scope', '$http', '$routeParams', 'LocateService', '$timeout',
	function($scope, $http, $routeParams, LocateService, $timeout) {
	
	var mapCanvas = document.getElementById('map');	
	var map = new google.maps.Map(mapCanvas, {				
		zoom: 3		
	});
	
	var user_location = {};	// simple user LatLng object
	var markersLatLng = []; // simple LatLng array
	var map_markers = []; // google maps marker array

	$scope.queryTitle = '';
	$scope.showMap = false;
	$scope.message = {};
	$scope.url = 'www.nytimes.com';
	$scope.query = new Query();

	if($routeParams.url) {
		getSiteLocation($routeParams.url);
	}

	function Query(city, country_code, country_name, ip, latitude, longitude, metro_code, region_code, region_name, time_zone, zip_code) {
		this.city = city || "";
		this.country_code = country_code || "";
		this.country_name = country_name || "";
		this.ip = ip || "0.0.0.0";
		this.latitude = latitude || "";
		this.longitude = longitude || "";
		this.metro_code = metro_code || "";
		this.region_code = region_code || "";
		this.region_name = region_name || "";
		this.time_zone = time_zone || "";
		this.zip_code = zip_code || "";
	};

	function getMyLocation() {	
		LocateService.LocateUser()
		.success(function(response){				
			//console.log(response);			
			fillLocationDetails(response, true);
            updateMap(response, true);
			showMessage(this.message, this.messageType);						
		})
		.error(function(error){
			showMessage(this.message, this.messageType);
		});		
	};

	function getSiteLocation(url) {
		url = url || $scope.url;
		LocateService.LocateURL(url)
		.success(function(response){						
			//console.log(response);
			fillLocationDetails(response, false);
			updateMap(response, false);
			showMessage(this.message, this.messageType);			
		})
		.error(function(error){
			showMessage(this.message, this.messageType);
		});
	};

	function resetLocation() {
		if (user_location) {
			var userLatLng = new google.maps.LatLng(user_location);
			// find with Google Maps Marker is the user location
			for (var i = 0; i < map_markers.length; i++ ) {				
				if (map_markers[i].getPosition().lat() == userLatLng.lat()) {					
					// hide marker from the map
					map_markers[i].setMap(null);
				}
				// remove marker from marker objects array
				map_markers.splice(i, 1);
			}
			// remove marker from simple markersLatLng array
			markersLatLng = _.reject(markersLatLng, user_location);
		}
		updateMap();
	}

	function showMessage(message, messageType) {
		$scope.message.text = message;
		$scope.message.type = messageType;
	}

    function addMarker(map, LatLng) {
		// don't add duplicates
		if (!_.find(markersLatLng, LatLng)) {			
			var marker = new google.maps.Marker({  
				position: LatLng,  
				map: map  
			});
			markersLatLng.push(LatLng);
			map_markers.push(marker);
		}
		//console.log(markersLatLng);
		//console.log(map_markers);
	}

	function fillLocationDetails(details, queryType) {
		$scope.query = details;		
		$scope.queryTitle = queryType ? 'User location' : $scope.url;
	}
	
	function updateMap(data, isUser) {	
		if (data) {
			var myLatLng = { lat: data.latitude, lng: data.longitude };
			if (isUser) {
				user_location = myLatLng;
			}
			var myLatLng = { lat: data.latitude, lng: data.longitude };			
			map.setOptions({
				zoom: 3,
				center: myLatLng
			})
			addMarker(map, myLatLng);
			$scope.showMap = true;
		} else {			
			if (map_markers.length === 0) {
				$scope.showMap = false;
			} else if ($scope.url){
				getSiteLocation();
			}
		}		
	};

	$scope.messageClass = function() {
		return $scope.message.type == 'success' ? 'info' : 'danger';
	}

	$scope.getMyLocation = getMyLocation;
	$scope.getSiteLocation = getSiteLocation;
	$scope.resetLocation = resetLocation;	

}]);
