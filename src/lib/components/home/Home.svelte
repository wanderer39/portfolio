<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import Landing from '$lib/components/home/Landing.svelte';

	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { onMount } from 'svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let boxC: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.to(boxC, {
			scrollTrigger: {
				trigger: el,
				start: 'top top', 		// only begins once the section's top reaches the viewport top (i.e. after scrolling to it)
				end: '+=100%', 			// scrub over one viewport-height's worth of scroll (adjust to taste)
				scrub: true, 			// ties progress directly to scroll position
				pin: true 				// keep the box fixed in place while it grows, so it doesn't scroll away mid-animation
			},

			width: '100dvw',
			height: '100dvh',
			top: 0,
			borderRadius: 0
		});
	});
</script>

<section bind:this={el} class="relative flex h-[230dvh] flex-col overflow-x-clip">
	<Landing />

	<div
		bind:this={boxC}							
		class="absolute top-[20%] right-1/2 flex h-48 min-w-68 translate-x-1/2
        items-center justify-center rounded-[0.4rem] bg-(--dark-background)
        "
	>
		C
	</div>

    <Hero />
</section>

