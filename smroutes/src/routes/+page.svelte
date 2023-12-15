<script>
    import "carbon-components-svelte/css/white.css";
    import {
        Header,
        SideNav,
        SideNavItems,
        SideNavLink,
        SkipToContent,
        Content,
        ExpandableTile,
        Button,
        ClickableTile

    } from "carbon-components-svelte";
    import { onMount } from 'svelte';
    import Map from '../lib/Map.svelte';
    let isSideNavOpen = false;
    let mapComponent;
    let findFavoriteStop;
    let currentTransport;
    let expandableTileExpanded = false;

    let savedStop = []
    onMount(() => {
        if (localStorage.getItem('savedStop'))  {
            savedStop = JSON.parse(localStorage.getItem('savedStop'));
        }
        else 
            console.log('not found local storaged stops');

        console.log(savedStop);

        findFavoriteStop = function(coords){
			mapComponent.findStop(coords)
		}
    })
    
</script>

<main class="d-flex">
    <Header company="SMROUTES" bind:isSideNavOpen>
        <svelte:fragment slot="skip-to-content">
          <SkipToContent />
        </svelte:fragment>
    </Header>
    
    <SideNav bind:isOpen={isSideNavOpen}>
        <SideNavItems>
            {#each savedStop as favoriteStop}
                <SideNavLink>
                    <ClickableTile on:click={findFavoriteStop(favoriteStop.geometry.coordinates)}>
                        <div>{favoriteStop.properties.title}</div>
                        <div>{favoriteStop.properties.direction}</div>
                    </ClickableTile>
                </SideNavLink>
            {/each}
        </SideNavItems>
    </SideNav>
    <Content>
        <Map bind:this={mapComponent}/>
    </Content>
</main>
