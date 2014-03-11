'use strict';

angular.module('devApp')
  .controller('MainCtrl', function ($scope, $q, simpleLogin, syncData, geolocation) {

    $scope.logout = function() {
    	simpleLogin.logout();
    };

    $scope.activateAlarm = function() {
      geolocation.getCurrentPosition(function (position) {
        $scope.alarms = syncData("/alarms")
        console.log("http://graph.facebook.com/" + $scope.auth.user.id + "/picture?type=large");
        console.log("position.coords.latitude: " + position.coords.latitude);
        console.log("position.coords.latitude: " + position.coords.longitude);
        $scope.alarms.$add({
          time: new Date,
          picture: "http://graph.facebook.com/" + $scope.auth.user.id + "/picture?type=large",
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      });
    };
  });
