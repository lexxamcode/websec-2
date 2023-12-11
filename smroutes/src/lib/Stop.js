import * as convert from 'xml-js';
import maplibregl from 'maplibre-gl';

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

    export async function getStopsFromXml() {
        const response = await fetch('https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml');
        const responseText = await response.text();

        let stops = [];
        let jsonDocument = JSON.parse(convert.xml2json(responseText, {compact: true, spaces: 4}));
        let jsonStops = (jsonDocument['stops'])['stop'];
        
        for (let i = 0; i < Object.keys(jsonStops).length; i++) {
            let stop = jsonStops[i];
            let id = stop['KS_ID']['_text'];
            let title = stop['title']['_text'];
            let coords = [
                stop['latitude']['_text'],
                stop['longitude']['_text']
            ]
            let adjacentStreet = stop['adjacentStreet']['_text']
            let direction = stop['direction']['_text'];

            let transport = {};
            transport['busesMunicipal'] = stop['busesMunicipal']['_text'];
            transport['busesCommercial'] = stop['busesCommercial']['_text'];
            transport['busesPrigorod'] = stop['busesPrigorod']['_text'];
            transport['busesSeason'] = stop['busesSeason']['_text'];
            transport['busesSpectial'] = stop['busesSpecial']['_text'];
            transport['busesIntercity'] = stop['busesIntercity']['_text'];
            transport['trams'] = stop['trams']['_text'];
            transport['trolleybuses'] = stop['trolleybuses']['_text'];
            transport['metros'] = stop['metros']['_text'];
            transport['electricTrains'] = stop['electricTrains']['_text'];
            transport['riverTransports'] = stop['riverTransports']['_text'];

            stops[i] = new Stop(id, title, coords, adjacentStreet, direction, transport);
        }
        return makeStopsLayer(stops);
    };

    export function makeStopsLayer(stops) {
        let geojsonChunks = [];
        for (let i = 0; i < stops.length; i++) {
            let coords = new maplibregl.LngLat(parseFloat(stops[i].coords[1]), parseFloat(stops[i].coords[0]));
            geojsonChunks.push({ "type": "Feature","geometry": {"type": "Point","coordinates": [coords.lng, coords.lat]}, "properties": null});
        }
    return geojsonChunks;
};