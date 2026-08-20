<script lang="ts">
	import ProjectItem from "$lib/components/projects/ProjectItem.svelte";
	import ProjectModal from "$lib/components/projects/ProjectModal.svelte";

	
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
			src: 'c2montreal.png',
			color: '#000000',
			category: 'Design & Development'
		},
		{
			title: 'Office Studio',
			src: 'officestudio.png',
			color: '#8C8C8C',
			category: 'Design & Development'
		},
		{
			title: 'Locomotive',
			src: 'locomotive.png',
			color: '#EFE8D3',
			category: 'Design & Development'
		},
		{
			title: 'Silencio',
			src: 'silencio.png',
			color: '#706D63',
			category: 'Design & Development'
		}
	];

	let modal: ModalState = $state({ active: false, index: 0 });

	function setModal(newModal: ModalState) {
		modal = newModal;
	}
</script>

<section bind:this={el} data-theme="dark" class="flex h-[150dvh] items-center justify-center">
	<div class="w-5/6 flex flex-col items-center justify-center">
		{#each projects as project, index (index)}
			<ProjectItem {index} title={project.title} category={project.category} {setModal} />
		{/each}
	</div>
	<ProjectModal {modal} {projects} />
</section>


