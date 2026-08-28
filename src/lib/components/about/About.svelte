<script lang="ts">
	import AboutHeader from '$lib/components/about/AboutHeader.svelte';

	let { el = $bindable() }: { el?: HTMLElement } = $props();
</script>

<section bind:this={el} class="flex h-[200dvh] flex-col items-center justify-center">
	<AboutHeader />

	<div>
		<h1 class="text-(--light-text)">About</h1>
	</div>
</section>
