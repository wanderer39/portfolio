<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import Landing from '$lib/components/home/Landing.svelte';
	import MercuryBlob from '$lib/components/models/mercury-blob/MercuryBlob.svelte';
	import { SplitText } from 'gsap/SplitText';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let pinWrap: HTMLElement;
	let boxC: HTMLElement;
	let blobEl: HTMLElement;

	let heroEl: HTMLElement;
	let leftText: HTMLParagraphElement;
	let rightText: HTMLParagraphElement;
	let leftMove: HTMLDivElement;
	let rightMove: HTMLDivElement;

	const SCALE_START = 0.8;
	const SCALE_END = 0.6;

	/** Phase 3: the blob shrinks to this scale as it fades out. */
	const EXIT_SCALE = 0.3;

	/** Reactive blob scale, driven by the scroll timeline below. */
	let blobScale = $state(SCALE_START);

	/** False once phase 3 has finished, so the canvas stops rendering while invisible. */
	let blobActive = $state(true);

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger, SplitText);

		const section = pinWrap.parentElement as HTMLElement;

		const ctx = gsap.context(() => {
			if (!heroEl || !leftText || !rightText) return;

			const leftSplit = new SplitText(leftText, { type: 'lines' });
			const rightSplit = new SplitText(rightText, { type: 'lines' });

			const leftLines = leftSplit.lines;
			const rightLines = rightSplit.lines;

			[...leftLines, ...rightLines].forEach((line) => {
				gsap.set(line.parentNode, { perspective: 2000 });
			});

			gsap.set([...leftLines, ...rightLines], {
				opacity: 0,
				rotationX: -90,
				yPercent: 50,
				transformOrigin: '50% 100%'
			});

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
				)
				// Hero text appears only after boxC has fully expanded
				.to(leftLines, {
					opacity: 1,
					rotationX: 0,
					yPercent: 0,
					ease: 'power1.inOut',
					stagger: 0.12,
					duration: 0.8
				})

				.to(
					rightLines,
					{
						opacity: 1,
						rotationX: 0,
						yPercent: 0,
						ease: 'power1.inOut',
						stagger: 0.12,
						duration: 0.8
					},
					'<'
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
						start: () => {
							const sectionHeight = section.offsetHeight;
							const viewportHeight = window.innerHeight;

							const scrollDistance = sectionHeight - viewportHeight;
							const remainingDistance = scrollDistance * 0.1;

							return `bottom-=${remainingDistance}px bottom`;
						},
						end: 'bottom bottom',
						scrub: true,
						invalidateOnRefresh: true,
						onLeave: () => (blobActive = false), // fully faded: stop rendering
						onEnterBack: () => (blobActive = true), // scrolling back up: render again
						onRefresh: (self) => (blobActive = self.progress < 1) // covers reload past the end
					}
				})
				.to(blobEl, { scale: EXIT_SCALE, duration: 1 }, 0)
				.to(blobEl, { opacity: 0, duration: 1 }, 0);

			const movement = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: () => {
						const sectionHeight = section.offsetHeight;
						const viewportHeight = window.innerHeight;

						const scrollDistance = sectionHeight - viewportHeight;
						const remainingDistance = scrollDistance * 1;

						return `bottom-=${remainingDistance}px bottom`;
					},
					end: 'bottom bottom',
					scrub: true,
					invalidateOnRefresh: true
				}
			});

			movement
				.to(
					leftMove,
					{
						x: '-5rem',
						opacity: 0,
						ease: 'none',
						duration: 0.3
					},
					0.7
				)
				.to(
					rightMove,
					{
						x: '5rem',
						opacity: 0,
						ease: 'none',
						duration: 0.3
					},
					0.7
				);
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
					<MercuryBlob scale={blobScale} active={blobActive} />
				</div>

				<!-- hero text -->
				<div bind:this={heroEl} class="pointer-events-none fixed inset-0">
					<div class="flex h-dvh w-full flex-col items-center justify-between px-6 py-20 md:relative md:flex-row md:items-center md:justify-center md:px-0 md:py-0">
						<div
							bind:this={leftMove}
							class="w-full max-w-xs shrink-0 text-center text-xl leading-snug md:absolute md:left-50 md:w-110 md:max-w-none md:text-left md:text-3xl md:leading-normal">
							<p bind:this={leftText}>Crafting refined experiences with thoughtful design.</p>
						</div>
						<div
							bind:this={rightMove}
							class="w-full max-w-xs shrink-0 text-center text-xl leading-snug md:absolute md:right-50 md:w-110 md:max-w-none md:text-left md:text-3xl md:leading-normal"
						>
							<p bind:this={rightText}>Bridging creative thinking with thoughtful engineering.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
