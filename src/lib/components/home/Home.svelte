<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import Landing from '$lib/components/home/Landing.svelte';
	import Hero from '$lib/components/home/Hero.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let pinWrap: HTMLElement;
	let boxC: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		gsap.to(boxC, {
			scrollTrigger: {
				// markers: true,
				trigger: pinWrap,
				start: 'top top', // only begins once the section's top reaches the viewport top (i.e. after scrolling to it)
				end: '+=100%', // scrub over one viewport-height's worth of scroll (adjust to taste)
				scrub: true, // ties progress directly to scroll position
				pin: true, // keep the box fixed in place while it grows, so it doesn't scroll away mid-animation
				pinSpacing: false, // don't inflate the document's scroll height
				invalidateOnRefresh: true
			},

			width: '100dvw',
			height: '100dvh',
			top: 0,
			borderRadius: 0
		});
	});
</script>

<section bind:this={el} class="flex h-[300dvh] w-screen flex-col overflow-x-clip">
	<div bind:this={pinWrap} class="relative flex flex-col items-center justify-center">
		<Landing />

		<div
			bind:this={boxC}
			class="absolute top-[22%] right-1/2 flex h-52 min-w-80 translate-x-1/2
            items-center justify-center rounded-[0.4rem] bg-(--dark-background)
            "
		>
			C
		</div>

		<Hero />
	</div>
</section>
