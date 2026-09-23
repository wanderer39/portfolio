<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import gsap from 'gsap';

	let {
		items,
		heightClass = 'h-64'
	}: {
		items: string[];
		heightClass?: string;
	} = $props();

	let container: HTMLDivElement;
	let track: HTMLUListElement;
	let tickerFn: (time: number, deltaTime: number) => void;
	let resizeObserver: ResizeObserver;

	// highlight fade tuning
	const MAX_OPACITY = 1;
	const MIN_OPACITY = 0.15;
	const FALLOFF = 120;

	// marquee speed/direction tuning
	const BASE_SPEED = 50;
	const SCROLL_SENSITIVITY = 1.4;
	const MAX_BOOST = 460;
	const DECAY_RATE = 2.2;
	const DIRECTION_THRESHOLD = 0.5;

	let currentY = 0;
	let distance = 0;
	let direction = -1;
	let boost = 0;
	let lastScrollY = 0;
	let paused = false;

	function measure() {
		if (!track) return;
		const half = track.scrollHeight / 2;
		if (half > 0) distance = half;
	}

	function onScroll() {
		const y = window.scrollY;
		const delta = y - lastScrollY;
		lastScrollY = y;

		if (Math.abs(delta) > DIRECTION_THRESHOLD) {
			direction = delta > 0 ? 1 : -1;
			boost = gsap.utils.clamp(0, MAX_BOOST, boost + Math.abs(delta) * SCROLL_SENSITIVITY);
		}
	}

	onMount(() => {
		if (!browser) return;

		measure();
		lastScrollY = window.scrollY;

		document.fonts?.ready?.then(measure);

		resizeObserver = new ResizeObserver(() => measure());
		resizeObserver.observe(track);

		window.addEventListener('scroll', onScroll, { passive: true });

		const listItems = track.querySelectorAll('li');
		const containerRect = () => container.getBoundingClientRect();

		tickerFn = (_time, deltaTimeMs) => {
			const dt = deltaTimeMs / 1000;

			if (!paused && distance > 0) {
				boost -= boost * Math.min(DECAY_RATE * dt, 1);

				const speed = BASE_SPEED + boost;
				currentY += direction * speed * dt;

				if (currentY <= -distance) currentY += distance;
				if (currentY >= 0) currentY -= distance;

				gsap.set(track, { y: currentY });
			}

			const cRect = containerRect();
			const centerY = cRect.top + cRect.height / 2;

			listItems.forEach((item) => {
				const iRect = item.getBoundingClientRect();
				const itemCenter = iRect.top + iRect.height / 2;
				const dist = Math.abs(itemCenter - centerY);

				const t = Math.min(dist / FALLOFF, 1);
				const opacity = MAX_OPACITY - t * (MAX_OPACITY - MIN_OPACITY);

				(item as HTMLElement).style.opacity = String(opacity);
			});
		};

		gsap.ticker.add(tickerFn);
	});

	onDestroy(() => {
		if (!browser) return;
		if (tickerFn) gsap.ticker.remove(tickerFn);

		window.removeEventListener('scroll', onScroll);
		resizeObserver?.disconnect();
	});

	function pause() {
		paused = true;
	}
	function resume() {
		paused = false;
	}
</script>

<div
	bind:this={container}
	class="{heightClass} marquee-mask relative overflow-hidden"
	role="marquee"
	aria-label="Technologies I use" 
	onmouseenter={pause}
	onmouseleave={resume}
	onfocusin={pause}
	onfocusout={resume}
>
	<ul
		bind:this={track}
		class="font-inter text-[1.05rem] text-(--light-accent) will-change-transform"
	>
		{#each items as item (item)}
			<li>{item}</li>
		{/each}
		{#each items as item (item + '-dup')}
			<li aria-hidden="true">{item}</li>
		{/each}
	</ul>
</div>

<style>
	.marquee-mask {
		-webkit-mask-image: linear-gradient(
			to bottom,
			transparent 0%,
			black 20%,
			black 80%,
			transparent 100%
		);
		mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
	}
</style>
