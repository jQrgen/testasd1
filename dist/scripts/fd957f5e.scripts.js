"use strict";angular.module("devApp",["ngCookies","ngResource","ngSanitize","ngRoute","firebase","angularfire.firebase","angularfire.login","simpleLoginTools","cordova.geolocation","cordova.ready"]).config(["$routeProvider",function(a){a.when("/",{authRequired:!0,templateUrl:"views/main.html",controller:"MainCtrl"}).when("/login",{authRequired:!1,templateUrl:"views/login.html",controller:"LoginController"}).otherwise({redirectTo:"/"})}]),angular.module("devApp").controller("MainCtrl",["$scope","$q","simpleLogin","syncData","geolocation",function(a,b,c,d,e){a.logout=function(){c.logout()},a.activateAlarm=function(){e.getCurrentPosition(function(b){a.alarms=d("/alarms"),console.log("http://graph.facebook.com/"+a.auth.user.id+"/picture?type=large"),console.log("position.coords.latitude: "+b.coords.latitude),console.log("position.coords.latitude: "+b.coords.longitude),a.alarms.$add({time:new Date,picture:"http://graph.facebook.com/"+a.auth.user.id+"/picture?type=large",lat:b.coords.latitude,lon:b.coords.longitude})})}}]),angular.module("devApp").constant("angularFireVersion","0.6").constant("loginRedirectPath","/login").constant("loginProviders","facebook").constant("FBURL","https://jqrgen.firebaseio.com"),angular.module("angularfire.firebase",["firebase"]).factory("firebaseRef",["Firebase","FBURL",function(a,b){function c(a){for(var b=0;b<a.length;b++)"object"==typeof a[b]&&(a[b]=c(a[b]));return a.join("/")}return function(){return new a(c([b].concat(Array.prototype.slice.call(arguments))))}}]).service("syncData",["$firebase","firebaseRef",function(a,b){return function(c,d){var e=b(c);return d&&(e=e.limit(d)),a(e)}}]),angular.module("angularfire.login",["firebase","angularfire.firebase"]).run(["simpleLogin",function(a){console.log("simplelogin.init"),a.init()}]).factory("simpleLogin",["$rootScope","$firebaseSimpleLogin","firebaseRef","$timeout",function(a,b,c,d){function e(){if(null===f)throw new Error("Must call loginService.init() before using its methods")}var f=null;return{init:function(){return f=b(c()),a.auth=f,f},logout:function(){e(),f.$logout()},login:function(a,b){console.log("login"),e(),f.$login(a,{rememberMe:!0,scope:"user_photos"}).then(function(a){b&&d(function(){b(null,a)})},b)}}}]),angular.module("simpleLoginTools",[]).service("waitForAuth",["$rootScope","$q","$timeout",function(a,b,c){function d(b){a.auth&&(a.auth.error=b instanceof Error?b.toString():null);for(var d=0;d<f.length;d++)f[d]();c(function(){e.resolve()})}var e=b.defer(),f=[];return f.push(a.$on("$firebaseSimpleLogin:login",d)),f.push(a.$on("$firebaseSimpleLogin:logout",d)),f.push(a.$on("$firebaseSimpleLogin:error",d)),e.promise}]).config(["$provide",function(a){a.decorator("ngCloakDirective",function(a,b){var c=a[0],d=c.compile;return c.compile=function(a,e){b.then(function(){d.call(c,a,e)})},a})}]).directive("ngShowAuth",["$rootScope",function(a){function b(a,b){var c=a.$eval(b);return"string"==typeof c||angular.isArray(c)||(c=b),"string"==typeof c&&(c=c.split(",")),c}function c(a,b){var c=!1;return angular.forEach(b,function(b){return b===a?(c=!0,!0):!1}),c}function d(a){if(!a.length)throw new Error("ng-show-auth directive must be login, logout, or error (you may use a comma-separated list)");return angular.forEach(a,function(a){if(!c(a,["login","logout","error"]))throw new Error('Invalid state "'+a+'" for ng-show-auth directive, must be one of login, logout, or error')}),!0}var e="logout";return a.$on("$firebaseSimpleLogin:login",function(){e="login"}),a.$on("$firebaseSimpleLogin:logout",function(){e="logout"}),a.$on("$firebaseSimpleLogin:error",function(){e="error"}),{restrict:"A",link:function(f,g,h){function i(){var a=c(e,j);setTimeout(function(){g.toggleClass("ng-cloak",!a)},0)}var j=b(f,h.ngShowAuth);d(j),i(),a.$on("$firebaseSimpleLogin:login",i),a.$on("$firebaseSimpleLogin:logout",i),a.$on("$firebaseSimpleLogin:error",i)}}}]),function(a){function b(a,b,c,d){this._route=c,this._location=a,this._rootScope=b,this._loginPath=d,this._redirectTo=null,this._authenticated=!(!b.auth||!b.auth.user),this._init()}a.module("devApp").run(["$injector","$location","$rootScope","loginRedirectPath",function(a,c,d,e){a.has("$route")&&new b(c,d,a.get("$route"),e)}]),b.prototype={_init:function(){var b=this;this._checkCurrent(),b._rootScope.$on("$routeChangeStart",function(a,c){b._authRequiredRedirect(c,b._loginPath)}),b._rootScope.$on("$firebaseSimpleLogin:login",a.bind(this,this._login)),b._rootScope.$on("$firebaseSimpleLogin:logout",a.bind(this,this._logout)),b._rootScope.$on("$firebaseSimpleLogin:error",a.bind(this,this._logout))},_checkCurrent:function(){this._route.current&&this._authRequiredRedirect(this._route.current,this._loginPath)},_login:function(){this._authenticated=!0,this._redirectTo?(this._redirect(this._redirectTo),this._redirectTo=null):this._location.path()===this._loginPath&&(this._location.replace(),this._location.path("/"))},_logout:function(){this._authenticated=!1,this._checkCurrent()},_redirect:function(a){this._location.replace(),this._location.path(a)},_authRequiredRedirect:function(a,b){a.authRequired&&!this._authenticated?(this._redirectTo=void 0===a.pathTo?this._location.path():a.pathTo===b?"/":a.pathTo,this._redirect(b)):this._authenticated&&this._location.path()===this._loginPath&&this._redirect("/")}}}(angular),angular.module("devApp").controller("LoginController",["$scope","simpleLogin",function(a,b){a.pass=null,a.err=null,a.user=null,a.login=function(c){b.login(c,function(b){a.err=b?b+"":null})}}]),angular.module("cordova.geolocation",[]).factory("geolocation",["$rootScope","cordovaReady",function(a,b){return{getCurrentPosition:b(function(b,c,d){navigator.geolocation.getCurrentPosition(function(){var c=this,d=arguments;b&&(console.log("onSuccess"),a.$apply(function(){b.apply(c,d)}))},function(){var b=this,d=arguments;c&&(console.log("onError"),a.$apply(function(){c.apply(b,d)}))},d)})}}]),angular.module("cordova.ready",[]).factory("cordovaReady",[function(){return function(a){var b=[],c=function(){b.push(Array.prototype.slice.call(arguments))};return document.addEventListener("deviceready",function(){console.log("deviceready"),b.forEach(function(){a.apply(this.args)}),c=a},!1),function(){return console.log("deviceready directive"),c.apply(this,arguments)}}}]);