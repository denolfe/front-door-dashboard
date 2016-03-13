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

'use strict';

dashboardApp.controller('MainCtrl',
  function MainCtrl($scope, $http, $interval, $moment, $log, ForecastIoFactory) {

    $scope.dateTime = null;
    $scope.getFormattedDate = function() {
      var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      var time = $moment().format('h:mma');
      $scope.dateTime = weekdays[$moment().format('d')] + ', ' + time;
    };
    $scope.getFormattedDate();
    $interval($scope.getFormattedDate, 5000);

    $scope.init = function () {
      ForecastIoFactory.currentForecast(function (err, data) {
        if (err) {
          $scope.forecastError = err;
        } else {
          $scope.forecast = data;
        }
        $log.info('Polling for weather');
      });
    };
    $interval($scope.init, 15 * 60 * 1000); // Poll every 15 mins

    $scope.calcTempColor = function(temp) {
      if (temp < 15) {
        return "coldest";
      } else if (temp < 32) {
        return "cold";
      } else if (temp < 45) {
        return "brisk";
      } else if (temp < 60) {
        return "cool";
      } else if (temp < 70) {
        return "moderate";
      } else if (temp < 80) {
        return "warm";
      } else if (temp < 90) {
        return "hot";
      } else if (temp >= 90) {
        return "hottest";
      } else {
        return "default";
      }
    };

    $scope.futureForecast = false;

    $scope.swipeRight = function() {
      $log.info('swiped right');
    }
  }
);
