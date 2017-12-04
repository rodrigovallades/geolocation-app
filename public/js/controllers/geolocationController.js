geolocationapp.controller('GeolocationController', ['$scope', '$http', '$routeParams', 'LocateService', '$timeout',
	function($scope, $http, $routeParams, LocateService, $timeout) {
	
	var mapCanvas = document.getElementById('map');	
	var map_markers = [];
	var user_location = {};	
	
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
			console.log(response);			
			fillLocationDetails(response);
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
			console.log(response);
			fillLocationDetails(response);
			updateMap(response, true);
			showMessage(this.message, this.messageType);			
		})
		.error(function(error){
			showMessage(this.message, this.messageType);
		});
	};

	function resetLocation() {
		map_markers = _.reject(map_markers, user_location);
		fillLocationDetails(new Query());
		updateMap();
	}

	function showMessage(message, messageType) {
		$scope.message.text = message;
		$scope.message.type = messageType;
	}

    function addMarker(map, LatLng) {
		if (!_.find(map_markers, LatLng)) {
			map_markers.push(LatLng);
		}
		if (map_markers.length) {			
			for (var i = 0; i <= map_markers.length; i++) {
				var marker = new google.maps.Marker({
					position: map_markers[i],
					map: map				
				});				
			}		            
		}
	}

	function fillLocationDetails(details) {
		$scope.query = details;
	}
	
	function updateMap(data, isUser) {	
		if (data) {
			var myLatLng = { lat: data.latitude, lng: data.longitude };
			if (isUser) {
				user_location = myLatLng;
			}
			var map = new google.maps.Map(mapCanvas, {				
				zoom: 3,
				center: myLatLng
			});			
			addMarker(map, myLatLng);
			$scope.showMap = true;
		} else {
			if (map_markers.length === 0) {
				$scope.showMap = false;
			} else if (!$scope.url){
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
