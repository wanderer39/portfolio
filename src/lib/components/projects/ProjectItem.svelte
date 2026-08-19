<script>
	let { index, title, category, setModal } = $props();
</script>

<div
	role="region"
	aria-label={title}
	class="group flex w-full cursor-pointer items-center justify-between border-t border-[rgb(201,201,201)] px-24 py-14 transition-all duration-200 last:border-b hover:opacity-50"
	onmouseenter={() => setModal({ active: true, index })}
	onmouseleave={() => setModal({ active: false, index })}
>
	<h2
		class="m-0 text-6xl font-normal transition-transform duration-400 group-hover:-translate-x-2.5"
	>
		{title}
	</h2>
	<p class="font-light transition-transform duration-400 group-hover:translate-x-2.5">
		{category}
	</p>
</div>
