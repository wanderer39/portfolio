<script lang="ts">
    import Landing from './Landing.svelte'
    import Works from './Works.svelte'
    import Projects from './Projects.svelte'
    import ScrollProgress from './ScrollProgress.svelte'
	import Footer from './Footer.svelte';

    let landingEl: HTMLElement | undefined = $state(undefined)
    let worksEl: HTMLElement | undefined = $state(undefined)
    let projectsEl: HTMLElement | undefined = $state(undefined)
    let footerEl: HTMLElement | undefined = $state(undefined)
</script>

<ScrollProgress {landingEl} {worksEl} {projectsEl} {footerEl} />

<main>
    <Landing bind:el={landingEl} />
    <Works bind:el={worksEl} />
    <Projects bind:el={projectsEl} />
    <Footer bind:el={footerEl}/>
</main>