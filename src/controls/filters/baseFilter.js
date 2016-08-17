(function() {

    angular.module('real.planet')
        .service('baseFilterService', ["$q", baseFilterService]);

    function baseFilterService($q){
        var self = this;

        self.initialLoad = function (path){
            var deferred = $q.defer();

            if (Storage !== "undefined" && localStorage[path])
            {
                var data = JSON.parse(localStorage[path]);
                deferred.resolve(data);
            } else {
                 $.getJSON(path, function(data) {
                    if(Storage !== "undefined"){
                        localStorage[path] = JSON.stringify(data);
                    }
                    deferred.resolve(data);
                });
            }

            return deferred.promise;
        };

        self.getDataItem = function (feature, data) {

            var id = feature.getId();
            var item = null;
            var itemArray = $.grep(data, function (e) { return e.target === id; });

            if (itemArray.length > 0) {
                item = itemArray[0];
            }

            return item;
        };

        self.getCountryOption = function(feature, options, setup){
            var opt = null;
            if(feature){
                var alias = setup(feature);
                opt = $(options).filter(function(){ return this.alias == alias});
                if(opt && opt.length){
                    opt = opt[0];
                } else{
                    opt = {text: " ", icon: { class: ""}, alias: alias};
                }
            }

            return opt;
        };
    }

})();
