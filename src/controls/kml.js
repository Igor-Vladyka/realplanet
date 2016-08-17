
(function() {

    angular.module('real.planet').service('kml', kml);

    function kml(){

        var self = this;
        self.styles = ["red","blue","brown", "green", "orange", "pink", "purple", "yellow"];

        self.CreateKML = function(name, collection){
            download("MyTrip.kml", tripToKML(self.styles, name, collection));
        }

        function download(filename, text) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:application/vnd.google-earth.kml+xml;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        }

        function tripToKML(styles, name, collection){
            var kmlBaseTemplate = '<?xml version="1.0" encoding="UTF-8"?><kml xmlns="http://earth.google.com/kml/2.2">{document}</kml>';
            var styleTemplate = '<Style id="placemark-{style}"><IconStyle><Icon><href>http://mapswith.me/placemarks/placemark-{style}.png</href></Icon></IconStyle></Style>';
            var placeMarkTemplate = '<Placemark><name><![CDATA[{name}]]></name><description><![CDATA[{description}]]></description><styleUrl>#placemark-{style}</styleUrl><Point><coordinates>{coordinates}</coordinates></Point></Placemark>';
            var endDocumentReplaceTemplate = "</Document>";
            var startDocumentReplaceTemplate = "<Document>";
            var doc = {Document: { name: name, visibility: 1 }}

            var result = kmlBaseTemplate.replace("{document}",json2xml(doc));

            $(styles).each(function(){
                var color = this;
                result = result.replace(startDocumentReplaceTemplate, startDocumentReplaceTemplate + styleTemplate.replace("{style}", color).replace("{style}", color));
            })

            $(collection).each(function(){
                var coll = this;
                $(coll.placemarks).each(function(){
                    var mark = this;
                    var lat = mark.coordinates.split(',')[0];
                    var lng = mark.coordinates.split(',')[1];
                    var desc = coll.name;
                    if(mark.description){
                        desc = desc + "\r\n" + mark.description
                    }
                    result = result.replace(endDocumentReplaceTemplate, placeMarkTemplate.replace("{name}", mark.name).replace("{description}", desc).replace("{style}", coll.style).replace("{coordinates}", lng + "," + lat) + endDocumentReplaceTemplate);
                })
            })

            return result;
        }

}
})();
