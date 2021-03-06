
(function() {

    angular.module('real.planet').service('touristService', ["$q", "baseFilterService", touristService]);

    function touristService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self.name = "tourist";
		self.icon = {i: true, class: "icon-tourists-main", text: "Tourists"};
		self.order = 4;
		self.options = [
				{alias:"blue", text: "You are white man", checked: false, icon: {i: true, class: "icon-tourists-green-filter", cellWidth: "25%"}},
				{alias:"green", text: "Messing around", checked: false, icon: {i: true, class: "icon-tourists-yellow-filter", cellWidth: "25%"}},
				{alias:"yellow", text: "Tourist grouping", checked: false, icon: {i: true, class: "icon-tourists-orange-filter", cellWidth: "25%"}},
				{alias:"red", text: "Tourist jam", checked: false, icon: {i: true, class: "icon-tourists-red-filter", cellWidth: "25%"}}
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

            item.index = item.population && item.tourists ? item.tourists / item.population : 0;
            
            if(item.index === 0) {
                item.alias = "gray";
            }
            else if(item.index < 0.2) {
                item.alias = "blue";
            }
            else if(item.index < 0.6) {
                item.alias = "green";
            }
            else if(item.index < 0.8) {
                item.alias = "yellow";
            }
            else {
                item.alias = "red";
            }

            return item;
        };
    }

})();
