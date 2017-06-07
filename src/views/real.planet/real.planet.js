(function() {

    angular.module('real.planet')
        .controller('filterController', ["$scope", "$stateParams", "map", "filterModules", "leafletData", "AuthService", filterController]);

    function filterController($scope, $stateParams, map, filterModules, leafletData, AuthService){

        $scope.validateInitialWidth = function(){
            return window.innerWidth < 768;
        };

        map.initialize($scope, {
            canAddMarkers: false,
            placemarkControl: false,
            searchControl: false,
            mapOpt:{
                click: function(e){
                        //filterModules.deactivateCountry();
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

        $scope.checkFilter = function(opt){
            if(filterModules.canChangeFilters()){
                opt.checked = !opt.checked;
                filterModules.evaluateMap();
            }
        };

        function validateCollapsePanel(name){
            if($scope.collapseTimeout){
                return;
            }

            $scope.collapseTimeout = setTimeout(function(){
                var panel = $("#" + name + "Content");
                var switchState = $("#switch" + name).attr("checked");
                if(switchState){
                    panel.collapse("show");
                } else {
                    panel.collapse("hide");
                }
                $scope.collapseTimeout = null;
            }, 0);
        }

        $scope.checkModule = function(targetModule){
            if(filterModules.canChangeFilters()){
                var active = $(targetModule.options).filter(function(){
                    return this.checked;
                });

                $(targetModule.options).filter(function(){
                    this.checked = !active.length;
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
                validateCollapsePanel(targetModule.name);
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
        };

    }

})();
