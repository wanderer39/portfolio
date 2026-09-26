<script lang="ts">
	let { index, title, category, link, setModal } = $props();

	function handleClick() {
		window.open(link, '_blank', 'noopener,noreferrer');
	}
</script>

<button
	aria-label={title}
	class="group flex w-full cursor-pointer flex-col items-start justify-between gap-2 border-t border-[rgb(201,201,201)]
		bg-transparent px-4 py-6 text-left font-inherit transition-all duration-200
		last:border-b hover:opacity-50 focus:outline-none focus-visible:outline-none active:outline-none
		sm:px-8 sm:py-8
		md:flex-row md:items-center md:gap-0 md:px-24 md:py-14"
	onmouseenter={() => setModal({ active: true, index })}
	onmouseleave={() => setModal({ active: false, index })}
	onclick={handleClick}
>
	<h2
		class="m-0 text-3xl font-normal transition-transform duration-400 group-hover:-translate-x-2.5
			sm:text-4xl md:text-6xl"
	>
		{title}
	</h2>
	<p class="text-sm font-light transition-transform duration-400 group-hover:translate-x-2.5 md:text-base">
		{category}
	</p>
</button>