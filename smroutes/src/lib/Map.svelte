<script>
    import maplibregl from 'maplibre-gl';
    import { onMount } from 'svelte';
    import 'maplibre-gl/dist/maplibre-gl.css';
    import { getStopsFromXml } from './Stop.svelte';

    let map;
    let samara_point = new maplibregl.LngLat(50.22125, 53.2415);
    let stops = getStopsFromXml();

    let mapLanguage="ru";
    const bounds = [
        [50.05, 53.14],
        [50.3,53.26]
    ];
    

    onMount(() => {
        map = new maplibregl.Map({
            container: 'map',
            style: 'https://api.maptiler.com/maps/5a2e698d-bf96-462a-a122-fbd86ebc7aae/style.json?key=r9k1CXRP7YCqI9zWOIjp',
            center:  samara_point,
            zoom: 10
        });

        map.addControl(
        new maplibregl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
            })
        );
        map.setLayoutProperty('')
     })

    function locate() {

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