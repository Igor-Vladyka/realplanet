
(function() {

    angular.module('real.planet').service('dataService', ["$q", dataService]);

    function dataService($q){

        var self = this;
        self._timaticRoot = "https://www.timaticweb.com/cgi-bin/tim_website_client.cgi?SpecData=1&HEALTH=1&VISA=1&NA={{home}}&EM={{embr}}&DE={{dest}}&PASSTYPES=PASS&user=KLMB2C&subuser=KLMB2C"
        self._timatic = "https://www.timaticweb.com/cgi-bin/tim_website_client.cgi?SpecData=1&VISA=1&NA={{home}}&DE={{dest}}&PASSTYPES=PASS&user=KLMB2C&subuser=KLMB2C"
        self._fileTemplate = "country/real.planet.countries.json";

        self.load = function (path){
            var child = this;
            return child.initialLoad(path + child._fileTemplate).then(function(data){ child.data = data; });
        };

        self.initialLoad = function (path){
            var base = this;
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

        // obsolete
        self.canShowTimaticLink = function(home, target){
            var home = self.data.filter(function(f){ return f.target.toLowerCase() == home.toLowerCase()});

            if(home.length == 1){
                home = home[0].ICO2;
            }

            return home.length == target.length && home.toLowerCase() !== target.toLowerCase();
        }

        // obsolete
        self.showTimatic = function(home, target){

            var home = self.data.filter(function(f){ return f.target.toLowerCase() == home.toLowerCase()});

            if(home.length == 1){
                home = home[0].ICO2;
                var url = self._timatic.replace("{{home}}", home).replace("{{dest}}", target);

                if(self.timaticWindow){
                    self.timaticWindow.close();
                    self.timaticWindow = null;
                }

                self.timaticWindow = window.open(url, "_blank", "location=0,menubar=0,status=0,titlebar=0,toolbar=0,width=400");
            }
        }

    }

})();
