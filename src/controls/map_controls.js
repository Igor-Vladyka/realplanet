(function() {

    angular.module('real.planet')
        .service('MapControls', ["$compile", "mapProvider", MapControls]);

        function MapControls($compile, mapProvider){
            var self = this;
            
            self.printControl = function (){
                return L.browserPrint({printLayer: mapProvider.tiles.CartoDB.Positron});
            };

            self.getMap = function (defaultOptions) {
                if (!mapProvider.map) {

                    mapProvider.map = L.map('realplanetmap', defaultOptions);

                    mapProvider.tiles.Esri.OceanBasemap.addTo(mapProvider.map);

                    //self.printControl().addTo(mapProvider.map);
                }

                return mapProvider.map;
            };
                        
            self.placemark = function (scope){
                self.scope = scope;
                if(!self._placemark){
                    self._placemark = L.Control.extend({
                        onAdd: function(map){
                            this.html = $("#placemarkModal").html();

                            $("#placemarkModal").replaceWith();

                            this._container = $compile(this.html)(self.scope)[0];

                            L.DomEvent.disableClickPropagation(this._container);

                            return this._container;
                        },
                        hide: function(){
                            $('#placemarksControl').hide();
                        },
                        show: function(){
                            $('#placemarksControl').show();
                        },
                        isVisible: function(){
                            return $('#placemarksControl:visible').length;
                        }
                    });

                    self._placemark = new self._placemark();
                }

                 return self._placemark;
            }

            self.search = function(searchCallback){
                self._searchControl = new L.Control.Search({
                    container: "searchControl",
                    url: 'http://nominatim.openstreetmap.org/search?format=json&q={s}',
                    jsonpParam: 'json_callback',
                    propertyName: 'display_name',
                    propertyLoc: ['lat','lon'],
                    circleLocation: false,
                    markerLocation: false,
                    autoType: true,
                    autoCollapse: false,
                    minLength: 2,
                    zoom: 13,
                    formatData: function(json){
                        var propName = this.options.propertyName,
                            jsonret = {};

                        var control = this;
                        $(json).each(function(){
                            var j = this;
                            jsonret[control._getPath(j, propName) ] = j;
                        });

                        return jsonret;
                    }
                });

                self._searchControl.on('search_locationfound', function(e) {
                    var southWest = L.latLng(e.latlng.boundingbox[0], e.latlng.boundingbox[2]),
                        northEast = L.latLng(e.latlng.boundingbox[1], e.latlng.boundingbox[3]),
                        bounds = L.latLngBounds(southWest, northEast);

                    if(searchCallback){
                        searchCallback(bounds, [e.latlng.lat, e.latlng.lon], e.text);
                    }

                });

                return self._searchControl;
            }

            self.hideSearch = function (){
                if(self._searchControl){
                    $("#searchControl").hide();
                }
            }

            self.showSearch = function (){
                if(self._searchControl){
                    $("#searchControl").show();
                }
            }

            self.searchStyles = function (){
                $(".leaflet-control-search").addClass("input-group").addClass("search-exp");
                $("input.search-input").addClass("form-control").show();
                $("a.search-button").replaceWith('<span class="input-group-btn"><a class="search-button" href="#" title="Search..."></a></span>');
                $("a.search-cancel").addClass("z-index-5");
            }

            self.isSearchPresent = function(){
                return $(".search-exp").length;
            }

            self.route = function(){
                var plan = L.Routing.plan(null, {addWaypoints: false, draggableWaypoints:false, createMarker: function(){}});

                if(!self._route)
                {
                    self._route = L.Routing.control({
                        position:'bottomleft',
                        waypoints: null,
                        plan: plan,
                        routeWhileDragging: false,
                        showAlternatives: false
                    });
                }

                return self._route;
            }
    }

})();
