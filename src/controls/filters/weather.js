
(function() {

    angular.module('real.planet').service('weatherService', ["$q", "baseFilterService", weatherService]);

    function weatherService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self._selected = new Date().getMonth() + 1;

		self.name = "weather";

		self._file = "weather/round.world.weather.json";

		self.icon = {i: true, class: "icon-weather-main", text: "Weather"};

		self.order = 6;

		self.options = [
				{alias:"white", text: "Below zero", checked: false, icon: {i: true, class: "icon-weather-red-filter", cellWidth: "20%"}},
				{alias:"blue", text: "Quite cold", checked: false, icon: {i: true, class: "icon-weather-orange-filter", cellWidth: "20%"}},
				{alias:"green", text: "Just right", checked: false, icon: {i: true, class: "icon-weather-yellow-filter", cellWidth: "20%"}},
				{alias:"yellow", text: "Comfortable", checked: false, icon: {i: true, class: "icon-weather-green-filter", cellWidth: "20%"}},
				{alias:"red", text: "Hot potato", checked: false, icon: {i: true, class: "icon-fire", cellWidth: "20%"}}
			];

		self.months = [{index: 1, name: "Jan", class:"width-33 divider-border-vertical-right"},
				{index: 2, name: "Feb", class:"width-34 divider-border-vertical-center"},
				{index: 3, name: "Mar", class:"width-33 divider-border-vertical-left"},
				{index: 4, name: "Apr", class:"width-33 divider-border-vertical-right"},
				{index: 5, name: "May", class:"width-34 divider-border-vertical-center"},
				{index: 6, name: "June", class:"width-33 divider-border-vertical-left"},
				{index: 7, name: "July", class:"width-33 divider-border-vertical-right"},
				{index: 8, name: "Aug", class:"width-34 divider-border-vertical-center"},
				{index: 9, name: "Sept", class:"width-33 divider-border-vertical-left"},
				{index: 10, name: "Oct", class:"width-33 divider-border-vertical-right"},
				{index: 11, name: "Now", class:"width-34 divider-border-vertical-center"},
				{index: 12, name: "Dec", class:"width-33 divider-border-vertical-left"}];

		self.monthPanel = function(){return $("#monthPanel");};

		self.load = function (path){
			return self.initialLoad(path + self._file).then(function(data){ self.data = data; });
		};

		self.setup = function (feature) {

			var color = 'gray';

			var weather = self.getDataItem(feature, self.data);

			if (weather != null) {
				var month = $.grep(weather.months, function (e) { return e.number === self._selected; });
				color = month[0].alias;
			}

			return color;
		};

		self.setupMonth = function (feature, index) {
			var color = 'gray';

			var weather = self.getDataItem(feature, self.data);

			if (weather != null) {
				var month = $.grep(weather.months, function (e) { return e.number === index; });
				color = month[0].alias;
			}

			return color;
		};

		self.evaluateCountry = function(feature){
			if(feature){
				$(self.months).filter(function(){
					this.alias = self.setupMonth(feature, this.index);
					var a = this.alias;
					this.icon = self.getCountryOption(feature, self.options, function(){return a;});
					return true;
				});
				self.monthPanel().show();
				self.activeCountry = {};
			}else{
				$(self.months).filter(function(){
					this.alias = null;
					this.icon = null;
					return true;
				});
				self.monthPanel().hide();
				self.activeCountry = null;
			}
		};

		self.evaluateGlobal = function(activeFilters){
			var showMonthPanel = $.grep(activeFilters, function (e) { return e.name === self.name; }).length > 0;
			if(showMonthPanel){
				self.monthPanel().show();
			}else{
				self.monthPanel().hide();
			}
		};

	}

})();
