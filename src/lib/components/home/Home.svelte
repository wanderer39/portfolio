<script lang="ts">
	import Hero from '$lib/components/home/Hero.svelte';
	import Landing from '$lib/components/home/Landing.svelte';

    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section bind:this={el} class="relative flex flex-col h-full overflow-x-clip">

    <Landing />

    <Hero />
</section>