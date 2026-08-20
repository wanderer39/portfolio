<script lang="ts">
	import { motion, styleString, type MotionTransition } from '@humanspeak/svelte-motion';
	import ArrowIcon from './ArrowIcon.svelte';

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

	// Each NavBox now owns its own arrow animation state, instead of
	// sharing one variable across every nav item (as the original did).
	let arrowPosition: 'initial' | 'origin' | 'final' = $state('initial');
	// Drives the circular wrapper scale-in that used to be a pure
	// `.nav-link:hover .arrow-icon-wrapper` selector; now explicit since
	// ArrowIcon is a separate component and can't see the parent's :hover.
	let hovered = $state(false);

	function handleClick(e: MouseEvent) {
		e.preventDefault();
		targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	function handleMouseEnter() {
		arrowPosition = 'origin';
		hovered = true;
	}

	function handleMouseLeave() {
		arrowPosition = 'final';
		hovered = false;
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

<div class="nav-progress-box" style="flex: {flexBasis || 1} 1 0;">
	<div class="nav-item">
		<a
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			{href}
			class="nav-link"
			onclick={handleClick}
			onmouseenter={handleMouseEnter}
			onmouseleave={handleMouseLeave}
		>
			{#if variant === 'title'}
				<h1 class="text-4xl font-medium">{label}</h1>
			{:else}
				<div class="nav-link-box">
					<svg
						class="ring-icon"
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
					<h2 class="text-lg">{label}</h2>
					<ArrowIcon bind:position={arrowPosition} active={hovered} />
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

<style>
	.nav-progress-box {
		isolation: auto;
		min-width: 0px;
		display: flex;
		flex-direction: column;
	}

	.nav-item {
		flex: 1;
		width: 100%;
		height: 100%;
		border: none;
		outline: none;
	}

	.nav-link {
		width: 100%;
		height: 100%;
		padding-bottom: 1rem;
		display: flex;
		align-items: center;
		font-size: 1.25rem;
		color: var(--dark-text);
		text-decoration: none;
		mix-blend-mode: difference;
		border: none;
		outline: none;
		cursor: pointer;
	}

	.nav-link-box {
		position: relative;
		display: flex;
		align-items: center;
		gap: 1.5rem;
		margin-top: 0.75rem;
	}

	.ring-icon {
		flex: 0 0 auto;
		width: 1rem;
		height: 1rem;
		transform: scale(1);
		opacity: 1;
		transform-origin: center;
		transition:
			transform 300ms cubic-bezier(0.32, 0, 0.48, 1),
			opacity 200ms ease;
	}

	.nav-link:hover .ring-icon {
		transform: scale(0);
		opacity: 0;
	}

	.nav-link-box h2 {
		transform: translateX(0);
		transition: transform 500ms cubic-bezier(0.32, 1, 0.42, 1);
	}

	.nav-link:hover .nav-link-box h2 {
		transform: translateX(-2.5rem);
	}
</style>