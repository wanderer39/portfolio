<script lang="ts">
	import { useScroll, useMotionValueEvent } from '@humanspeak/svelte-motion';
	import NavBox from './NavBox.svelte';

	let {
		homeEl,
		projectsEl,
		aboutEl,
		footerEl
	}: {
		homeEl?: HTMLElement;
		projectsEl?: HTMLElement;
		aboutEl?: HTMLElement;
		footerEl?: HTMLElement;
	} = $props();

	let homeHeight = $state(0);
	let projectsHeight = $state(0);
	let aboutHeight = $state(0);
	let footerHeight = $state(0);

	function measure() {
		homeHeight = homeEl?.offsetHeight ?? 0;
		projectsHeight = projectsEl?.offsetHeight ?? 0;
		aboutHeight = aboutEl?.offsetHeight ?? 0;
		footerHeight = footerEl?.offsetHeight ?? 0;
	}

	$effect(() => {
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	});

	const { scrollYProgress: homeProgress } = useScroll({
		target: () => homeEl,
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
	// bar animation (passed down to NavBox) and the debug readout.
	let homeValue = $state(0);
	let projectsValue = $state(0);
	let aboutValue = $state(0);
	let footerValue = $state(0);

	let homePct = $state(0);
	let aboutPct = $state(0);
	let projectsPct = $state(0);
	let footerPct = $state(0);

	useMotionValueEvent(homeProgress, 'change', (v: number) => {
		homeValue = Math.min(1, Math.max(0, v));
		homePct = Math.round(homeValue * 100);
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
</script>

<div class="fixed top-6 right-10 left-10 z-50 flex h-14 items-end gap-6 mix-blend-difference">
	<NavBox
		href="#home"
		label="Wanderer"
		variant="title"
		targetEl={homeEl}
		progress={homeValue}
		flexBasis={homeHeight * 1.5 || 1}
	/>

	<NavBox
		href="#projects"
		label="Projects"
		targetEl={projectsEl}
		progress={projectsValue}
		flexBasis={projectsHeight || 1}
	/>

	<NavBox
		href="#about"
		label="About"
		targetEl={aboutEl}
		progress={aboutValue}
		flexBasis={aboutHeight || 1}
	/>

	<NavBox
		href="#contacts"
		label="Contacts"
		targetEl={footerEl}
		progress={footerValue}
		flexBasis={footerHeight / 2 || 1}
	/>
</div>

<!-- TESTING ONLY: remove before shipping -->
<div
	class="pointer-events-none fixed right-6 bottom-6 z-50 flex flex-col gap-1 border border-[#0a0a0a] bg-(--light-primary)
    px-3 py-2 font-mono text-[0.75rem] text-(--light-text) shadow-[4px_4px_0_var(--brut-rule,#d6dedb)]"
>
	<span>home: {homePct}%</span>
	<span>projects: {projectsPct}%</span>
	<span>about: {aboutPct}%</span>
	<span>footer: {footerPct}%</span>
</div>