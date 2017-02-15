
(function() {

    angular.module('real.planet')
        .service('visaService', ["$q", "baseFilterService", visaService]);

    function visaService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

        self._file = "visa/real.planet.{country}.json",

        self.name = "visa",

        self.order = 1,

        self.icon = {i: true, class: "icon-visa-main", text: "Visa"},

        self.options = [
                {alias:"blue", text: "Home country", checked: true, icon: {i: true, class: "icon-home", cellWidth: "25%"}},
                {alias:"green", text: "Don't required", checked: true, icon: {i: true, class: "icon-visa-green-filter", cellWidth: "25%"}},
                {alias:"yellow", text: "On arrival or other", checked: true, icon: {i: true, class: "icon-visa-yellow-filter", cellWidth: "25%"}},
                {alias:"red", text: "Required", checked: true, icon: {i: true, class: "icon-visa-red-filter", cellWidth: "25%"}}
            ],

        self.initUserSettings = function(country){
            self._country = country;
            self._fileTemplate = self._file.replace("{country}", country);
        }

        self.setupCountry = function (feature) {
            return self.setup(feature);
        };

        self.setup = function (feature) {
            var item = self.getDataItem(feature, self.data);
            return item ? item.alias : 'gray';
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

        self.calculate = function(item){

            if(item.index === "HomeCountry") {
                item.alias = "blue";
            }

            if(item.index === "NotRequired") {
                item.alias = "green";
            }

            if(item.index === "OnArrival") {
                item.alias = "yellow";
            }

            if(item.index === "Required") {
                item.alias = "red";
            }

            return item;
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
                var width = 500;
                var height = 700;
                var x = screen.width/2 - width/2;
                var y = screen.height/2 - height/2;
                self.timaticWindow = window.open("", "Detailed Visa Information", "location=0,menubar=0,status=0,titlebar=0,toolbar=0,width=" + width + "px,height=" + height + "px,left=" + x +"px,top=" + y +"px");
                self.timaticWindow.document.write(self.constructChildWindow(visaInfos[0]));
            }
        };

        self.constructChildWindow = function(data){
            return "<style> h2{color: #222533} .trip{display:block;}</style>"+ data.fullText + "<hr>";
        }
    }

})();
