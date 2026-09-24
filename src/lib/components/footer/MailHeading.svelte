<script lang="ts">
	let { name = 'Wanderer', email = 'wanderer@tutamail.com' }: { name?: string; email?: string } =
		$props();
</script>

<div
	class="flex h-18 w-[95%] items-center justify-between rounded-lg outline-1 outline-(--light-accent)"
>
	<div class="flex h-full w-fit items-center justify-center px-6">
		<h1 class="font-rubik text-base uppercase">To: {name}</h1>
	</div>
	<div class="flex h-full w-fit items-center justify-center px-6">
		<h1 class="font-inter text-base">{email}</h1>
	</div>
</div>