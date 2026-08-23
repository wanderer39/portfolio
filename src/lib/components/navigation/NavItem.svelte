<script lang="ts">
	import { browser } from '$app/environment';
	
	import type Lenis from 'lenis';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	
	import ArrowIcon from './ArrowIcon.svelte';

	let {
		lenis,
		targetSectionEl,
		title,
		href = '#home',
		flexGrow = 1,
		position
	}: {
		lenis: Lenis | undefined;
		targetSectionEl: HTMLElement | undefined;
		title: string;
		href: string;
		flexGrow?: number;
		position?: 'first' | 'last';
	} = $props();

	let targetProgressBarEl: HTMLDivElement;

	if (browser) {
		// register ScrollTrigger
		gsap.registerPlugin(ScrollTrigger);
	}

	$effect(() => {
		if (!targetSectionEl) return;

		const targetTrigger = ScrollTrigger.create({
			trigger: targetSectionEl,
			start: 'top top',
			end: position == 'last' ? 'bottom bottom' : 'bottom top',
			onUpdate: (self) =>
				gsap.set(targetProgressBarEl, {
					scaleX: self.progress,
					duration: 0.3,
					ease: 'back.inOut'
				})
		});

		// Runs on effect re-run AND on component destroy
		return () => targetTrigger.kill();
	});

	function handleClick(e: MouseEvent, targetEl: HTMLElement | undefined) {
		e.preventDefault();
		if (!targetEl || !lenis) return;

		lenis.scrollTo(targetEl, {
			duration: 3, // animation duration (in seconds)
			lock: true, // whether or not to prevent the user from scrolling until the target is reached
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
		});
	}

    let hovered: boolean = $state(false);
</script>

<li class="min-w-0 shrink basis-0 " style="flex-grow: {flexGrow};">
	<a
		// eslint-disable-next-line svelte/no-navigation-without-resolve
		{href}
		onclick={(e) => handleClick(e, targetSectionEl)}
        onmouseenter={() => (hovered = true)}
		onmouseleave={() => (hovered = false)}
		class="group flex w-full cursor-pointer items-center border-none pb-3 text-xl text-(--dark-text) no-underline outline-none"
	>
		{#if position == 'first'}
			<h1 class="font-inter mt-4 text-4xl font-normal uppercase">{title}</h1>
		{:else}
			<div class="relative mt-2 flex items-center gap-6">
				<svg
					class="size-4 shrink-0 origin-center scale-100 opacity-100
						transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0,0.48,1)] group-hover:scale-0 group-hover:opacity-0"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
						stroke="hsl(90,2%,30%)"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
				<h2
					class="translate-x-0 font-inter text-base font-normal uppercase transition-transform duration-500 ease-[cubic-bezier(0.32,1,0.42,1)] group-hover:-translate-x-10"
				>
					{title}
				</h2>
				<ArrowIcon active={hovered} />
			</div>
		{/if}
	</a>

	<div class="h-px w-full overflow-hidden bg-gray-500" aria-hidden="true">
		<div bind:this={targetProgressBarEl} class="h-full w-full origin-left scale-x-0 bg-white"></div>
	</div>
</li>
