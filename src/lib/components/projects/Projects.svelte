<script lang="ts">
	import ProjectItem from '$lib/components/projects/ProjectItem.svelte';
	import ProjectModal from '$lib/components/projects/ProjectModal.svelte';

	import HomeBackground from '$lib/assets/images/home-background.jpg';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	interface ProjectsProps {
		title: string;
		src: string;
		color: string;
		category: string;
		link: string;
	}

	interface ModalState {
		active: boolean;
		index: number;
	}

	const projects: ProjectsProps[] = [
		{
			title: 'MaliciousUrlDetector',
			src: HomeBackground,
			color: '#000000',
			category: 'Data Analysis',
			link: 'https://github.com/wanderer39/MaliciousUrlDetector'
		},
		{
			title: 'NorthwindAnalysis',
			src: HomeBackground,
			color: '#8C8C8C',
			category: 'Data Analysis',
			link: 'https://github.com/wanderer39/NorthwindAnalysis'
		},
		{
			title: 'AppProfilesAnalytics',
			src: HomeBackground,
			color: '#EFE8D3',
			category: 'Data Analysis',
			link: 'https://github.com/wanderer39/AppProfilesAnalytics'
		},
		{
			title: 'Disq',
			src: HomeBackground,
			color: '#706D63',
			category: 'Web Development',
			link: 'https://github.com/astro81/disq-frontend'
		},
		{
			title: 'Sddm Sekiro',
			src: HomeBackground,
			color: '#706D63',
			category: 'Misc',
			link: 'https://github.com/wanderer39/sddm-sekiro-theme'
		}
	];

	let modal: ModalState = $state({ active: false, index: 0 });

	function setModal(newModal: ModalState) {
		modal = newModal;
	}
</script>

<section bind:this={el} class="flex h-[130dvh] items-start justify-center">
	<div class="flex w-5/6 flex-col items-center justify-center">
		{#each projects as project, index (index)}
			<ProjectItem
				{index}
				title={project.title}
				category={project.category}
				link={project.link}
				{setModal}
			/>
		{/each}
	</div>
	<!-- <ProjectModal {modal} {projects} /> -->
</section>
