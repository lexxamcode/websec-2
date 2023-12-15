import * as convert from 'xml-js';
import sha1 from 'js-sha1';

export async function getStopsFromXml(map) {
    const response = await fetch('https://tosamara.ru/api/v2/classifiers/stopsFullDB.xml');
    const responseText = await response.text();

    let markers =[];
    let stops = {
        "name":"stops-points",
        "type":"FeatureCollection",
        "features":[]
    };
    let jsonDocument = JSON.parse(convert.xml2json(responseText, {compact: true, spaces: 4}));
    let jsonStops = (jsonDocument['stops'])['stop'];
    
    for (let i = 0; i < Object.keys(jsonStops).length; i++) {
        stops.features.push({ 
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [parseFloat(jsonStops[i]['longitude']['_text']), parseFloat(jsonStops[i]['latitude']['_text'])]
            },
            "properties": {
                "id": jsonStops[i]['KS_ID']['_text'],
                "title": jsonStops[i]['title']['_text'],
                "adjacentStreet": jsonStops[i]['adjacentStreet']['_text'],
                "direction": jsonStops[i]['direction']['_text'],
                "transport": {
                    "busesMunicipal":  jsonStops[i]['busesMunicipal']['_text'],
                    "busesCommercial": jsonStops[i]['busesCommercial']['_text'],
                    "busesPrigorod": jsonStops[i]['busesPrigorod']['_text'],
                    "busesSeason": jsonStops[i]['busesSeason']['_text'],
                    "busesSpecial": jsonStops[i]['busesSpecial']['_text'],
                    "busesIntercity": jsonStops[i]['busesIntercity']['_text'],
                    "trams": jsonStops[i]['trams']['_text'],
                    "trolleybuses": jsonStops[i]['trolleybuses']['_text'],
                    "metros": jsonStops[i]['metros']['_text'],
                    "electricTrains": jsonStops[i]['electricTrains']['_text'],
                    "riverTransports": jsonStops[i]['riverTransports']['_text'],
                }
            }
        });
        let feature = stops.features[i];
        const featureProperties = feature.properties;
        const popupContent = 
        `
            <p>${featureProperties.title}</p>
            <p>Направление:</p>
            <h>${featureProperties.direction}</h>
            <h>Прогноз</h>
            <textarea readonly id='arrival'></textarea>
            <h>Весь транспорт</h>
            <select id='transport'>
                <option>Тип транспорта</option>
                <option value='busesMunicipal'>Муниципальный</option>
                <option value='busesCommercial'>Коммерческий</option>
                <option value='busesPrigorod'>Пригородный</option>
                <option value='busesSeason'>Сезонный</option>
                <option value='busesSpecial'>Специальный</option>
                <option value='busesIntercity'>Межгород</option>
                <option value='trams'>Трамваи</option>
                <option value='trolleybuses'>Троллейбусы</option>
                <option value='metros'>Метро</option>
                <option value='electricTrains'>Электропоезда</option>
                <option value='riverTransports'>Речной</option>
            </select>
            <textarea readonly id='selected-transport'></textarea>
        `

        let popup = new maplibregl.Popup()
            .setLngLat(feature.geometry.coordinates)
            .setHTML(popupContent)
            .addTo(map);
        // Загружать прогноз при нажтии на маркер
        popup.on('open', async () => {
            let response = await fetch(`https://tosamara.ru/api/v2/json?method=getFirstArrivalToStop&KS_ID=${featureProperties.id}&os=android&clientid=test&authkey=${sha1(featureProperties.id+"just_f0r_tests")}`);
            let arrivalJson= await response.json();
            let arrivals = arrivalJson.arrival;

            let arrivalContent = ``;
            for (let i = 0; i < arrivals.length; i++) {
                var arrivalDiv = document.createElement('div');
                arrivalContent += `${arrivals[i].type} номер ${arrivals[i].number} будет через ${Math.trunc(arrivals[i].time / 60)} ч. ${arrivals[i].time % 60} м.\n`
            }


            document.getElementById('arrival').value = arrivalContent;
        });

        const tansportSelectElement = document.getElementById("transport");
        tansportSelectElement.addEventListener('change', () => {
            let value  = featureProperties.transport[document.getElementById('transport').value];
            if (value == null) {
                document.getElementById('selected-transport').value = 'Нет подходящих маршрутов';
            }
            else
                document.getElementById('selected-transport').value = value;
        });

        const marker = document.createElement('div');
        marker.className = 'stopMarker';

        let newMarker = new maplibregl.Marker({element: marker})
            .setLngLat(feature.geometry.coordinates)
            .setPopup(popup)
            .addTo(map);

    };
    return stops, markers;
}

export async function arrivalsForStop(id) {
   
    return JSON.parse(responseText);
}
