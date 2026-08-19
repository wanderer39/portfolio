<script lang="ts">
	import { onMount } from 'svelte';
	
	import { motion, type Variants } from '@humanspeak/svelte-motion';
	import gsap from 'gsap';

	
	interface Project {
		title: string;
		src: string;
		color: string;
		category?: string;
	}

	interface ModalState {
		active: boolean;
		index: number;
	}

	let { modal, projects }: { modal: ModalState; projects: Project[] } = $props();

	let active = $derived(modal.active);
	let index = $derived(modal.index);

	const scaleAnimation: Variants = {
		initial: { scale: 0, x: '-50%', y: '-50%' },
		enter: {
			scale: 1,
			x: '-50%',
			y: '-50%',
			transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
		},
		closed: {
			scale: 0,
			x: '-50%',
			y: '-50%',
			transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] }
		}
	};

	// These now hold HTMLElement | null, matching the component's `ref` prop type
	let modalContainer: HTMLElement | null = $state(null);
	let cursor: HTMLElement | null = $state(null);
	let cursorLabel: HTMLElement | null = $state(null);

	onMount(() => {
		if (!modalContainer || !cursor || !cursorLabel) return;

		const xMoveContainer = gsap.quickTo(modalContainer, 'left', { duration: 0.8, ease: 'power3' });
		const yMoveContainer = gsap.quickTo(modalContainer, 'top', { duration: 0.8, ease: 'power3' });
		const xMoveCursor = gsap.quickTo(cursor, 'left', { duration: 0.5, ease: 'power3' });
		const yMoveCursor = gsap.quickTo(cursor, 'top', { duration: 0.5, ease: 'power3' });
		const xMoveCursorLabel = gsap.quickTo(cursorLabel, 'left', { duration: 0.45, ease: 'power3' });
		const yMoveCursorLabel = gsap.quickTo(cursorLabel, 'top', { duration: 0.45, ease: 'power3' });

		function handleMouseMove(e: MouseEvent) {
			const { pageX, pageY } = e;
			xMoveContainer(pageX);
			yMoveContainer(pageY);
			xMoveCursor(pageX);
			yMoveCursor(pageY);
			xMoveCursorLabel(pageX);
			yMoveCursorLabel(pageY);
		}

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<motion.div
	bind:ref={modalContainer}
	variants={scaleAnimation}
	initial="initial"
	animate={active ? 'enter' : 'closed'}
	class="pointer-events-none absolute flex h-87.5 w-100 items-center justify-center overflow-hidden bg-white"
>
	<div
		style="top: {index * -100}%"
		class="absolute h-full w-full transition-[top] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
	>
		{#each projects as project, i (`modal_${i}`)}
			<div
				class="flex h-full w-full items-center justify-center"
				style="background-color: {project.color}"
			>
				<img src={`/images/${project.src}`} width="300" alt="modal preview" class="h-auto" />
			</div>
		{/each}
	</div>
</motion.div>

<motion.div
	bind:ref={cursor}
	variants={scaleAnimation}
	initial="initial"
	animate={active ? 'enter' : 'closed'}
	class="pointer-events-none absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-[#455ce9]"
></motion.div>

<motion.div
	bind:ref={cursorLabel}
	variants={scaleAnimation}
	initial="initial"
	animate={active ? 'enter' : 'closed'}
	class="pointer-events-none absolute z-10 flex h-20 w-20 items-center justify-center rounded-full bg-transparent text-sm font-light text-white"
>
	View
</motion.div>
