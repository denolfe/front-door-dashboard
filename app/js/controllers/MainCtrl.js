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

    $scope.getPrecipIcon = function (precipType) {
      if (precipType == 'snow')
        return '../vendor/animated-climacons/climacons/svg-css/cloudSnow.svg';
      else
        return '../vendor/animated-climacons/climacons/svg-css/cloudDrizzle.svg';
    };

    $scope.futureForecast = false;

    $scope.swipeRight = function() {
      $log.info('swiped right');
    }
  }
);
