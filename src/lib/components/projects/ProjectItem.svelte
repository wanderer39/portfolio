<script>
	let { index, title, category, link, setModal } = $props();

	function handleClick() {
		window.open(link, '_blank', 'noopener,noreferrer');
	}
</script>

<button
	aria-label={title}
	class="group flex w-full cursor-pointer items-center justify-between border-t border-[rgb(201,201,201)] bg-transparent px-24 py-14 text-left font-inherit transition-all duration-200 last:border-b hover:opacity-50 focus:outline-none focus-visible:outline-none active:outline-none"
	onmouseenter={() => setModal({ active: true, index })}
	onmouseleave={() => setModal({ active: false, index })}
	onclick={handleClick}
>
	<h2
		class="m-0 text-6xl font-normal transition-transform duration-400 group-hover:-translate-x-2.5"
	>
		{title}
	</h2>
	<p class="font-light transition-transform duration-400 group-hover:translate-x-2.5">
		{category}
	</p>
</button>