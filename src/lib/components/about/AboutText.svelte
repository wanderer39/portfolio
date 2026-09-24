<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';

	let heading: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger, SplitText);

		let ctx: gsap.Context | undefined;
		let cancelled = false;

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx = gsap.context(() => {
				SplitText.create(heading, {
					type: 'lines',
					mask: 'lines',
					linesClass: 'line++',
					autoSplit: true,
					onSplit(self) {
						gsap.set(self.lines, {
							yPercent: 100,
							rotation: 0.01,
							force3D: true,
							willChange: 'transform'
						});

						return gsap.to(self.lines, {
							yPercent: 0,
							duration: 2.5,
							stagger: 0.1,
							ease: 'power4.out',
							delay: 0.2,
							scrollTrigger: {
								trigger: heading,
								start: 'top 80%',
								once: true
							}
						});
					}
				});
			}, heading);
		});

		return () => {
			cancelled = true;
			ctx?.revert();
		};
	});
</script>

<div class="flex w-3/4 items-start justify-start">
	<h1
		bind:this={heading}
		class="font-montserrat text-2xl leading-8 font-[450] tracking-normal text-(--light-text) antialiased pr-8"
	>
		I push the boundaries of technology, exploring data, backend systems, and emerging
		engineering practices to build intelligent, scalable, and 
		thoughtfully designed digital experiences.
	</h1>
</div>