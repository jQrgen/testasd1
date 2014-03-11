'use strict';
angular.module('angularfire.login', ['firebase', 'angularfire.firebase'])

  .run(function(simpleLogin) {
    console.log("simplelogin.init");
    simpleLogin.init();
  })

  .factory('simpleLogin', function($rootScope, $firebaseSimpleLogin, firebaseRef, $timeout) {
    function assertAuth() {
      if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
    }

    var auth = null;
    return {
      init: function() {
        auth = $firebaseSimpleLogin(firebaseRef());
        $rootScope.auth = auth;
        return auth;
      },

      logout: function() {
        assertAuth();
        auth.$logout();
      },

      /**
       * @param {string} provider
       * @param {Function} [callback]
       * @returns {*}
       */
      login: function(provider, callback) {
        console.log("login");
        assertAuth();
        auth.$login(provider, {
          rememberMe: true,
          scope: 'user_photos'
        }).then(function(user) {
          if( callback ) {
            //todo-bug https://github.com/firebase/angularFire/issues/199
            $timeout(function() {
              callback(null, user);
            });
          }
        }, callback);
      }


    };
  });
