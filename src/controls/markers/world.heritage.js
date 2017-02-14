
(function() {

    angular.module('real.planet').service('worldHeritageService', ["$q", worldHeritageService]);

    function worldHeritageService($q){

        var self = this;

        self._fileTemplate = "places/real.planet.places.json";

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

            return L.marker([datum.lat, datum.lng], {icon: styledIcon, title: datum.type + ": " + datum.name}).bindPopup(self.createPopupContent(datum), { keepInView:true });
        }

        self.createPopupContent = function(datum){
            return '<h4 class="text-center">' + datum.name + '</h4>' +
                    '<img class="img-responsive" src="' + datum.image + '"></img>' +
                    '<div><i>' + datum.shortInfo + '</i></div>';
        }

        self.createLayer = function(style){
            return L.markerClusterGroup({iconCreateFunction: self.markerClusterFunction, style: style, spiderfyOnMaxZoom: false, showCoverageOnHover: false});
        }

        self.mapper = function(data){
            var natural = data.filter(function(f){ return f.type == "Natural"; });
            var cultural = data.filter(function(f){ return f.type == "Cultural"; });
            var mixed = data.filter(function(f){ return f.type == "Mixed"; });

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
