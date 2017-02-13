
(function() {

    angular.module('real.planet').service('internetService', ["$q", "baseFilterService", internetService]);

    function internetService($q, baseFilterService){
        var self = angular.extend(this, baseFilterService);

		self.name = "internet";
		self.icon = {i: true, class: "icon-internet-main", text: "Internet"};
		self.order = 5;
		self.options = [
				{alias:"blue", text: "Wifi everywhere", checked: false, icon: {i: true, class: "icon-internet-green-filter", cellWidth: "25%"}},
				{alias:"green", text: "Easy access", checked: false, icon: {i: true, class: "icon-internet-yellow-filter", cellWidth: "25%"}},
				{alias:"yellow", text: "Wifi can be found", checked: false, icon: {i: true, class: "icon-internet-orange-filter", cellWidth: "25%"}},
				{alias:"red", text: "OMG no internet...", checked: false, icon: {i: true, class: "icon-internet-red-filter", cellWidth: "25%"}}
			];

        self.calculate = function(item){
            if(item.index < 15) {
                item.alias = "red";
            }
            else if(item.index < 40) {
                item.alias = "yellow";
            }
            else if(item.index < 75) {
                item.alias = "green";
            }
            else {
                item.alias = "blue";
            }

            return item;
        }
	}

})();
