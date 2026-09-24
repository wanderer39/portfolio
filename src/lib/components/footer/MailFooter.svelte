<script lang="ts">
	let { isDirty, onclear, onsend }: { isDirty: boolean; onclear: () => void; onsend?: () => void } =
		$props();
</script>

<div class="flex h-18 w-[95%] items-center justify-between rounded-lg outline-1 outline-(--light-accent)">
	<div class="flex h-full w-fit items-center justify-center px-6">
		<button
			type="button"
			onclick={(e) => {
				onclear();
				e.currentTarget.blur();
			}}
			disabled={!isDirty}
			class="h-10 cursor-pointer rounded-md px-4 font-rubik text-sm tracking-wider uppercase outline-1 outline-(--light-accent) transition-colors hover:bg-(--light-accent) hover:text-(--dark-primary) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit"
		>
			Clear
		</button>
	</div>

	<div class="flex h-full w-fit items-center justify-center px-6">
		<button
			type="button"
			onclick={onsend}
			class="h-12 w-34 rounded-md bg-(--light-accent) font-rubik text-sm font-medium tracking-wider text-(--dark-primary) uppercase"
		>
			Send Request
		</button>
	</div>
</div>
