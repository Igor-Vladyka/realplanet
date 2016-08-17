angular.module('real.planet', [
  'ui.router',
  'leaflet-directive'
]).config(['$stateProvider','$httpProvider', '$urlRouterProvider', function($stateProvider, $httpProvider, $urlRouterProvider) {

	    //$httpProvider.interceptors.push('realPlanetHttpInterceptor');
	    $urlRouterProvider.otherwise("/filter/")

	  	$stateProvider
          .state('filter', {
              url: "/filter/:iso3",
              data: { isPublic: true },
	            templateUrl: "views/real.planet/real.planet.html"
	        })
	        .state('scraping', {
	            url: "/scraping",
	            data: { isPublic: false },
	            templateUrl: "views/scraping/main.html"
	        })
  	}])
    .directive("footer", function(){
        return {
          templateUrl: "views/footer.html"
        }
    })
    .run(["$rootScope", '$state', 'AuthService', function ($rootScope, $state, AuthService) {
      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        // if already authenticated...
        var isAuthenticated = AuthService.isAuthenticated();
        // any public action is allowed
        var isPublicAction = angular.isObject(toState.data)
                           && toState.data.isPublic === true;

        if (isPublicAction || isAuthenticated) {
          return;
        }

        event.preventDefault();

        AuthService
           .getAuthObject()
           .then(function (user) {

                var isAuthenticated = user.isAuthenticated === true;

                if (isAuthenticated) {
                  // let's continue, use is allowed
                  $state.go(toState, toParams)
                  $rootScope.currentUser = user;
                  return;
                } else{
                  $rootScope.previos = toState.name;
                  $state.go("login");
                }

           }, function(){
              $state.go("login");
           })
        })
    }]);
