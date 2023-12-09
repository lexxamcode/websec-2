<script context="module">
    export class SmroutesObject {
        constructor(id, title, coords) {
            this.id = id;
            this.title = title;
            this.coords = coords;
        }
    }
    export class Stop extends SmroutesObject {
        constructor(id,
                title,
                coords,
                adjacentStreet,
                direction,
                transport) {
            super(id, title, coords);
            this.adjacentStreet = adjacentStreet;
            this.direction = direction;
            this.transport = transport;
    }
};

    export function getStopsFromXml() {
        let url = 'https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml';

    let request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send();

    let xml = request.responseXML;

    let stops = [];
    let stopsXmlList = xml.getElementsByTagName('stop');

    for (let i = 0; i < stopsXmlList.length; i++) {
        let stop = stopsXmlList[i];

        let id = stop.getElementsByTagName('KS_ID')[0].childNodes[0].nodeValue;
        let title = stop.getElementsByTagName('title')[0].childNodes[0].nodeValue;
        let coords = [
            stop.getElementsByTagName('latitude')[0].childNodes[0].nodeValue,
            stop.getElementsByTagName('longitude')[0].childNodes[0].nodeValue
        ]
        let adjacentStreet = stop.getElementsByTagName('adjacentStreet')[0].childNodes[0].nodeValue
        let direction = stop.getElementsByTagName('direction')[0].childNodes[0].nodeValue;

        let transport = {};
        transport["busesMunicipal"] = stop.getElementsByTagName('busesMunicipal')[0].childNodes[0].nodeValue;
        transport["busesCommercial"] = stop.getElementsByTagName('busesCommercial')[0].childNodes[0].nodeValue;
        transport["busesPrigorod"] = stop.getElementsByTagName('busesPrigorod')[0].childNodes[0].nodeValue;
        transport["busesSeason"] = stop.getElementsByTagName('busesSeason')[0].childNodes[0].nodeValue;
        transport["busesSpectial"] = stop.getElementsByTagName('busesSpecial')[0].childNodes[0].nodeValue;
        transport["busesIntercity"] = stop.getElementsByTagName('busesIntercity')[0].childNodes[0].nodeValue;
        transport["trams"] = stop.getElementsByTagName('trams')[0].childNodes[0].nodeValue;
        transport["trolleybuses"] = stop.getElementsByTagName('trolleybuses')[0].childNodes[0].nodeValue;
        transport["metros"] = stop.getElementsByTagName('metros')[0].childNodes[0].nodeValue;
        transport["electricTrains"] = stop.getElementsByTagName('electricTrains')[0].childNodes[0].nodeValue;
        transport["riverTransports"] = stop.getElementsByTagName('riverTransport')[0].childNodes[0].nodeValue;

        stops.append(new Stop(id, title, coords, adjacentStreet, direction, transport));
    }

    return stops;
    };

    export function makeStopsLayer(stops) {
        var geojson = {
            "name": "stops",
            "type:": "FeatureCollection",
            "features": []
        };

        geojson.features.push({
            "type": "Feature",
            "geometry": 
            {
                "type": "Point",
                "coordinates": [],
            },
            "properties": 
            {
                "id": null,
                "title": null,
                "adjacentStreet": null,
                "direction": null,
                "transport": {}
            }
        })

        for (let i = 0; i < stops.length; i++) {
            geojson.features.push({
                "type": "Feature",
                "geometry": 
                {
                    "type": "Point",
                    "coordinates": [],
                },
                "properties": 
                {
                    "id": null,
                    "title": null,
                    "adjacentStreet": null,
                    "direction": null,
                    "transport": {}
                }
            })

        geojson.features[i].geometry.coordinates.push(stops[i].coordinates);
        geojson.features[i].properties.id.push(stops[i].id);
        geojson.features[i].properties.title.push(stops[i].title);
        geojson.features[i].properties.adjacentStreet.push(stops[i].adjacentStreet);
        geojson.features[i].properties.direction.push(stops[i].direction);
        geojson.features[i].properties.transport.push(stops[i].transport);
    }

    return geojson;
}
</script>