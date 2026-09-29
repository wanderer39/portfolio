<script lang="ts">
	import './layout.css';
	import inter from '$lib/assets/fonts/InterVariable.woff2?url';
	import montserrat from '$lib/assets/fonts/MontserratVariable.woff2?url';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="src/lib/assets/favicon.svg" type="image/svg+xml" />
	<title>Wanderer</title>

	<link rel="preload" href={inter} as="font" type="font/woff2" crossorigin="anonymous" />
	<link rel="preload" href={montserrat} as="font" type="font/woff2" crossorigin="anonymous" />
</svelte:head>

{@render children()}
