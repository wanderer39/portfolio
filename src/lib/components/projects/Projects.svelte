<script lang="ts">
	import ProjectItem from "$lib/components/projects/ProjectItem.svelte";
	import ProjectModal from "$lib/components/projects/ProjectModal.svelte";

	import HomeBackground from "$lib/assets/images/home-background.jpg";
	
	let { el = $bindable() }: { el?: HTMLElement } = $props()

    interface ProjectsProps {
        title: string;
        src: string;
        color: string;
        category: string;
    };

    interface ModalState {
		active: boolean;
		index: number;
	}

	const projects: ProjectsProps[] = [
		{
			title: 'C2 Montreal',
			src: HomeBackground,
			color: '#000000',
			category: 'Design & Development'
		},
		{
			title: 'Office Studio',
			src: HomeBackground,
			color: '#8C8C8C',
			category: 'Design & Development'
		},
		{
			title: 'Locomotive',
			src: HomeBackground,
			color: '#EFE8D3',
			category: 'Design & Development'
		},
		{
			title: 'Silencio',
			src: HomeBackground,
			color: '#706D63',
			category: 'Design & Development'
		}
	];

	let modal: ModalState = $state({ active: false, index: 0 });

	function setModal(newModal: ModalState) {
		modal = newModal;
	}
</script>

<section bind:this={el} class="flex h-[130dvh] items-start justify-center">
	<div class="w-5/6 flex flex-col items-center justify-center">
		{#each projects as project, index (index)}
			<ProjectItem {index} title={project.title} category={project.category} {setModal} />
		{/each}
	</div>
	<ProjectModal {modal} {projects} />
</section>


