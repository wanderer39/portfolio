<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { SplitText } from 'gsap/SplitText';

	let container: HTMLElement;

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger, SplitText);

		let ctx: gsap.Context | undefined;
		let cancelled = false;

		document.fonts.ready.then(() => {
			if (cancelled) return;

			ctx = gsap.context(() => {
				SplitText.create(Array.from(container.querySelectorAll('h1')), {
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
							stagger: 0.15,
							ease: 'power4.out',
							delay: 0.2,
							scrollTrigger: {
								trigger: container,
								start: 'top 80%',
								once: true
							}
						});
					}
				});
			}, container);
		});

		return () => {
			cancelled = true;
			ctx?.revert();
		};
	});
</script>

<div class="flex w-[70%] items-start justify-start pt-2 pl-4">
	<div bind:this={container} class="flex flex-col gap-4 font-lora text-9xl leading-28 uppercase">
		<h1>Think</h1>
		<h1>Design</h1>
		<h1>Build</h1>
	</div>
</div>