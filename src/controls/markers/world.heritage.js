
(function() {

    angular.module('real.planet').service('worldHeritageService', ["$q", worldHeritageService]);

    function worldHeritageService($q){

        var self = this;

        self._fileTemplate = "places/real.planet.unesco.json";

        self.markerClusterFunction = function(cluster) {
            return new L.DivIcon({
                html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                className: 'marker-cluster marker-cluster-' + this.style,
                iconSize: new L.Point(40, 40)
            });
        }

        self.createMarker = function(datum, style){
            var styledIcon = L.icon({
                iconUrl: L.Icon.Default.imagePath + 'marker-icon-' + style + '.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
            });

            return L.marker([datum.latitude, datum.longitude], {icon: styledIcon, title: datum.name_en}).bindPopup(self.createPopupContent(datum), { keepInView:true });
        }

        self.createPopupContent = function(datum){
            var content = '<h4 class="text-center">' + datum.name_en + '</h4>';
            if(datum.image){
                content = content + '<img class="img-responsive xs-hide" src="' + datum.image + '"></img>';
            }

            content = content + '<div><i>' + datum.short_description_en + '</i></div>';

            return content;
        }

        self.createLayer = function(style){
            return L.markerClusterGroup({iconCreateFunction: self.markerClusterFunction, style: style, spiderfyOnMaxZoom: false, showCoverageOnHover: false, disableClusteringAtZoom: 10});
        }

        self.mapper = function(data){
            var natural = data.filter(function(f){ return f.category == "Natural"; });
            var cultural = data.filter(function(f){ return f.category == "Cultural"; });
            var mixed = data.filter(function(f){ return f.category == "Mixed"; });

            var naturalLayer = self.createLayer("green");
            naturalLayer.addLayers(natural.map(function(m) { return self.createMarker(m, "green"); }));

            var culturalLayer = self.createLayer("red");
            culturalLayer.addLayers(cultural.map(function(m) { return self.createMarker(m, "red"); }));

            var mixedLayer = self.createLayer("orange");
            mixedLayer.addLayers(mixed.map(function(m) { return self.createMarker(m, "orange"); }));

            return {
                '<b class="name-cluster-green">Natural</b>' : naturalLayer,
                '<b class="name-cluster-orange">Mixed</b>' : mixedLayer,
                '<b class="name-cluster-red">Cultural</b>' : culturalLayer,
            }
        }

        self.load = function (map, path){
            var child = this;
            return child.initialLoad(path + child._fileTemplate)
            .then(function(data){
                L.control.layers(null, data).addTo(map);
            });
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

    }

})();
