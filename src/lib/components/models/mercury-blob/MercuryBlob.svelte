<script lang="ts">
    import { browser } from '$app/environment';

    import { Canvas } from '@threlte/core';
    
    import MercuryScene from '$lib/components/models/mercury-blob/MercuryScene.svelte';
	import type { MercuryOptions } from '$lib/components/models/mercury-blob/blob-types';


    interface Props extends MercuryOptions {
        scale?: number;
        /** Cap for devicePixelRatio (perf vs. sharpness). */
        maxDpr?: number;
          /** When false, the canvas stays mounted but stops rendering. */
        active?: boolean;
    }

    let { 
        maxDpr = 2,
        active = true, 
        ...sceneProps 
    }: Props = $props();
    

    const dpr = $derived(browser ? Math.min(window.devicePixelRatio, maxDpr) : 1);
</script>

<div class="stage">
    <Canvas {dpr} renderMode={active ? 'always' : 'manual'}>
        <MercuryScene {...sceneProps}/>
    </Canvas>
</div>

<style>
    .stage {
        position: absolute;
        inset: 0;
        overflow: hidden;
    }
</style>