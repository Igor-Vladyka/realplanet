
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
    }

})();
