<script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import Lenis from 'lenis'
    import gsap from 'gsap'
    import { ScrollTrigger } from 'gsap/ScrollTrigger'
    import Landing from '$lib/components/home/Landing.svelte'

    let lenis: Lenis | undefined

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

<main>
    <Landing />
</main>