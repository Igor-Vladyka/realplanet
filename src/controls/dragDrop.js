(function() {

    angular.module('real.planet').service('dragDrop', ["PlannerService", dragDrop]);

    function dragDrop(PlannerService){

        var self = this;

        function FileDragHover(e) {
            e.stopPropagation();
            e.preventDefault();
            //e.target.className = (e.type == "dragover" ? "hover" : "");
        }

        // file selection
        function FileSelectHandler(e) {

            // cancel event and hover styling
            FileDragHover(e);

            // fetch FileList object
            var files = e.target.files || e.dataTransfer.files;

            // process all File objects
            for (var i = 0, f; f = files[i]; i++) {
                ParseFile(f);
            }

        }

        function ParseFile(file){
            if (file.name.indexOf(".kml") != -1) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var droppedKML = $.parseJSON(xml2json($.parseXML(e.target.result)).replace("\nundefined",""));
                    addNewDroppedTrip(droppedKML.kml.Document.name);

                }
                reader.readAsText(file);
            }

            if(file.name.indexOf("world-heritage") != -1){
                var reader = new FileReader();
                reader.onload = function(e) {
                    var places = $.parseJSON(e.target.result);
                    var trips = {};
                    $.getJSON(RW.path.countries.all(), function(data){
                        var features = data.features;
                        $(places).filter(function(){
                            var place = this;
                            var country = $(features).filter(function(){
                                return this.id == place.target;
                            });
                            if(country.length){
                                var countryName = country[0].properties.name;
                                if(trips.hasOwnProperty(countryName)){
                                    trips[countryName].push(place);
                                } else {
                                    trips[countryName] = [place];
                                }
                            } else {
                                console.log(place.target);
                            }

                            return true;
                        });

                        for(var t in trips){
                            var data = trips[t];
                            var p = Date.now();
                            PlannerService.addNewTrip(t, p).then(function(response){
                                var trip = response.data[0];
                                var collect = {};
                                $(data).filter(function(){
                                    var place = this;
                                    if(collect.hasOwnProperty(place.type)){
                                        collect[place.type].push({name: place.name, description: place.shortInfo, picture: place.image, coordinates: place.lat + "," + place.lng, tag: place.regionLong});
                                    } else {
                                        collect[place.type] = [{name: place.name, description: place.shortInfo, picture: place.image, coordinates: place.lat + "," + place.lng, tag: place.regionLong}];
                                    }

                                    return true;
                                });

                                for (var name in collect) {
                                    var style = "red";
                                    switch(name){
                                        case "Mixed":
                                            style = "yellow";
                                        break;
                                        case "Natural":
                                            style = "green";
                                        break;
                                    }
                                    addNewDroppedCollection({name: name, description: "", style : style, trip: trip.id}, collect[name]);
                                }
                            })
                        }
                    });
                }
                reader.readAsText(file);
            }
        }

        function addNewDroppedTrip(name){
            PlannerService.addNewTrip(name).then(function(response){
                var trip = response.data[0];
                addNewDroppedCollection({name: "Default", description: "Default collection for " + trip.name + "", style : "red", trip: trip.id}, parceKMLmarks(droppedKML.kml.Document.Placemark));
            })
        }

        function addNewDroppedCollection(collection, marksCollection){
            PlannerService.createCollection(collection).then(function(collection){
                $(marksCollection).each(function(){
                    var mark = this;
                    mark.collection = collection.id;
                    PlannerService.addMark(mark);
                });
            })
        }

        function parceKMLmarks(placemarksArray){
            var result = [];

            $(placemarksArray).each(function(){
                var mark = this;
                var coord = mark.Point.coordinates.split(",")[1] + "," + mark.Point.coordinates.split(",")[0];
                result.push({
                    name: mark.name,
                    coordinates: coord,
                    description: mark.description || ""
                })
            })

            return result;
        }

        function InitDragAndDrop(target){
            var filedrag = document.getElementById(target);

            filedrag.addEventListener("dragover", FileDragHover, false);
            filedrag.addEventListener("dragleave", FileDragHover, false);
            filedrag.addEventListener("drop", FileSelectHandler, false);
        }

        self.initialize = function(target){
            if (window.File && window.FileList && window.FileReader) {
                InitDragAndDrop(target);
            } else{
                console.log("Drag and Drop is not accessible.");
            }
        }
}
})();
