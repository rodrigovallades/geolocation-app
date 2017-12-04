var geolocationapp = angular.module('geolocationapp', ['ngRoute', 'ngAnimate'])
.config(function($routeProvider, $locationProvider) {

    // omits # from the angular view routing.
    // Requires server configuration and <base href="/"> in the main html.
    // If the browser does not support html5 history api, angular falls back to using #.
    $locationProvider.html5Mode(true);

    $routeProvider
    .when('/geolocation', {
        templateUrl: 'partials/main.html',
        controller: 'GeolocationController'
    })
    .when('/geolocation/:url', {
        templateUrl: 'partials/main.html',
        controller: 'GeolocationController'
    })
    .otherwise({ redirectTo: '/geolocation'});
});