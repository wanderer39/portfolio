<script lang="ts">
	import AboutHeader from '$lib/components/about/AboutHeader.svelte';
	import SkillsSection from '$lib/components/about/SkillsSection.svelte';
	import AboutText from '$lib/components/about/AboutText.svelte';
	import AboutTitle from '$lib/components/about/AboutTitle.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();
</script>

<section bind:this={el} class="flex h-[200dvh] flex-col items-center justify-center">
	<!-- <AboutHeader /> -->

	<!-- about info -->
	<div class="flex h-full w-full items-center justify-center pt-8">
		<!-- left side -->
		<div class="flex h-full w-1/2 justify-center pt-38">
			<AboutTitle />
		</div>

		<!-- right side -->
		<div class="flex h-full w-1/2 flex-col items-center gap-30 pt-38">
			<AboutText />
			<SkillsSection />
		</div>
	</div>
</section>
