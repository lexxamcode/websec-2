<script>
    import maplibregl from 'maplibre-gl';
    import  { onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { getStopsFromXml } from './Stop.js';

    let map;
    let stops;
    let samara_point = new maplibregl.LngLat(50.22125, 53.2415);

    onMount(async () => {
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=3csEM5VieqZlKB7sM6UR',
            center:  samara_point,
            zoom: 10
        });
        map.on('load', () => {
                stops = getStopsFromXml(map);
                map.addControl(
                    new maplibregl.GeolocateControl({
                        positionOptions: {
                            enableHighAccuracy: true
                        },
                        trackUserLocation: true
                    })
                );
        });

    });

    export async function findStop(coords) {
        map.flyTo({
            center: coords,
            zoom: 20,
            essential: true
        });
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