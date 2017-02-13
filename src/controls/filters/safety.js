
(function() {

    angular.module('real.planet').service('safetyService', ["$q", "baseFilterService", safetyService]);

    function safetyService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self.name = "safety";
		self.icon = {i: true, class: "icon-safety-main", text: "Safety"};
		self.order = 3;
		self.options = [
				{alias:"green", text: "Safest", checked: false, icon: {i: true, class: "icon-safety-green-filter", cellWidth: "33%"}},
				{alias:"yellow", text: "Should be careful", checked: false, icon: {i: true, class: "icon-safety-yellow-filter", cellWidth: "34%"}},
				{alias:"red", text: "Always look around", checked: false, icon: {i: true, class: "icon-safety-red-filter", cellWidth: "33%"}}
			];

        self.setupCountry = function (feature) {
            return self.setup(feature);
        };

        self.setup = function (feature) {
            var item = self.getDataItem(feature, self.data);
            return item ? item.alias : 'gray';
        };

        self.evaluateCountry = function(feature){
        	self.activeCountry = self.getCountryOption(feature, self.options, self.setup);
        };

        self.calculate = function(item){
            if(item.index === 0) {
                item.alias = "gray";
            }
            else if(item.index < 1.7) {
                item.alias = "green";
            }
            else if(item.index < 2.4) {
                item.alias = "yellow";
            }
            else {
                item.alias = "red";
            }

            return item;
        };
	}

})();
