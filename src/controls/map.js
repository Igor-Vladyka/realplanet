(function() {

	var mapsMeIconTemplate = "http://mapswith.me/placemarks/placemark-{style}.png";

    angular.module('real.planet').service('map',["$q", "leafletData", "MapControls", "AuthService", map]);

    function map($q, leafletData, MapControls, AuthService){

        var self = this;

        self.bounds = new L.LatLngBounds(new L.LatLng(150, -300), new L.LatLng(-150, 300));

        self.markerClusterFunction = function(cluster) {
            return new L.DivIcon({
                html: '<div><span>' + cluster.getChildCount() + '</span></div>',
                className: 'marker-cluster marker-cluster-' + this.style,
                iconSize: new L.Point(40, 40)
            });
        }

        self.createClusterLayer = function(style){
            var opt = {
                        showCoverageOnHover: false,
                        iconCreateFunction: self.markerClusterFunction,
                        style: style
                    };

            if(AuthService.getUser() != null && !AuthService.getUser().clasterization){
                opt.disableClusteringAtZoom = 1;
            }

            return new L.markerClusterGroup(opt);
        }

        self.initialize = function($scope, options){

            self.newPlacemarkLayer = new L.FeatureGroup();

            self.layerGroups = {};

            self.allLayerGroupsObjects = [];

            self.scope = $scope;

            var defaultOptions = {
                mapProvider: 'MapQuestOpen.OSM',
                canAddMarkers: true,
                placemarkControl: true,
                searchControl: true,
                routeControl: false,
                mapOpt: {
                    click: function(e) {
                        if(MapControls.placemark().isVisible()){
                            self.newPlacemarkLayer.clearLayers();
                            MapControls.placemark().hide();
                        } else {
                            var latLng = [e.latlng.lat, e.latlng.lng];
                            self.addPlacemark(latLng, null);
                        }
                    }
                }
            }

            self.options = angular.extend(defaultOptions, options || {});

            self.mapId = self.options.mapId;

            angular.extend(self.scope, {
                center: {
                    autoDiscover: true,
                    zoom: 3
                },
                maxbounds: self.bounds,
                hidePlacemarkControl: function (){
                    self.newPlacemarkLayer.clearLayers();
                    this._imageIsHidden = $("#placemarkImageSection:visible").length > 0;
                    MapControls.placemark().hide();
                }
            });

            leafletData.getMap(self.mapId).then(function(map){

                map.addLayer(self.newPlacemarkLayer);

                L.tileLayer.provider(self.options.mapProvider).addTo(map);

                if(self.options.placemarkControl)
                {
                    map.addControl(MapControls.placemark(self.scope));

                    $("[data-lightbox]").on('click', function (){
                        $(this).lightBox();
                    });
                }

                if(self.options.searchControl){
                    if(!MapControls.isSearchPresent())
                    {
                        map.addControl(MapControls.search(self.searchCallback));
                        MapControls.searchStyles();
                    } else {
                        MapControls.showSearch();
                    }
                } else {
                    MapControls.hideSearch();
                }

                if(self.options.routeControl){
                    MapControls.route().addTo(map);
                }

                map.on(self.options.mapOpt);
            })
        }

        self.resetMap = function(){
            self.getRouteControl().spliceWaypoints(0, self.getRouteControl().getWaypoints().length);
            self.routes = [];
            self.clearAllLayers();
            self.layerGroups = {};
        }

        self.getRouteControl = function(array){
            if(array){
                var waypoints = [];
                $(array).each(function(){
                    waypoints.push(this.latLng);
                });

                return MapControls.route().setWaypoints(waypoints);
            } else {
                return MapControls.route();
            }
        }

        self.getMap = function (){
            var deferred = $q.defer();
            leafletData.getMap(self.mapId).then(function(map){ deferred.resolve(map); });
            return deferred.promise;
        }

        self.searchCallback = function(bounds, latLng, name){
            RW.map.fitBounds(bounds);
            self.addPlacemark(latLng, name);
        }

        self.toggleLayerGroups = function(name, boolValue){
            var layer = self.layerGroups[name];

            leafletData.getMap(self.mapId).then(function(map){

                if(boolValue){

                    if(!map.hasLayer(layer)){
                        layer.addTo(map);
                    }

                } else {

                    if(map.hasLayer(layer)){
                        map.removeLayer(layer);
                    }

                }
            });
        }

        self.clearAllLayers = function(){
            for (var l in self.layerGroups)
            {
                self.layerGroups[l].clearLayers();
            }

            self.allLayerGroupsObjects = [];
        }

        self.addLayerGroup = function(name, collection, style){
            leafletData.getMap(self.mapId).then(function(map){
                    var items = [];
                    $(collection).filter(function(){
                        var latLng = self.createLatLngFromStringCoordinates(this.coordinates);
                        this.latLng = latLng;
                        items.push(self.createMarker(latLng, style));
                        self.allLayerGroupsObjects.push(this);
                        return true;
                    });

                    if (!self.layerGroups[name]){
                        self.layerGroups[name] = self.createClusterLayer(style);
                        map.addLayer(self.layerGroups[name]);
                    }

                    self.layerGroups[name].addLayers(items);
            });
        }

        self.addLayerGroupItem = function(name, item, style){
            leafletData.getMap(self.mapId).then(function(map){
                    var latLng = self.createLatLngFromStringCoordinates(item.coordinates);
                    item.latLng = latLng;

                    var obj = self.createMarker(latLng, style);
                    self.allLayerGroupsObjects.push(item);

                    if (!self.layerGroups[name]){
                        self.layerGroups[name] = self.createClusterLayer(style);
                        map.addLayer(self.layerGroups[name]);
                    }

                    self.layerGroups[name].addLayer(obj);
            });
        }

        self.createLatLngFromStringCoordinates = function(coordinates){
            var lat = coordinates.split(',')[0];
            var lng = coordinates.split(',')[1];

            return [lat, lng];
        }

        self.createMarker = function(latLng, style){
            var icon = L.icon({iconUrl: mapsMeIconTemplate.replace("{style}", style), iconAnchor: [9,24]});

            var marker = L.marker(latLng, {icon: icon}).on("click", function(m){
                MapControls.placemark().show();
                self.newPlacemarkLayer.clearLayers();
                self.scope.placemark = $(self.allLayerGroupsObjects).filter(function(){ return this.coordinates === m.latlng.lat + "," + m.latlng.lng})[0];

                self.scope.$apply();
            });

            self.scope.placemark = null;

            return marker;
        }

        self.addPlacemark = function (latLng, name){
            if(self.options.canAddMarkers){
                MapControls.placemark().show();

                self.newPlacemarkLayer.clearLayers();

                L.marker(latLng).addTo(self.newPlacemarkLayer);

                self.scope.placemark = {
                    "name": name || "",
                    "coordinates": latLng.toString(),
                    "collection": {}
                }

                self.scope.$apply();
            }
        }
    }
})();
