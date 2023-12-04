<script>
    import "carbon-components-svelte/css/white.css";
    import {
        Header,
        SideNav,
        SideNavItems,
        SideNavLink,
        SkipToContent,
        Content,
        Button,
        ExpandableTile,
        Search,
        HeaderUtilities,
        HeaderAction
    } from "carbon-components-svelte";
    import Favorite from "carbon-icons-svelte/lib/Favorite.svelte";
    import Map from '../lib/Map.svelte';
    let isSideNavOpen = false;
    let expandableTileExpanded = false;
</script>

<main class="d-flex">
    <Header company="SMROUTES" bind:isSideNavOpen>
        <svelte:fragment slot="skip-to-content">
          <SkipToContent />
        </svelte:fragment>
        <HeaderUtilities>
            <Button icon={Favorite} iconDescription="Избранные остановки" tooltipPosition="left"/>
          </HeaderUtilities>
    </Header>
    
    <SideNav bind:isOpen={isSideNavOpen}>
        <SideNavItems>
            <SideNavLink>
                <Search>

                </Search>
            </SideNavLink>
        </SideNavItems>
    </SideNav>
    <Content>
        <Map/>
    </Content>
</main>
