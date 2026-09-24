<script lang="ts">
	import SkillsMarquee from '$lib/components/about/SkillsMarquee.svelte';

	const whatIDo = ['System Design', 'Backend Development', 'Data Analysis'];

	const whatIUse = [
		'.Net', 'Django', 'FastAPI', 'Sveltekit', 'SpringBoot',
		'Pandas', 'Seaborn', 'Linux', 'Kubernetes', 'Podman',
		'Kafka', 'Redis', 'Debezium', 'GSAP', 'Threlte', 'Avalonia'
	];
</script>

<div class="h-fit w-3/4 flex gap-64 justify-start items-start">
	<div>
		<h1 class="text-2xl mb-2 font-montserrat font-[450]">What I Do</h1>
		<div>
			<ul class="text-[1.05rem] text-(--light-accent) font-inter">
				{#each whatIDo as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div>
		<h1 class="text-2xl mb-2 font-montserrat font-[450]">What I Use</h1>
		<SkillsMarquee items={whatIUse} heightClass="h-64" />
	</div>
</div>