<script>
    import maplibregl from 'maplibre-gl';
    import  { onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { getStopsFromXml } from './Stop.js';
    import Bus from "carbon-icons-svelte/lib/Bus.svelte";

    let map;
    let samara_point = new maplibregl.LngLat(50.22125, 53.2415);
    let stops = {
            "name":"stops-points",
            "type":"FeatureCollection",
            "features":[]
        };
    let mapLanguage="ru";
    const bounds = [
        [50.05, 53.14],
        [50.3,53.26]
    ];
    

    onMount(async () => {
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/5a2e698d-bf96-462a-a122-fbd86ebc7aae/style.json?key=r9k1CXRP7YCqI9zWOIjp',
            center:  samara_point,
            zoom: 10
        });
        map.on('load', () => {
            map.addSource('stops', {
                'type': 'geojson',
                'data': stops,
                cluster: true,
                clusterMaxZoom: 14, // Max zoom to cluster points on
                clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
            });
            
            map.addLayer(
            {
                'id' : 'stops',
                'type': 'circle',
                'source' : 'stops',
                'paint': 
                {
                    "circle-color": "red",
                    "circle-blur": 1,
                    "circle-opacity": 0.5,
                    "circle-radius" : 10
                }
            });
            map.addControl(
                new maplibregl.GeolocateControl({
                    positionOptions: {
                        enableHighAccuracy: true
                    },
                    trackUserLocation: true
                })
            );
            addStopsChunkByChunk();
        })
})

async function addStopsChunkByChunk() {
    let stopChunks = await getStopsFromXml();
    for (let stopChunk of stopChunks) {
        stops.features.push(stopChunk);
        (map.getSource('stops')).setData(stops);
    }
}

</script>

<div id="map"></div>

<style>
    #map {
        position: absolute;
        left: 0;
        top: 40px;
        bottom: 0;
        right: 0;
    }
</style>