<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';

	import Lenis from 'lenis';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';

	import Navbar from '$lib/components/navigation/Navbar.svelte';
	import Home from '$lib/components/home/Home.svelte';
	import Projects from '$lib/components/projects/Projects.svelte';
	import About from '$lib/components/about/About.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

	let lenis: Lenis | undefined = $state();

	// Page section components
	let mainEl: HTMLElement;
	let homeSectionEl: HTMLElement | undefined = $state();
	let projectsSectionEl: HTMLElement | undefined = $state();
	let aboutSectionEl: HTMLElement | undefined = $state();
	let contactsSectionEl: HTMLElement | undefined = $state();

	// Convert time from seconds to milliseconds
	const raf = (time: number) => lenis?.raf(time * 1000);

	type sectionColorVal = {
		section: HTMLElement | undefined;
		bgColor: string;
		fontColor: string;
	};

	onMount(async () => {
		gsap.registerPlugin(ScrollTrigger);

		// Initialize a new Lenis instance for smooth scrolling
		lenis = new Lenis({
			duration: 1.2,
			easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
			smoothWheel: true,
			touchMultiplier: 1.1
		});

		// Synchronize Lenis scrolling with GSAP's ScrollTrigger plugin
		lenis.on('scroll', ScrollTrigger.update);

		// Add Lenis's requestAnimationFrame (raf) method to GSAP's ticker
		// This ensures Lenis's smooth scroll animation updates on each GSAP tick
		gsap.ticker.add(raf);

		// Disable lag smoothing in GSAP to prevent any delay in scroll animations
		gsap.ticker.lagSmoothing(0);

		await tick();
		ScrollTrigger.refresh();

		// Smooth color transition
		// define section and card elements and color values for each section
		const firstSection = {
			section: projectsSectionEl,
			bgColor: '#000',
			fontColor: '#f2f2f2'
		};

		const secondSection = {
			section: aboutSectionEl,
			bgColor: '#fff',
			fontColor: '#0d0d0d'
		};

		const thirdSection = {
			section: contactsSectionEl,
			bgColor: '#000',
			fontColor: '#f2f2f2'
		};

		// Set the container color values to the 'next' section's color values
		function setColors(next: sectionColorVal) {
			gsap.to(mainEl, {
				ease: 'sine.inOut',
				duration: 1,
				background: next.bgColor,
				color: next.fontColor
			});
		}

		// set initial color values for container
		gsap.set(mainEl, {
			backgroundColor: firstSection.bgColor,
			color: firstSection.fontColor
		});

		// setup scroll trigger enter and onLeaveBack methods,
		// passing current section colors and incoming section colors
		// to transition from first section to second section and back
		gsap.to(secondSection, {
			duration: 0.5,
			scrollTrigger: {
				trigger: secondSection.section,
				start: 'top 5%',
				end: '+=100',
				onEnter: () => setColors(secondSection),
				onLeaveBack: () => setColors(firstSection)
			}
		});

		// setup scroll trigger enter and onLeaveBack methods,
		// passing current section colors and incoming section colors
		// to transition from second section to third section and back
		gsap.to(thirdSection, {
			duration: 0.5,
			scrollTrigger: {
				trigger: thirdSection.section,
				start: 'top 5%',
				end: '+=100',
				onEnter: () => setColors(thirdSection),
				onLeaveBack: () => setColors(secondSection)
			}
		});
	});

	onDestroy(() => {
		gsap.ticker.remove(raf);
		lenis?.destroy();
	});
</script>

<Navbar {lenis} {homeSectionEl} {projectsSectionEl} {aboutSectionEl} {contactsSectionEl} />

<main bind:this={mainEl}>
	<Home bind:el={homeSectionEl} />
	<Projects bind:el={projectsSectionEl} />
	<About bind:el={aboutSectionEl} />
	<Footer bind:el={contactsSectionEl} />
</main>
