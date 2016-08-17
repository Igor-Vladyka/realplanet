(function () {

    angular.module('real.planet')
        .factory('AuthService', ['$q', '$http', '$location', AuthService]);

    function AuthService($q, $http, $location) {

        var self = {};
        var baseUrl = '/';

        var user = undefined;

        function getCurrentUserInfo(value) {
            return $http({
                method: 'GET',
                url: baseUrl + "getUserDetails"
            }).then(function (response) {
                if (response.data && response.data.length == 1)
                    return response.data[0];
            });
        };

        return {
                    getAuthObject: function (){
                        var deferred = $q.defer();

                        if (user) {
                            return $q.when(user);
                        }

                        if (false) {
                            getCurrentUserInfo(Backand.getUsername())
                                    .then(function (data) {
                                        user = data;
                                        user.isAuthenticated = true;
                                        deferred.resolve(user);
                                    });
                        }else{
                            deferred.resolve({isAuthenticated: false});
                        }

                        return deferred.promise;
                    },

                    getUser: function(){
                        return user;
                    },

                    clearUser: function(){
                        user = undefined;
                        return this.getAuthObject();
                    },

                    getSocialProviders: function () {
                        return []
                    },

                    auth: function(provider, success){
                        var deferred = $q.defer();
                        Backand.socialSignIn(provider).then(function(){
                            deferred.resolve();
                        }, function(){
                            Backand.socialSignUp(provider).then(function(){
                                $http ({
                                    method: 'GET',
                                    url: Backand.getApiUrl() + '/1/query/data/createDefaultTrip'
                                    }).then(function(response) {
                                        deferred.resolve();
                                        return response.data;
                                    }, function(){
                                        deferred.resolve();
                                    });
                            });
                        });

                        return deferred.promise;
                    },

                    logout: function () {
                        var deferred = $q.defer();
                        Backand.signout().then(function () {
                            user = undefined;
                            $location.path("/");
                            deferred.resolve();
                        });

                        return deferred.promise;
                    },

                    isAuthenticated: function () {
                        return user !== undefined
                            && user.isAuthenticated;
                    }
                }
    }

}());
