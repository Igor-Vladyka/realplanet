
(function() {

    angular.module('real.planet').service('temperatureService', ["$q", "baseFilterService", temperatureService]);

    function temperatureService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self._selected = new Date().getMonth() + 1;

		self.name = "temperature";

		self._file = "weather/real.planet.weather.json";

		self.icon = {i: true, class: "icon-weather-main", text: "Temperature"};

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

        self.initDefault = function(){
            self.monthPanel().find("input:radio[value='" + self._selected+"']").parent().button("toggle");
        }

		self.monthPanel = function(){return $("#" + self.name + "MonthPanel");};

        self.calculate = function (temperature){
            if(temperature <= 0) { return "white"; }
            if(temperature < 10) { return "blue"; }
            if(temperature < 19) { return "green"; }
            if(temperature < 27) { return "yellow"; }

            return "red";
        };

        self.mapper = function(data){
            var newData = data.map(function(root){
                return {
                    target: root.target,
                    months: root.months.map(function(m){
                        return {
                            number: m.number,
                            alias: self.calculate(m.index),
                            title: Math.floor(m.index) + "°",
                            index: m.index
                        }
                    })
                }
            });

            return newData;
        };

		self.setup = function (feature) {
			return self.setupMonth(feature, self._selected);
		};

		self.setupMonth = function (feature, index) {
			var color = 'gray';

			var weather = self.getDataItem(feature, self.data);

			if (weather != null) {
				var month = $.grep(weather.months, function (e) { return e.number === index; });
                if(month.length) {
                    color = month[0].alias;
                }
			}

			return color;
		};

        self.getIconTitle = function (feature, index) {
			var title = null;

			var weather = self.getDataItem(feature, self.data);

			if (weather != null) {
				var month = $.grep(weather.months, function (e) { return e.number === index; });
                if(month.length) {
                    title = month[0].title;
                }
			}

			return title;
		};

		self.evaluateCountry = function(feature){
			if(feature){
				$(self.months).filter(function(){
					this.alias = self.setupMonth(feature, this.index);
					var a = this.alias;
					this.icon = self.getCountryOption(feature, self.options, function(){ return a; });
                    this.title = (this.icon.text + "(" + self.getIconTitle(feature, this.index) + ")") || this.icon.text;
					return true;
				});
				self.monthPanel().show();
				self.activeCountry = {};
			}else{
				$(self.months).filter(function(){
					this.alias = null;
					this.icon = null;
                    this.title = null;
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
