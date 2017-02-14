(function() {

    angular.module('real.planet')
        .controller('filterController', ["$scope", "$stateParams", "map", "filterModules", "leafletData", "AuthService", filterController]);

    function filterController($scope, $stateParams, map, filterModules, leafletData, AuthService){

        map.initialize($scope, {
            canAddMarkers: false,
            placemarkControl: false,
            searchControl: false,
            mapProvider: "Esri.OceanBasemap",//"Stamen.Watercolor",//"OpenMapSurfer.Grayscale",
            mapOpt:{
                click: function(){
                        filterModules.deactivateCountry();
                    }
                }
            });

        map.getMap().then(function(map){
            AuthService.getAuthObject().then(function(user){
                initFilters(map, user, $stateParams.iso3);
            });
        });

        function initFilters(map, user, country){
            filterModules.initialize(map, user).then(function(){
                $scope.moduleManager = filterModules.moduleManager;
            }).then(function(){
                filterModules.initDefaults(country);
                if(country){
                    filterModules.activateCountryByIso(country);
                } else {
                    filterModules.evaluateMap();
                }
            });
        }

        $scope.checkFilter= function(opt){
            if(filterModules.canChangeFilters()){
                opt.checked = !opt.checked;
                filterModules.evaluateMap();
            }
        };

        $scope.checkModule= function(targetModule){
            if(filterModules.canChangeFilters()){
                var active = $(targetModule.options).filter(function(){
                    return this.checked;
                });

                $(targetModule.options).filter(function(){
                    this.checked = active.length == 0;
                    var current = $("#" + targetModule.name + " input[value='" + this.alias + "']");
                    if(this.checked){
                        if(!current.parent().is(".active")){
                            current.parent().button("toggle");
                        }
                    }else{
                        if(current.parent().is(".active")){
                            current.parent().button("toggle");
                        }
                    }
                    return false;
                });

                filterModules.evaluateMap();
            }
        };

        $scope.selectMount = function(index){
            if(filterModules.canChangeFilters()){
                $scope.moduleManager.temperature._selected = index;
                $scope.moduleManager.temperature.initDefault();

                $scope.moduleManager.rain._selected = index;
                $scope.moduleManager.rain.initDefault();

                filterModules.monthChanged();
            }
        };

        $scope.highlightHeader = function(module){
            return filterModules.canChangeFilters() && $(module.options).filter(function(){
                return this.checked;
            }).length;
        }

    }

})();
