<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import Landing from '$lib/components/home/Landing.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import MercuryBlob from '$lib/components/models/mercury-blob/MercuryBlob.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let pinWrap: HTMLElement;
	let boxC: HTMLElement;

	const SCALE_START = 0.8;
	const SCALE_END = 0.6;

	/** Reactive blob scale, driven by the scroll timeline below. */
	let blobScale = $state(SCALE_START);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {
			const scaleProxy = { v: SCALE_START };

			// Phase 1 (scroll 0 -> 1 viewport): Landing is pinned, box expands to fullscreen.
			gsap
				.timeline({
					scrollTrigger: {
						trigger: pinWrap,
						start: 'top top',
						end: '+=100%',
						scrub: true,
						pin: true,
						pinSpacing: false,
						invalidateOnRefresh: true
					}
				})
				.to(boxC, {
					width: '100dvw',
					height: '100dvh',
					borderRadius: 0
				})
				.to(
					scaleProxy,
					{
						v: SCALE_END,
						onUpdate: () => {
							blobScale = scaleProxy.v;
						}
					},
					0
				);

			// Phase 2 (scroll 1 -> 2 viewports): the wrapper scrolls away, so move the
			// box down by the same distance to keep it fixed on screen until the section ends.
			gsap.to(boxC, {
				y: () => window.innerHeight,
				ease: 'none',
				scrollTrigger: {
					start: () => window.innerHeight,
					end: () => window.innerHeight * 2,
					scrub: true, // no smoothing: it has to match the scroll exactly
					invalidateOnRefresh: true
				}
			});
		});

		return () => ctx.revert();
	});
</script>

<section bind:this={el} class="flex h-[300dvh] w-screen flex-col overflow-x-clip">
	<div bind:this={pinWrap} class="relative flex flex-col items-center justify-center">
		<Landing />

		<div class="pointer-events-none absolute top-0 left-0 z-0 h-dvh w-full">
			<div
				bind:this={boxC}
				class="absolute inset-0 m-auto h-52 w-80 overflow-hidden rounded-[0.4rem] bg-(--dark-background)"
			>
				<MercuryBlob scale={blobScale} />
			</div>
		</div>

		<Hero />
	</div>
</section>
