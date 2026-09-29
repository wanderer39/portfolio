<script lang="ts">
	import { onMount } from 'svelte';

	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	// import AboutImg from '$lib/assets/images/home-background.jpg';

	let aboutImgSection: HTMLDivElement;

	const AboutImg = 'random.png';

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const containers = aboutImgSection.querySelectorAll<HTMLDivElement>('.parallax-container');

		containers.forEach((container) => {
			const img: HTMLImageElement | null = container.querySelector('img');
			if (!img) return;

			gsap.fromTo(
				img,
				{ yPercent: -20 },
				{
					yPercent: 20,
					ease: 'none',
					scrollTrigger: {
						trigger: container,
						scrub: true
					}
				}
			);
		});
	});
</script>

<!-- image section -->
<div bind:this={aboutImgSection} class="h-fit w-full">
	<div class="flex h-screen w-full gap-x-20 gap-y-0">
		<div class="flex size-full justify-end">
			<div
				class="parallax-container relative top-44 right-0 aspect-286/197 h-[30dvh] w-fit overflow-hidden rounded-md"
			>
				<img
					src={AboutImg}
					alt="about first"
					class="absolute top-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 scale-[1.4] rounded-md"
				/>
			</div>
		</div>

		<div class="flex h-full items-center justify-center">
			<div
				class="parallax-container relative aspect-429/536 h-[84dvh] w-[34dvw] overflow-hidden rounded-md"
			>
				<img
					src={AboutImg}
					alt="About mid"
					class="absolute top-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 scale-[1.4] rounded-md"
				/>
			</div>
		</div>

		<div class="flex size-full justify-start">
			<div
				class="parallax-container relative top-124 left-0 aspect-286/197 h-[30dvh] w-fit overflow-hidden rounded-md"
			>
				<img
					src={AboutImg}
					alt="about last"
					class="absolute top-0 left-1/2 h-full w-auto max-w-none -translate-x-1/2 scale-[1.4] rounded-md"
				/>
			</div>
		</div>
	</div>
</div>
