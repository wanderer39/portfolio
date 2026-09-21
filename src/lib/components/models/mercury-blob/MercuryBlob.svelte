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
        maxDpr = 2, 
        ...sceneProps 
    }: Props = $props();
    

    const dpr = $derived(browser ? Math.min(window.devicePixelRatio, maxDpr) : 1);
</script>

<div class="stage">
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