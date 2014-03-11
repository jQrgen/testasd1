'use strict';

angular.module('cordova.ready', [])
  .factory('cordovaReady', [function () {
  
  	return function(fn) {
  		var queue = [];

  		var impl = function() {
  			queue.push(Array.prototype.slice.call(arguments))
  		};

  		document.addEventListener('deviceready', function() {
  			console.log("deviceready");
  			queue.forEach(function (args) {
  				fn.apply(this.args);
  			});
  			impl = fn;
  		}, false);
  		return function() {
  			console.log("deviceready directive");
  			return impl.apply(this, arguments);
  		};
  	};
  }]);
