'use strict';
angular.module('cordova.geolocation', [])
	
	.factory('geolocation', function ($rootScope, cordovaReady) {
	  return {
	    getCurrentPosition: cordovaReady(function (onSuccess, onError, options) {
	      navigator.geolocation.getCurrentPosition(function () {
	        var that = this,
	          args = arguments;

	        if (onSuccess) {
	        	console.log("onSuccess");
	          $rootScope.$apply(function () {
	            onSuccess.apply(that, args);
	          });
	        }
	      }, function () {
	        var that = this,
	          args = arguments;

	        if (onError) {
	        	console.log("onError");
	          $rootScope.$apply(function () {
	            onError.apply(that, args);
	          });
	        }
	      },
	      options);
	    })
	  };
	});
