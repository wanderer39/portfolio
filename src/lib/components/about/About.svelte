<script lang="ts">
	import AboutHeader from '$lib/components/about/AboutHeader.svelte';
	import SkillsSection from '$lib/components/about/SkillsSection.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();
</script>

<section bind:this={el} class="flex h-[200dvh] flex-col items-center justify-center">
	<AboutHeader />

	<!-- about info -->
	<div class="flex h-full w-full items-center justify-center">
		<!-- left side -->
		<div class="flex h-full w-1/2 justify-center pt-38">
			<div class="flex w-[70%] items-start justify-center"></div>
		</div>

		<!-- right side -->
		<div class="flex h-full w-1/2 flex-col items-center gap-20 pt-38">
			<div class="flex w-3/4 items-start justify-start">
				<h1 class="flex flex-col items-start font-montserrat text-2xl leading-8 font-[450] tracking-normal text-(--light-text)">
					<span>I push the boundaries of technology, exploring data,</span>
					<span>backend systems, and emerging engineering practices to</span>
					<span>build intelligent, scalable, and thoughtfully designed</span>
					<span>digital experiences that solve complex problems.</span>
				</h1>
			</div>

			<SkillsSection />
		</div>
	</div>
</section>
