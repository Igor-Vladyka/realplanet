(function() {

  angular.module('real.planet')
    .factory('rwhttpInterceptor', ['$q', '$injector', '$cookieStore', realplanethttpInterceptor]);

  function realplanethttpInterceptor($q, $injector, $cookieStore) {
    return {

      'request': function(config) {
        return config;
      },

      requestError: function(rejection) {
        return $q.reject(rejection);
      },

      response: function(response) {
        return response;
      },

      responseError: function(rejection) {

        if ((rejection.config.url+"").indexOf('token') === -1){
          if (rejection.status === 401) {
              if($cookieStore.get('username')){
                toastr["error"]("The session has expired, please sign in again.");
              } else {
                toastr["error"]("Something went wrong... please sign in again.");
              }

              $injector.get('$state').go('login', {reload: true});
              $injector.get('AuthService').logout();
          }
        } else{
          toastr["error"]("Something went wrong...");
        }

        return $q.reject(rejection);
      }
    };
  }

})();
