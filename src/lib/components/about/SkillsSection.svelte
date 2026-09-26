<script lang="ts">
	import SkillsMarquee from '$lib/components/about/SkillsMarquee.svelte';

	const whatIDo = ['System Design', 'Backend Development', 'Data Analysis'];

	const whatIUse = [
		'.Net', 'Django', 'FastAPI', 'Sveltekit', 'SpringBoot',
		'Pandas', 'Seaborn', 'Linux', 'Kubernetes', 'Podman',
		'Kafka', 'Redis', 'Debezium', 'GSAP', 'Threlte', 'Avalonia'
	];
</script>

<div class="flex h-fit w-full flex-col items-center gap-10 px-2 sm:w-11/12 md:w-3/4 md:flex-row md:items-start md:justify-start md:gap-64 md:px-0">
	<div class="text-center md:text-left">
		<h1 class="mb-2 font-montserrat text-xl font-[450] sm:text-2xl">What I Do</h1>
		<ul class="text-[1.05rem] text-(--light-accent) font-inter">
			{#each whatIDo as item (item)}
				<li>{item}</li>
			{/each}
		</ul>
	</div>

	<div class="w-full md:w-auto">
		<h1 class="mb-2 text-center font-montserrat text-xl font-[450] sm:text-2xl md:text-left">
			What I Use
		</h1>
		<SkillsMarquee items={whatIUse} heightClass="h-48 md:h-64" />
	</div>
</div>