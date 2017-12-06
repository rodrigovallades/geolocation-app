geolocationapp.controller('GeolocationController', ['$scope', '$http', '$routeParams', 'LocateService', '$timeout',
	function($scope, $http, $routeParams, LocateService, $timeout) {
	
	var mapCanvas = document.getElementById('map');	
	var map = new google.maps.Map(mapCanvas, {				
		zoom: 8		
	});
	
	var user_location = {};	// simple user LatLng object
	var markersLatLng = []; // simple LatLng array
	var map_markers = []; // google maps marker array

	$scope.queryTitle = '';
	$scope.showMap = false;
	$scope.message = {};
	$scope.url = '';
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
            addMarker(response, true);
			showMessage(this.message, this.messageType);						
		})
		.error(function(error){
			showMessage(this.message, this.messageType);
		});		
	};

	function getSiteLocation(url) {
		url = url || $scope.url;
		if (!validateURL(url)) {			
			return;
		};
		LocateService.LocateURL(url)
		.success(function(response){						
			//console.log(response);
			fillLocationDetails(response, false);
			addMarker(response, false);
			showMessage(this.message, this.messageType);			
		})
		.error(function(error){
			showMessage(this.message, this.messageType);
		});
	};

    function addMarker(data, isUser) {
		// don't add duplicates		
		var LatLng = { lat: data.latitude, lng: data.longitude };
		if (!_.find(markersLatLng, LatLng)) {
			var marker = new google.maps.Marker({  
				position: LatLng,
				map: map				
			});
			var infowindow = new google.maps.InfoWindow();

			if (isUser) {
				user_location = LatLng;
				marker.setIcon('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
				infowindow.setContent('Your location');
			} else if ($scope.url) {
				marker.setIcon('http://maps.google.com/mapfiles/ms/icons/red-dot.png')
				infowindow.setContent($scope.url);
			}

			markersLatLng.push(LatLng);
			map_markers.push(marker);
			infowindow.open(map, marker);
		}
		updateMap();
	}

	function updateMap(isUser) {
		$scope.showMap = true;
		if (map_markers.length === 0) {
			$scope.showMap = false;
		} else if (map_markers.length > 1) {
			var bounds = new google.maps.LatLngBounds();			
			for (var i in map_markers) {
			bounds.extend(map_markers[i].getPosition());
			}
			map.fitBounds(bounds);
		} else if (map_markers.length === 1) {
			map.panTo(map_markers[0].getPosition());
			map.setOptions({
				zoom: 8
			});
		}
	};

	function validateURL(url) {
		var regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;		
		check = regex.test(url);
		if (!check) {
			showMessage('Invalid URL', 'error');
		}
		return check;	
	};

	function resetLocation() {
		if (user_location) {
			var userLatLng = new google.maps.LatLng(user_location);
			// find with Google Maps Marker is the user location
			var userMarker_idx;
			for (var i = 0; i < map_markers.length; i++ ) {				
				if (map_markers[i].getPosition().lat() == userLatLng.lat() && map_markers[i].getPosition().lng() == userLatLng.lng()) {					
					// hide marker from the map
					map_markers[i].setMap(null);					
					userMarker_idx = i;
				}				
			}
			// remove marker from simple markersLatLng array			
			markersLatLng = _.reject(markersLatLng, user_location);
			// remove marker from marker objects array
			map_markers.splice(userMarker_idx, 1);
		}
		updateMap();
	}

	function showMessage(message, messageType) {
		$scope.message.text = message;
		$scope.message.type = messageType;
	}

	function fillLocationDetails(details, queryType) {
		$scope.query = details;		
		$scope.queryTitle = queryType ? 'User location' : $scope.url;
	}

	$scope.messageClass = function() {
		return $scope.message.type == 'success' ? 'info' : 'danger';
	}

	$scope.getMyLocation = getMyLocation;
	$scope.getSiteLocation = getSiteLocation;
	$scope.resetLocation = resetLocation;	
	$scope.validateURL = validateURL;	

}]);
