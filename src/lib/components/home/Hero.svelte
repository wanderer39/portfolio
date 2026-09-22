<!--  -->
<script lang="ts">
	import { onMount } from 'svelte';

	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	let heroEl: HTMLDivElement | undefined = $state();

	let leftText: HTMLParagraphElement | undefined = $state();
	let rightText: HTMLParagraphElement | undefined = $state();

	onMount(() => {
		gsap.registerPlugin(ScrollTrigger);

		const ctx = gsap.context(() => {});

		(async () => {
			await document.fonts.ready;

			ctx.add(() => {
				if (!leftText || !rightText) return;

                
			});
		})();

		return () => ctx.revert();
	});
</script>

<div bind:this={heroEl} class="relative h-screen w-full">
	<div class="absolute flex size-full items-center justify-center gap-8">
		<div class="absolute left-38 w-110 text-3xl">
			<p bind:this={leftText}>Crafting refined experiences with thoughtful design.</p>
		</div>

		<div class="absolute right-44 w-110 text-3xl">
			<p bind:this={rightText}>Bridging creative thinking with thoughtful engineering.</p>
		</div>
	</div>
</div>
