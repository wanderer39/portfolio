<script lang="ts">
    import { browser } from '$app/environment';

    import { Canvas } from '@threlte/core';
    
    import MercuryScene from '$lib/components/models/mercury-blob/MercuryScene.svelte';
	import type { MercuryOptions } from '$lib/components/models/mercury-blob/blob-types';


    interface Props extends MercuryOptions {
        scale?: number;
        /** Cap for devicePixelRatio (perf vs. sharpness). */
        maxDpr?: number;
    }

    let { 
        maxDpr = 3, 
        ...sceneProps 
    }: Props = $props();
    

    // Same pixel-ratio cap as before; guarded because this runs during SSR too.
    const dpr = browser ? Math.min(window.devicePixelRatio, maxDpr) : 1;
</script>

<div class="stage">
    <!-- Threlte's default renderer is transparent, so the CSS gradient shows through.
         "always" keeps rendering every frame (Threlte defaults to on-demand). -->
    <Canvas {dpr} renderMode="always">
        <MercuryScene {...sceneProps}/>
    </Canvas>
</div>

<style>
    .stage {
        position: fixed;
        inset: 0;
        width: 100vw;
        height: 100vh;
        background: radial-gradient(60% 60% at 50% 40%, #1f2125, #060607);
    }
</style>