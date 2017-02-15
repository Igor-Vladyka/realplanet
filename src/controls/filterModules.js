(function() {

    angular.module('real.planet')
        .service('filterModules', ["$q", "$state",
        "dataService",
        "countriesService",
        "budgetService",
        "visaService",
        "touristService",
        "safetyService",
        "internetService",
        "temperatureService",
        "rainService",
        "worldHeritageService",
        filterModules]);

    function filterModules($q, $state,
        dataService,
        countriesService,
        budgetService,
        visaService,
        touristService,
        safetyService,
        internetService,
        temperatureService,
        rainService,
        worldHeritageService){

        var self = this;

        self._content = "../data/";

        function colorSelector(color){
            switch(color){
                //case 'green': color = '#00c46b';break;
                //case 'yellow': color = '#caa231';break;
                case 'orange': color = '#ca6531';break;
                //case 'red': color = '#dc340c';break;
                //case 'blue': color = '#A4A5F9';break;
            }

            return color;
        }

        function resetOptions(module){
            $(module.options).each(function(){
                this.checked = false;
            });
        }

        self.style = {
            country_default: function (feature) {
                if(self.moduleManager.country){
                    if(self.moduleManager.country.getId() == feature.getId()){
                        return ({
                            weight: 0,
                            fillColor: colorSelector("orange"),
                            color: colorSelector("orange"),
                            opacity: 1,
                        });
                    }
                }

                return ({
                    weight: 0,
                    fillColor: "transparent",
                    color: "transparent",
                    opacity: 0,
                });
            }
        };

        self.initialize = function (map, user){

            self.moduleManager = { modules: [] };

            self.boundsMap = map;

            var promises = [];

            var dataServicePromise = dataService.load(self._content);
            self.moduleManager.dataService = dataService;
            promises.push(dataServicePromise);

            var worldHeritagePromise = worldHeritageService.load(map, self._content);
            promises.push(worldHeritagePromise);

            var countryPromise = countriesService.load(map, self._content, self.style.country_default, self.activateCountry);
            promises.push(countryPromise);

            visaService.initUserSettings("UKR");
            self.moduleManager.modules.push(visaService);
            self.moduleManager[visaService.name] = visaService;
            promises.push(visaService.load(self._content));

            resetOptions(budgetService);
            self.moduleManager.modules.push(budgetService);
            self.moduleManager[budgetService.name] = budgetService;
            promises.push(budgetService.load(self._content));
/*
            if(user.homeCountry){
                visaService.initUserSettings(user.schengenVisa, user.usaVisa, user.homeCountry);
                self.moduleManager.modules.push(visaService);
                self.moduleManager[visaService.name] = visaService;
                promises.push(visaService.load(self._content));

            } else {

                $(budgetService.options).each(function(){
                    this.checked = true;
                });

            }
*/
            resetOptions(touristService);
            self.moduleManager.modules.push(touristService);
            self.moduleManager[touristService.name] = touristService;
            promises.push(touristService.load(self._content));

            resetOptions(safetyService);
            self.moduleManager.modules.push(safetyService);
            self.moduleManager[safetyService.name] = safetyService;
            promises.push(safetyService.load(self._content));

            resetOptions(internetService);
            self.moduleManager.modules.push(internetService);
            self.moduleManager[internetService.name] = internetService;
            promises.push(internetService.load(self._content));

            resetOptions(temperatureService);
            self.moduleManager.modules.push(temperatureService);
            self.moduleManager[temperatureService.name] = temperatureService;
            promises.push(temperatureService.load(self._content));

            resetOptions(rainService);
            self.moduleManager.modules.push(rainService);
            self.moduleManager[rainService.name] = rainService;
            promises.push(rainService.load(self._content));

            return $q.all(promises);
        }

        self.initDefaults = function(country){
            setTimeout(function(){
                $("input:checked").parent("label:not(.active)").button("toggle");
                temperatureService.initDefault();
                rainService.initDefault();
                if(country){
                    temperatureService.monthPanel().show();
                    rainService.rainPanel().show();
                }
            }, 100)
        }

        self.evaluateMap = function (){
            self.activeFilters = [];

            $(self.moduleManager.modules).each(function(){
                var module = this;
                if(module.options){
                    var active = {name: module.name, aliases: [], origin: module};
                    var isActives = $(module.options).filter(function(){
                        if(this.checked){
                            active.aliases.push(this.alias);
                        }
                        return this.checked;
                    });

                    if(isActives.length){
                        self.activeFilters.push(active);
                    }
                }
            })

            if(self.activeFilters.length){
                if(self.activeFilters.length == 1){
                    countriesService.layer.setStyle(self.setupSinglefilter);
                }else{
                    countriesService.layer.setStyle(self.setupMultifilter);
                }
            }else{
                countriesService.layer.setStyle(self.style.country_default);
            }

            $(self.moduleManager.modules).each(function(){
                var module = this;
                if(module["evaluateGlobal"]){
                    module["evaluateGlobal"](self.activeFilters);
                }
            });
        }

        self.setupSinglefilter = function(feature){
            var color = "gray";

            var mod = self.activeFilters[0];
            var resultFromSection = mod.origin.setup(feature);

            if ($.inArray(resultFromSection, mod.aliases) != -1){
                color = resultFromSection;
            }

            return ({
                weight: 0,
                fillColor: colorSelector(color),
                color: colorSelector(color),
                opacity: 1,
            });
        };

        self.setupMultifilter = function(feature){
            var color = "gray";
            var result = true;
            $(self.activeFilters).each(function(){
                var mod = this;
                var resultFromSection = mod.origin.setup(feature);

                var mapArray = JSON.parse(JSON.stringify(mod.aliases));

                // Adding support for multifilter for countries where we don't have data for;
                mapArray.push("gray");

                result = $.inArray(resultFromSection, mapArray) != -1;
                return result;
            });

            if (result){
                color = "green";
            }

            return ({
                weight: 0,
                fillColor: colorSelector(color),
                color: colorSelector(color),
                opacity: 0.8,
            });
        };

        self.monthChanged = function(){
            if(self.moduleManager.country){
                self.evaluateModules(self.moduleManager.country);
            } else{
                self.evaluateMap();
            }
        }

        self.deactivateCountry = function(){
            self.moduleManager.country = null;
            self.evaluateMap();
            self.evaluateModules();
            $state.transitionTo('filter', null, { location: true, notify: false });
        }

        self.activateCountryByIso = function(iso3){
            var country = countriesService.getCountryByIso(iso3);
            var bounds = new L.LatLngBounds(new L.LatLng(country.c.properties.min[1], country.c.properties.min[0]),
                                            new L.LatLng(country.c.properties.max[1], country.c.properties.max[0]));
            self.activateCountry(country.c, country.l, bounds);

        }

        self.activateCountry = function(active, layer, bounds){
            if(self.moduleManager.country && self.moduleManager.country.getId() == active.getId())
            {
                self.deactivateCountry();
                self.boundsMap.setView(L.latLng(0, 0),3);
            } else {
                self.moduleManager.country = active;
                self.evaluateModules(active);
                layer.setStyle(self.style.country_default);
                $state.transitionTo('filter', { iso3: active.properties.ISO3 }, { location: true, notify: false });
                self.boundsMap.fitBounds(bounds);
            }
        }

        self.evaluateModules = function(active){
            $(self.moduleManager.modules).each(function(){
                var module = this;
                if(module["evaluateCountry"]){
                    module["evaluateCountry"](active);
                }
            });
        }

        self.canChangeFilters = function (){
            return self.moduleManager.country == null;
        }
    }

})();
