geolocationapp.factory("LocateService", ['$http', function($http){

        var api_url = "http://freegeoip.net/json/";
    
        return {
            message: '',
            messageType: '',
            LocateUser: function() {
                return $http.get(api_url)
                .success(function(response){
                    this.message = 'Location "'+ response.ip + '" retrieved.';
                    this.messageType = 'success';
                    return response;
                })
                .error(function(error){
                    this.message = 'Error retrieving user location.';
                    this.messageType = 'error';
                    return error;
                });
            },
            LocateURL: function(url) {                
                return $http.get(api_url + url)
                .success(function(response){
                    this.message = 'Retrieved location from "'+ url + '".';
                    this.messageType = 'success';
                    return response;
                })
                .error(function(error){
                    this.message = 'Error retrieving location from URL.';
                    this.messageType = 'error';
                    return error;
                });                       
            },
        }

    }]);