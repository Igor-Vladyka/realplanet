
(function() {

    angular.module('real.planet').service('touristService', ["$q", "baseFilterService", touristService]);

    function touristService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self._file = "tourist/round.world.tourist.json";

		self.name = "tourist";

		self.icon = {i: true, class: "icon-tourists-main", text: "Tourists"};

		self.order = 4;

		self.options = [
				{alias:"blue", text: "You are white man", checked: false, icon: {i: true, class: "icon-tourists-green-filter", cellWidth: "25%"}},
				{alias:"green", text: "Messing around", checked: false, icon: {i: true, class: "icon-tourists-yellow-filter", cellWidth: "25%"}},
				{alias:"yellow", text: "Tourist grouping", checked: false, icon: {i: true, class: "icon-tourists-orange-filter", cellWidth: "25%"}},
				{alias:"red", text: "Tourist jam", checked: false, icon: {i: true, class: "icon-tourists-red-filter", cellWidth: "25%"}}
			];

		self.load = function (path){
			return self.initialLoad(path + self._file).then(function(data){ self.data = data; });
		};

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
    }

})();
