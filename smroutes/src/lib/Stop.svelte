<script context="module">
    import {XMLHttpRequest} from "xhr2";
    import * as cheerio from 'cheerio';
    import * as convert from 'xml-js';

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
        let stopsXmlList = null;
        var x = new XMLHttpRequest();
        x.open("GET", "https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml", [false, null, null]);
        x.send();
        let stops = [];
        x.onload = function() {
            let jsonDocument = JSON.parse(convert.xml2json(x.response, {compact: true, spaces: 4}));
            let jsonStops = jsonDocument['stops'];
            
            for (let i = 0; i < jsonStops.length; i++) {
                let stop = jsonStops[i];
                let id = stop["KS_ID"].text();
                console.log(id);
                let title = stop['title'].text();
                let coords = [
                    stop['latitude'].text(),
                    stop['longitude'].text()
                ]
                let adjacentStreet = stop['adjacentStreet'].text()
                let direction = stop['direction'].text();

                let transport = {};
                transport["busesMunicipal"] = stop['busesMunicipal'].text();
                transport["busesCommercial"] = stop['busesCommercial'].text();
                transport["busesPrigorod"] = stop['busesPrigorod'].text();
                transport["busesSeason"] = stop['busesSeason'].text();
                transport["busesSpectial"] = stop['busesSpecial'].text();
                transport["busesIntercity"] = stop['busesIntercity'].text();
                transport["trams"] = stop['trams'].text();
                transport["trolleybuses"] = stop['trolleybuses'].text();
                transport["metros"] = stop['metros'].text();
                transport["electricTrains"] = stop['electricTrains'].text();
                transport["riverTransports"] = stop['riverTransports'].text();

                stops.push(new Stop(id, title, coords, adjacentStreet, direction, transport));
            }

            return stops;
        };
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