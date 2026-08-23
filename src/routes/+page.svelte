<script lang="ts">
	import { onDestroy, onMount, tick } from "svelte";

	import Lenis from "lenis";
	import gsap from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";

	import Navbar from "$lib/components/navigation/Navbar.svelte";
	import Home from "$lib/components/home/Home.svelte";
	import Projects from "$lib/components/projects/Projects.svelte";
	import About from "$lib/components/about/About.svelte";
	import Footer from "$lib/components/footer/Footer.svelte";

	let lenis: Lenis | undefined = $state();

	// Page section components
	let homeSectionEl: HTMLElement | undefined = $state();
	let projectsSectionEl: HTMLElement | undefined = $state();
	let aboutSectionEl: HTMLElement | undefined = $state();
	let contactsSectionEl: HTMLElement | undefined = $state();

	// Convert time from seconds to milliseconds
	const raf = (time: number) => lenis?.raf(time * 1000);

	onMount(async() => {
		gsap.registerPlugin(ScrollTrigger);

		// Initialize a new Lenis instance for smooth scrolling
		lenis = new Lenis({
			duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
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
	})

	onDestroy(() => {
		gsap.ticker.remove(raf);
		lenis?.destroy();
	});
</script>

<Navbar {lenis} {homeSectionEl} {projectsSectionEl} {aboutSectionEl} {contactsSectionEl}/>

<main>
	<Home bind:el={homeSectionEl}/>
	<Projects bind:el={projectsSectionEl} />
	<About bind:el={aboutSectionEl} />
    <Footer bind:el={contactsSectionEl} />
</main>