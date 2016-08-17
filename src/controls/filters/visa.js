
(function() {

    angular.module('real.planet')
        .service('visaService', ["$q", "baseFilterService", visaService]);

    function visaService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

        self._schengen = self._usa = false,

        self._file = "visa/{country}/round.world.visa.{country}.json",

        self.name = "visa",

        self.order = 1,

        self.icon = {i: true, class: "icon-visa-main", text: "Visa"},

        self.options = [
                {alias:"blue", text: "Home country", checked: true, icon: {i: true, class: "icon-home", cellWidth: "25%"}},
                {alias:"green", text: "Don't required", checked: true, icon: {i: true, class: "icon-visa-green-filter", cellWidth: "25%"}},
                {alias:"yellow", text: "On arrival or other", checked: true, icon: {i: true, class: "icon-visa-yellow-filter", cellWidth: "25%"}},
                {alias:"red", text: "Required", checked: true, icon: {i: true, class: "icon-visa-red-filter", cellWidth: "25%"}}
            ],

        self.initUserSettings = function(schengen, usa, country){
            self._schengen = schengen;
            self._usa = usa;
            self._country = country;
        }

        self.load = function (path){
            var filePath = self._file.replace("{country}", self._country).replace("{country}", self._country);
            return self.initialLoad(path + filePath).then(function(data){ self.data = data; });
        };

        self.setupCountry = function (feature) {
            return self.setup(feature);
        };

        self.setup = function (feature) {
            var visa = self.getDataItem(feature, self.data);
            var color = 'gray';

            if (visa != null) {
                if(self._schengen && visa.alias.schengen === "green"){
                    color = visa.alias.schengen;
                }

                if(self._usa && visa.alias.usa === "green"){
                    color = visa.alias.usa;
                }

                if(color != "green"){
                    color = visa.alias.general;
                }
            }

            return color;
        };

        self.addEvents = function(){
            $(document).on('change', 'input:checkbox[value="schengen"],input:checkbox[value="usa"]', function (event) {
                self._schengen = $('input:checkbox[value="schengen"]').is(":checked");
                self._usa = $('input:checkbox[value="usa"]').is(":checked");
            });
        };

        self.evaluateCountry = function(feature){
            self.activeCountry = self.getCountryOption(feature, self.options, self.setup);

            if(feature && self.activeCountry.text){
                var data = self.getDataItem(feature, self.data);
                if(data && data.shortInfo){
                    self.activeCountry.text = data.shortInfo;
                }
            }
        };
    }

})();
