
(function() {

    angular.module('real.planet')
        .service('visaService', ["$q", "baseFilterService", visaService]);

    function visaService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

        self._schengen = self._usa = false,

        self._file = "visa/round.world.visa.{country}.json",

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
            var filePath = self._file.replace("{country}", self._country);
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

        self.canShowTimaticLink = function(target){
            return self._country.toLowerCase() !== target.toLowerCase();
        };

        self.showTimatic = function(target){
            var info = null;
            var visaInfos = self.data.filter(function(f){ return f.target == target; });

            if(self.timaticWindow){
                self.timaticWindow.close();
                self.timaticWindow = null;
            }

            if(visaInfos.length == 1){
                var x = screen.width/2 - 300/2;
                var y = screen.height/2 - 500/2;
                self.timaticWindow = window.open("", "Detailed Visa Information", "location=0,menubar=0,status=0,titlebar=0,toolbar=0,width=300px,height=535px,left=" + x +"px,top=" + y +"px");
                self.timaticWindow.document.write(self.constructChildWindow(visaInfos[0]));
            }
        };

        self.constructChildWindow = function(data){
            return data.shortInfo
                    + "<hr>" +
                    data.longInfo
                    + "<hr>" +
                    data.vaccination;
        }
    }

})();
