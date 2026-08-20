<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    
    import Lenis from 'lenis'
    import gsap from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'

    import Landing from '$lib/components/home/Landing.svelte'
	import Projects from '$lib/components/projects/Projects.svelte';
	import About from '$lib/components/about/About.svelte';
	import ScrollProgress from '$lib/components/navigation/ScrollProgress.svelte';
	import Footer from '$lib/components/footer/Footer.svelte';

    
    let lenis: Lenis | undefined

    let landingEl: HTMLElement | undefined = $state(undefined)
    let projectsEl: HTMLElement | undefined = $state(undefined)
    let aboutEl: HTMLElement | undefined = $state(undefined)
    let footerEl: HTMLElement | undefined = $state(undefined)

    function raf(time: number) {
        // gsap.ticker's `time` is in seconds; Lenis expects milliseconds
        lenis?.raf(time * 1000)
    }

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger)

        lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })

        lenis.on('scroll', ScrollTrigger.update)

        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
    })

    onDestroy(() => {
        gsap.ticker.remove(raf)
        lenis?.destroy()
    })
</script>

<ScrollProgress {landingEl} {projectsEl} {aboutEl} {footerEl} />

<main>
    <Landing bind:el={landingEl} />
    <Projects bind:el={projectsEl} />
    <About bind:el={aboutEl} />
    <Footer bind:el={footerEl} />
</main>