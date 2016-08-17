(function () {

      angular.module('real.planet')
          .service('CRUDService', ['$http', 'endpoints', CRUDService]);

    function CRUDService($http, endpoints){

        var self = angular.extend(this, endpoints);

        self.readAll = function (table) {
            return $http({
                method: 'GET',
                url: self.baseUrl + table
            }).then(function(response) {
                return response.data.data;
            });
        };

        self.readOne = function (id, table) {
            return $http({
                method: 'GET',
                url: self.baseUrl + table + '/' + id,
                params: {
                    deep: true
                }
            }).then(function(response) {
                return response.data;
            });
        };

        self.create = function (data, table) {
            return $http({
                method: 'POST',
                url : self.baseUrl + table,
                data: data,
                params: {
                    returnObject: true
                }
            })
            .then(function(r){
                toastr["success"]("Item was successfully added."); return r;
            })
            .then(function(response) {
                return response.data;
            });
        };

        self.update = function (id, data, table) {
            return $http({
                method: 'PUT',
                url : self.baseUrl + table + '/' + id,
                data: data,
                params: {
                    returnObject: true
                }
            })
            .then(function(r){
                toastr["success"]("Item was successfully updated."); return r;
            })
            .then(function(response) {
                return response.data;
            });
        };

        self.delete = function (id,table) {
            return $http({
                method: 'DELETE',
                url : self.baseUrl + table + '/' + id,
                params: {
                    returnObject: true
                }
            })
            .then(function(r){
                toastr["success"]("Item was successfully deleted."); return r;
            });
        };
    }

}());
