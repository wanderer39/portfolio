<script lang="ts">
	import { motion, styleString, type MotionTransition } from '@humanspeak/svelte-motion';

	import ArrowIcon from '$lib/components/navigation/ArrowIcon.svelte';

	let {
		href,
		label,
		targetEl,
		progress = 0,
		flexBasis = 1,
		variant = 'icon'
	}: {
		/** Anchor target, e.g. "#projects" */
		href: string;
		/** Visible label text */
		label: string;
		/** Element to scroll into view on click */
		targetEl?: HTMLElement;
		/** 0-1 scroll progress driving the bar fill */
		progress?: number;
		/** flex-grow weight for this box (usually derived from section height) */
		flexBasis?: number;
		/** 'title' renders the big landing-style h1, 'icon' renders the ring+label+arrow pattern */
		variant?: 'title' | 'icon';
	} = $props();

	let hovered = $state(false);

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	// Smooth, non-spring transition: a plain eased tween applied to
	// scaleX on every value change.
	const barTransition: MotionTransition = {
		type: 'tween',
		duration: 0.3,
		ease: 'easeOut'
	};

	const trackStyle = styleString(() => ({
		height: '1px',
		width: '100%',
		background: 'hsl(0,0%,20%)',
		overflow: 'hidden'
	}));

	const fillStyle = styleString(() => ({
		height: '100%',
		width: '100%',
		background: 'var(--brut-accent, #fff)',
		transformOrigin: 'left'
	}));
</script>

<div class="isolation-auto flex min-w-0 flex-col" style="flex: {flexBasis || 1} 1 0;">
	<div class="size-full flex-1 border-none outline-none">
		<a
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			{href}
			class="group flex size-full cursor-pointer items-center pb-4 border-none outline-none 
                text-xl text-(--dark-text) no-underline mix-blend-difference"
			onclick={handleClick}
			onmouseenter={() => (hovered = true)}
			onmouseleave={() => (hovered = false)}
		>
			{#if variant === 'title'}
				<h1 class="text-4xl font-normal font-inter uppercase">{label}</h1>
			{:else}
				<div class="relative mt-3 flex items-center gap-6">
					<svg class="size-4 shrink-0 origin-center scale-100 opacity-100
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
					<h2 class="text-base font-inter font-normal uppercase translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.32,1,0.42,1)] group-hover:-translate-x-10">
						{label}
					</h2>
					<ArrowIcon active={hovered} />
				</div>
			{/if}
		</a>
	</div>
	<div style={trackStyle}>
		<motion.div
			style={fillStyle}
			initial={{ scaleX: 0 }}
			animate={{ scaleX: progress }}
			transition={barTransition}
		/>
	</div>
</div>
