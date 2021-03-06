(function() {

    angular.module('real.planet')
        .service('baseFilterService', ["$q", baseFilterService]);

    function baseFilterService($q){
        var self = this;

        self._fileTemplate = "{{name}}/real.planet.{{name}}.json";

        self.calculate = function (data) {
            return JSON.parse(JSON.stringify(data));
        }

        self.mapper = function (data) {
            var base = this;
            if(data[0]){
                return data.map(base.calculate);
            } else {
                return data;
            }
        }

        self.load = function (path){
            var child = this;
            var filePath = child._fileTemplate.replace("{{name}}", child.name)
                                            .replace("{{name}}", child.name);
            return child.initialLoad(path + filePath).then(function(data){ child.data = data; });
        };

        self.initialLoad = function (path){
            var base = this;
            var deferred = $q.defer();

            if (Storage !== "undefined" && localStorage[path])
            {
                var data = JSON.parse(localStorage[path]);
                deferred.resolve(base.mapper(data));
            } else {
                 $.getJSON(path, function(data) {
                    if(Storage !== "undefined"){
                        localStorage[path] = JSON.stringify(data);
                    }
                    deferred.resolve(base.mapper(data));
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
