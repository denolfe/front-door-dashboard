var dashboardApp = angular.module('dashboardApp', ['ngRoute', 'ngAnimate', 'ngTouch', 'angular-momentjs','angular-skycons'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/',
      {
        templateUrl: 'templates/main.html',
        controller: 'MainCtrl'
      }
    );
    $routeProvider.otherwise(
      { redirectTo: '/' }
    );

    $locationProvider.html5Mode({ enabled: true, requireBase: false});

  }])

  .factory('ForecastIoFactory', function ($http, $interval) {
    var apiKey = '',
      lat = '',
      lon = '',
      interval = 1000 * 60 * 15,  //15 minutes
      cachedForecast;

    function pollForecastIO(callback) {
      var url = ['https://api.forecast.io/forecast/', apiKey, '/', lat, ',', lon, '?callback=JSON_CALLBACK'].join('');

      $http.jsonp(url)
        .success(function (data) {
          callback(null, data);
        })
        .error(function (error) {
          console.log(err);
          callback(error);
        });
    }

    function currentForecast(callback) {
      if (!cachedForecast) {
        pollForecastIO(function (err, data) {
          cachedForecast = data;
          callback(null, cachedForecast);
        })
      } else {
        callback(null, cachedForecast);
      }
    }

    // poll on an interval to update forecast
    $interval(function () {
      pollForecastIO(function (err, data) {
        console.log('updated forecast');
        cachedForecast = data;
      });
    }, interval);

    return {
      currentForecast: currentForecast
    };
  })
  .filter('temp', function ($filter) {
    return function(input, precision) {
      if (precision === undefined) {
        precision = 0;
      }
      var numberFilter = $filter('number');
      return numberFilter(input, precision) + '\u00B0';
    };
  });
