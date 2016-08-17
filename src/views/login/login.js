(function() {

    angular.module('real.planet')
    .controller("stateController", ["$rootScope", "$scope", '$state', '$location', "AuthService", function ($rootScope, $scope, $state, $location, AuthService){

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            $rootScope.page = toState.name;
            if($rootScope.page != "login"){
                $rootScope.previos = $rootScope.page;
            }

            AuthService.getAuthObject().then(function(user){ $rootScope.currentUser = user; });
        })

        var prov = AuthService.getSocialProviders();

        $scope.providers = {google: prov.google, facebook: prov.facebook };

        if($scope.providers.google){
            $scope.providers.google.fa = "google-plus";
        }

        if($scope.providers.facebook){
            $scope.providers.facebook.fa = "facebook-square";
        }

        function onSuccess() {
            $state.go($rootScope.previos || 'planner', {}, {reload: true});
        }

        $scope.login = function(provider){
            AuthService.auth(provider).then(onSuccess);
        }

        $scope.logout = function(){
            AuthService.logout().then(function(){ $state.go("filter", {}, {reload: true}); });
        }

    }])
})();
