
(function() {

    angular.module('real.planet').service('budgetService', ["$q", "baseFilterService", budgetService]);

    function budgetService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

        self.name = "budget";
        self.icon = {i: true, class: "icon-budget-main", text: "Budget"};
        self.order = 2;
        self.options = [
                {alias:"blue", text: "Cheapest", checked: false, icon: {i: true, class: "icon-budget-green-filter", cellWidth: "25%"}},
                {alias:"green", text: "Really nice", checked: false, icon: {i: true, class: "icon-budget-yellow-filter", cellWidth: "25%"}},
                {alias:"yellow", text: "Can afford", checked: false, icon: {i: true, class: "icon-budget-orange-filter", cellWidth: "25%"}},
                {alias:"red", text: "Highest costs", checked: false, icon: {i: true, class: "icon-budget-red-filter", cellWidth: "25%"}}
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
            if(item.index < 0.43) {
                item.alias = "blue";
            }
            else if(item.index < 0.61) {
                item.alias = "green";
            }
            else if(item.index < 0.86) {
                item.alias = "yellow";
            }
            else {
                item.alias = "red";
            }

            return item;
        };
    }

})();
