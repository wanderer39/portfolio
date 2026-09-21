<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import Landing from '$lib/components/home/Landing.svelte';
	import Hero from '$lib/components/home/Hero.svelte';
	import MercuryBlob from '../models/mercury-blob/MercuryBlob.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let pinWrap: HTMLElement;
	let boxC: HTMLElement;
	let blobEl: HTMLElement;

	const SCALE_START = 0.8;
	const SCALE_END = 0.6;

	/** Phase 3: the blob shrinks to this scale as it fades out. */
	const EXIT_SCALE = 0.3;

	/** Phase 3 length, as a fraction of a viewport of scroll, ending exactly at the section's end. */
	const EXIT_LENGTH = 0.5;

	/** Reactive blob scale, driven by the scroll timeline below. */
	let blobScale = $state(SCALE_START);

	/** False once phase 3 has finished, so the canvas stops rendering while invisible. */
	let blobActive = $state(true);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const section = pinWrap.parentElement as HTMLElement;

		const ctx = gsap.context(() => {
			const scaleProxy = { v: SCALE_START };

			// Phase 1 (first viewport of scroll): Landing is pinned, box expands to fullscreen.
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

			// Phase 2 (last viewport of the section): the wrapper scrolls away, so move the
			// box down by the same distance to keep it on screen. Ends when the section's
			// bottom reaches the viewport bottom.
			gsap.to(boxC, {
				y: () => window.innerHeight,
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: () => `bottom-=${window.innerHeight} bottom`,
					end: 'bottom bottom',
					scrub: true,
					invalidateOnRefresh: true
				}
			});

			// Phase 3 (last stretch of phase 2): only the blob shrinks and fades, and it is
			// fully gone by the time the section ends.
			gsap
				.timeline({
					defaults: { ease: 'none' },
					scrollTrigger: {
						trigger: section,
						start: () => `bottom-=${window.innerHeight * EXIT_LENGTH} bottom`,
						end: 'bottom bottom',
						scrub: true,
						invalidateOnRefresh: true,
						onLeave: () => (blobActive = false), // fully faded: stop rendering
						onEnterBack: () => (blobActive = true), // scrolling back up: render again
						onRefresh: (self) => (blobActive = self.progress < 1) // covers reload past the end
					}
				})
				.to(blobEl, { scale: EXIT_SCALE, duration: 1 }, 0)
				.to(blobEl, { opacity: 0, duration: 0.6 }, 0.4);
		});

		return () => ctx.revert();
	});
</script>

<section bind:this={el} class="flex h-[300dvh] w-screen flex-col overflow-clip">
	<div bind:this={pinWrap} class="relative flex flex-col items-center justify-center">
		<Landing />

		<div class="pointer-events-none absolute top-0 left-0 z-0 h-dvh w-full">
			<div
				bind:this={boxC}
				class="absolute inset-0 m-auto h-52 w-80 overflow-hidden rounded-[0.4rem] bg-(--dark-background)"
			>
				<div bind:this={blobEl} class="absolute inset-0">
					<MercuryBlob scale={blobScale} active={blobActive}/>
				</div>
			</div>
		</div>

		<Hero />
	</div>
</section>
