<script lang="ts">
	import {
		motion,
		styleString,
		useScroll,
		useMotionValueEvent,
		type MotionTransition
	} from '@humanspeak/svelte-motion';

	let {
		landingEl,
		projectsEl,
		aboutEl,
		footerEl
	}: {
		landingEl?: HTMLElement;
		projectsEl?: HTMLElement;
		aboutEl?: HTMLElement;
		footerEl?: HTMLElement;
	} = $props();

	let landingHeight = $state(0);
	let projectsHeight = $state(0);
	let aboutHeight = $state(0);
	let footerHeight = $state(0);

	function measure() {
		landingHeight = landingEl?.offsetHeight ?? 0;
		projectsHeight = projectsEl?.offsetHeight ?? 0;
		aboutHeight = aboutEl?.offsetHeight ?? 0;
		footerHeight = footerEl?.offsetHeight ?? 0;
	}

	$effect(() => {
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	});

	const { scrollYProgress: landingProgress } = useScroll({
		target: () => landingEl,
		offset: ['start start', 'end start']
	});
	const { scrollYProgress: projectsProgress } = useScroll({
		target: () => projectsEl,
		offset: ['start start', 'end start']
	});
	const { scrollYProgress: aboutProgress } = useScroll({
		target: () => aboutEl,
		offset: ['start start', 'end start']
	});
	const { scrollYProgress: footerProgress } = useScroll({
		target: () => footerEl,
		offset: ['start start', 'end end']
	});

	// Raw 0-1 values, clamped, kept in $state so they drive both the
	// bar animation and the debug readout. No spring — motion.div's
	// own tween transition handles the easing/smoothing instead.
	let landingValue = $state(0);
	let projectsValue = $state(0);
	let aboutValue = $state(0);
	let footerValue = $state(0);

	let landingPct = $state(0);
	let aboutPct = $state(0);
	let projectsPct = $state(0);
	let footerPct = $state(0);

	useMotionValueEvent(landingProgress, 'change', (v: number) => {
		landingValue = Math.min(1, Math.max(0, v));
		landingPct = Math.round(landingValue * 100);
	});
	useMotionValueEvent(aboutProgress, 'change', (v: number) => {
		aboutValue = Math.min(1, Math.max(0, v));
		aboutPct = Math.round(aboutValue * 100);
	});
	useMotionValueEvent(projectsProgress, 'change', (v: number) => {
		projectsValue = Math.min(1, Math.max(0, v));
		projectsPct = Math.round(projectsValue * 100);
	});
	useMotionValueEvent(footerProgress, 'change', (v: number) => {
		footerValue = Math.min(1, Math.max(0, v));
		footerPct = Math.round(footerValue * 100);
	});

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

	function scrollToSection(sectionEl?: HTMLElement) {
		return (e: MouseEvent) => {
			e.preventDefault();
			sectionEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
		};
	}

	let arrowPosition: string = $state('initial');
</script>

<div class="fixed top-6 right-6 left-6 z-50 flex h-14 items-end gap-6 mix-blend-difference">
	<!-- Landing -->
	<div class="nav-progress-box" style="flex: {landingHeight * 1.5 || 1} 1 0;">
		<div class="nav-item">
			<a href="#landing" class="nav-link" onclick={scrollToSection(landingEl)}>
				<h1 class="text-4xl font-medium">Wanderer</h1>
			</a>
		</div>
		<div style={trackStyle}>
			<motion.div
				style={fillStyle}
				initial={{ scaleX: 0 }}
				animate={{ scaleX: landingValue }}
				transition={barTransition}
			/>
		</div>
	</div>

	<!-- Projects -->
	<div class="nav-progress-box" style="flex: {projectsHeight || 1} 1 0;">
		<div class="nav-item">
			<a
				href="#projects"
				class="nav-link"
				onclick={scrollToSection(projectsEl)}
				onmouseenter={() => {
					arrowPosition = 'origin';
				}}
				onmouseleave={() => {
					arrowPosition = 'final';
				}}
			>
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
					<h2 class="text-lg">Projects</h2>
					<div class="arrow-icon-wrapper">
						<div class="arrow-icon-clip">
							<svg
								class={[
									'arrow-icon',
									{
										'arrow-icon-initial': arrowPosition === 'initial',
										'arrow-icon-origin': arrowPosition === 'origin',
										'arrow-icon-final': arrowPosition === 'final'
									}
								]}
								ontransitionend={(event) => {
  									if (event.propertyName === 'transform' && arrowPosition === 'final') {
  								    	arrowPosition = 'initial';
  								  	}
  								}}
								viewBox="0 0 256 256"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M200,64V168a8,8,0,0,1-16,0V83.314L69.65674,197.65723a8.00018,8.00018,0,0,1-11.31348-11.31446L172.686,72H88a8,8,0,0,1,0-16H192A8.00039,8.00039,0,0,1,200,64Z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</a>
		</div>
		<div style={trackStyle}>
			<motion.div
				style={fillStyle}
				initial={{ scaleX: 0 }}
				animate={{ scaleX: projectsValue }}
				transition={barTransition}
			/>
		</div>
	</div>

	<!-- About -->
	<div class="nav-progress-box" style="flex: {aboutHeight || 1} 1 0;">
		<div class="nav-item">
			<a 
				href="#about" 
				class="nav-link" 
				onclick={scrollToSection(aboutEl)}
				onmouseenter={() => {
					arrowPosition = 'origin';
				}}
				onmouseleave={() => {
					arrowPosition = 'final';
				}}
			>
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
					<h2 class="text-lg">About</h2>
					<div class="arrow-icon-wrapper">
						<div class="arrow-icon-clip">
							<svg
								class={[
									'arrow-icon',
									{
										'arrow-icon-initial': arrowPosition === 'initial',
										'arrow-icon-origin': arrowPosition === 'origin',
										'arrow-icon-final': arrowPosition === 'final'
									}
								]}
								ontransitionend={(event) => {
  									if (event.propertyName === 'transform' && arrowPosition === 'final') {
  								    	arrowPosition = 'initial';
  								  	}
  								}}
								viewBox="0 0 256 256"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M200,64V168a8,8,0,0,1-16,0V83.314L69.65674,197.65723a8.00018,8.00018,0,0,1-11.31348-11.31446L172.686,72H88a8,8,0,0,1,0-16H192A8.00039,8.00039,0,0,1,200,64Z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</a>
		</div>
		<div style={trackStyle}>
			<motion.div
				style={fillStyle}
				initial={{ scaleX: 0 }}
				animate={{ scaleX: aboutValue }}
				transition={barTransition}
			/>
		</div>
	</div>

	<!-- Footer -->
	<div class="nav-progress-box" style="flex: {footerHeight / 2 || 1} 1 0;">
		<div class="nav-item">
			<a 
				href="#contacts" 
				class="nav-link" 
				onclick={scrollToSection(footerEl)}
				onmouseenter={() => {
					arrowPosition = 'origin';
				}}
				onmouseleave={() => {
					arrowPosition = 'final';
				}}
			>
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
					<h2 class="text-lg">Contacts</h2>
					<div class="arrow-icon-wrapper">
						<div class="arrow-icon-clip">
							<svg
								class={[
									'arrow-icon',
									{
										'arrow-icon-initial': arrowPosition === 'initial',
										'arrow-icon-origin': arrowPosition === 'origin',
										'arrow-icon-final': arrowPosition === 'final'
									}
								]}
								ontransitionend={(event) => {
  									if (event.propertyName === 'transform' && arrowPosition === 'final') {
  								    	arrowPosition = 'initial';
  								  	}
  								}}
								viewBox="0 0 256 256"
								fill="currentColor"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M200,64V168a8,8,0,0,1-16,0V83.314L69.65674,197.65723a8.00018,8.00018,0,0,1-11.31348-11.31446L172.686,72H88a8,8,0,0,1,0-16H192A8.00039,8.00039,0,0,1,200,64Z"
								/>
							</svg>
						</div>
					</div>
				</div>
			</a>
		</div>
		<div style={trackStyle}>
			<motion.div
				style={fillStyle}
				initial={{ scaleX: 0 }}
				animate={{ scaleX: footerValue }}
				transition={barTransition}
			/>
		</div>
	</div>
</div>

<!-- TESTING ONLY: remove before shipping -->
<div
	class="pointer-events-none fixed right-6 bottom-6 z-50 flex flex-col gap-1 border border-[#0a0a0a] bg-(--light-primary)
    px-3 py-2 font-mono text-[0.75rem] text-(--light-text) shadow-[4px_4px_0_var(--brut-rule,#d6dedb)]"
>
	<span>landing: {landingPct}%</span>
	<span>projects: {projectsPct}%</span>
	<span>about: {aboutPct}%</span>
	<span>footer: {footerPct}%</span>
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

	.arrow-icon-wrapper {
		position: relative;
		left: -2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		flex: 0 0 auto;
		transform: scale(0);
		transition: transform 0.35s cubic-bezier(.5, 1, .89, 1);
		overflow: hidden;
	}

	.arrow-icon-wrapper::before {
		content: '';
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: var(--dark-text);
		pointer-events: none;
	}

	.arrow-icon-clip {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
	}

	.nav-link:hover .arrow-icon-wrapper {
		transform: scale(1);
	}

	.arrow-icon {
		position: relative;
		z-index: 1;
		width: 1.3rem;
		height: 1.3rem;
		flex: 0 0 auto;
		color: var(--light-primary);
		mix-blend-mode: difference;
		transition: transform 0.4s cubic-bezier(.5, 1, .89, 1);
	}

	.arrow-icon-initial {
		transform: translate(-150%, 150%);
	}

	.arrow-icon-origin {
		transform: translate(0);
		transition: transform 0.4s ease 0.1s;
	}

	.arrow-icon-final {
		transform: translate(150%, -150%);
	}
</style>
