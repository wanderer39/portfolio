<script lang="ts">
	import AboutHeader from '$lib/components/about/AboutHeader.svelte';
	import SkillsSection from '$lib/components/about/SkillsSection.svelte';
	import AboutText from '$lib/components/about/AboutText.svelte';
	import AboutTitle from '$lib/components/about/AboutTitle.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();
</script>

<section bind:this={el} class="flex min-h-[200dvh] flex-col items-center justify-center md:h-[200dvh]">
	<!-- <AboutHeader /> -->

	<!-- about info -->
	<div class="flex h-full w-full flex-col items-center justify-center gap-16 px-6 pt-10 md:flex-row md:gap-0 md:px-0 md:pt-8">
		<!-- left side -->
		<div class="flex w-full justify-center pt-2 md:h-full md:w-1/2 md:pt-38">
			<AboutTitle />
		</div>

		<!-- right side -->
		<div class="flex w-full flex-col items-center gap-12 md:h-full md:w-1/2 md:gap-30 md:pt-38">
			<AboutText />
			<SkillsSection />
		</div>
	</div>
</section>
