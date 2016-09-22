
(function() {

    angular.module('real.planet')
        .service('countriesService', ["$q", "baseFilterService", countriesService]);

    function countriesService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

        self.path = "country/real.planet.countries.low.json";

        self.layer = {};

        self.countries = {}

        self.load = function (map, path, defaultStyles, activateCountryCallback) {
            var deferred = $q.defer();

            self.initialLoad(path + self.path).then(function(data) {

                self.layer = L.geoJson(data, {
                    style: defaultStyles,
                    onEachFeature: function (feature, layer) {
                        feature.getId = function(){ return this.id; }
                        self.countries[feature.properties.ISO3] = {c: feature};
                        layer.on("click", function(e){
                            if(activateCountryCallback){
                                activateCountryCallback(feature, self.layer, e.target.getBounds());
                            }
                        });
                    }
                });

                self.layer.addTo(map);

                for(var m in self.countries){
                    self.countries[m].l = self.layer;
                }

                deferred.resolve();
            });

            return deferred.promise;
        };

        self.getCountryByIso = function(iso3){
            return self.countries[iso3];
        }
    }

})();
