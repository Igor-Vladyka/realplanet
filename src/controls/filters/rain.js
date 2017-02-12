
(function() {

    angular.module('real.planet').service('rainService', ["$q", "baseFilterService", rainService]);

    function rainService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self._selected = new Date().getMonth() + 1;

		self.name = "rain";

		self._file = "weather/real.planet.weather.json";

		self.icon = {i: true, class: "icon-weather-main", text: "Rains"};

		self.order = 6;

		self.options = [
                {alias:"red", text: "No raint at all", checked: false, icon: {i: true, class: "icon-fire", cellWidth: "20%"}},
				{alias:"yellow", text: "True rare", checked: false, icon: {i: true, class: "icon-weather-green-filter", cellWidth: "20%"}},
				{alias:"green", text: "Sometimes", checked: false, icon: {i: true, class: "icon-weather-yellow-filter", cellWidth: "20%"}},
				{alias:"blue", text: "Happens", checked: false, icon: {i: true, class: "icon-weather-orange-filter", cellWidth: "20%"}},
                {alias:"white", text: "Alwais rainy", checked: false, icon: {i: true, class: "icon-weather-red-filter", cellWidth: "20%"}},
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
            self.rainPanel().find("input:radio[value='" + self._selected+"']").parent().button("toggle");
        }

		self.rainPanel = function (){return $("#rainMonthPanel");};

        self.calculate = function (rainfall, all){
            if(rainfall < 1){
                return "grey";
            }

            if(rainfall < 20){
                return "red";
            }

            if(rainfall < 70){
                return "yellow";
            }

            if(rainfall < 120){
                return "green";
            }


            if(rainfall < 200){
                return "blue";
            }
            all.push(rainfall);
            return "white";
        }

        self.mapper = function(data){
            var all = [];
            var newData = data.map(function(root){
                return {
                    target: root.target,
                    months: root.months.map(function(m){
                        return {
                            number: m.number,
                            alias: self.calculate(m.rainfall, all),
                            name: m.name
                        }
                    })
                }
            });

            console.log("MAX: " + all.sort()[all.length - 1]);
            return data;
        }

		self.load = function (path){
			return self.initialLoad(path + self._file).then(function(data){ self.data = self.mapper(data); });
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
				self.rainPanel().show();
				self.activeCountry = {};
			}else{
				$(self.months).filter(function(){
					this.alias = null;
					this.icon = null;
					return true;
				});
				self.rainPanel().hide();
				self.activeCountry = null;
			}
		};

		self.evaluateGlobal = function(activeFilters){
			var showRainPanel = $.grep(activeFilters, function (e) { return e.name === self.name; }).length > 0;
			if(showRainPanel){
				self.rainPanel().show();
			}else{
				self.rainPanel().hide();
			}
		};

	}

})();
