<script lang="ts">
	import type Lenis from 'lenis';
	import NavItem from '$lib/components/navigation/NavItem.svelte';
    
	let {
		lenis,
		homeSectionEl,
		projectsSectionEl,
		aboutSectionEl,
		contactsSectionEl
	}: {
		lenis: Lenis | undefined;
		homeSectionEl: HTMLElement | undefined;
		projectsSectionEl: HTMLElement | undefined;
		aboutSectionEl: HTMLElement | undefined;
		contactsSectionEl: HTMLElement | undefined;
	} = $props();

</script>

<header class="fixed top-1 right-10 left-10 z-50 mix-blend-difference">
    <nav aria-label="Primary navigation">
        <ul class="flex items-end gap-6">
			<NavItem {lenis} targetSectionEl={homeSectionEl} title="Home" href="#home" flexGrow={1.8} position="first"/>
			<NavItem {lenis} targetSectionEl={projectsSectionEl} title="Projects" href="#projects"/>
			<NavItem {lenis} targetSectionEl={aboutSectionEl} title="About" href="#about"/>
			<NavItem {lenis} targetSectionEl={contactsSectionEl} title="Contacts" href="#contacts" flexGrow={1.2} position="last"/>
        </ul>
    </nav>
</header>
