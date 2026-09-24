<script lang="ts">
	import { tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import type { FieldKey, MailValues } from '$lib/components/footer/mail-types';

	let {
		subject = $bindable(),
		values = $bindable(),
		step = $bindable()
	}: { subject: string; values: MailValues; step: number } = $props();

	const fields: { key: FieldKey; prefix: string; type: 'text' | 'email' }[] = [
		{ key: 'name', prefix: 'Hi, my name is', type: 'text' },
		{ key: 'email', prefix: 'You can mail me at', type: 'email' },
		{ key: 'message', prefix: 'Message:', type: 'text' }
	];

	let chatEl = $state<HTMLElement>();

	function scrollToBottom() {
		tick().then(() => chatEl?.scrollTo({ top: chatEl.scrollHeight, behavior: 'smooth' }));
	}

	function start() {
		if (step !== 0) return;
		step = 1;
		scrollToBottom();
	}

	function submit(key: FieldKey) {
		const value = values[key].trim();
		if (!value) return;
		values[key] = value;
		step++;
		scrollToBottom();
	}

	// Enter on the intro screen (ignored while typing in an input or pressing a button)
	function onWindowKey(e: KeyboardEvent) {
		if (step !== 0 || e.key !== 'Enter' || e.repeat) return;
		if ((e.target as HTMLElement).closest('input, textarea, button')) return;
		start();
	}

	// focus each input as it appears
	function focusOnMount(node: HTMLInputElement) {
		node.focus();
	}
</script>

<svelte:window onkeydown={onWindowKey} />

{#snippet enterButton(onclick: () => void)}
	<button
		type="button"
		{onclick}
		class="flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-3 font-rubik text-xs tracking-wider uppercase outline-1 outline-(--light-accent) transition-colors hover:bg-(--light-accent) hover:text-(--dark-primary)"
	>
		Enter <span aria-hidden="true">↵</span>
	</button>
{/snippet}

<div
	class="flex h-132 w-[95%] flex-col overflow-hidden rounded-lg outline-1 outline-(--light-accent)"
>
	<!-- subject -->
	<label
		class="flex h-14 w-full shrink-0 cursor-text items-center gap-2 border-b border-(--light-accent) px-6"
	>
		<span class="font-rubik text-base whitespace-nowrap select-none">Subject:</span>
		<input
			bind:value={subject}
			type="text"
			placeholder="..."
			class="h-full flex-1 border-none bg-transparent font-inter text-base outline-none placeholder:opacity-50 focus:border-transparent focus:shadow-none focus:ring-0 focus:outline-none"
		/>
	</label>

	<!-- chat body -->
	<div
		bind:this={chatEl}
		class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-6 py-5 font-inter text-xl"
	>
		{#if step === 0}
			<div class="flex items-center gap-3" in:fly={{ y: 8, duration: 250 }}>
				<p>Hit Enter to get started!</p>
				{@render enterButton(start)}
			</div>
		{/if}

		{#each fields as field, i (field.key)}
			{#if step >= i + 1}
				<div class="flex items-center gap-2" in:fly={{ y: 8, duration: 250 }}>
					<span class="whitespace-nowrap">{field.prefix}</span>

					{#if step === i + 1}
						<input
							use:focusOnMount
							bind:value={values[field.key]}
							type={field.type}
							onkeydown={(e) => {
								if (e.key === 'Enter' && !e.repeat) {
									e.preventDefault();
									submit(field.key);
								}
							}}
							class="h-8 min-w-0 flex-1 border-0 border-(--light-accent)/40 bg-transparent font-inter text-base outline-none focus:border-(--light-accent) focus:shadow-none focus:ring-0 focus:outline-none"
						/>

						{#if values[field.key].trim()}
							{@render enterButton(() => submit(field.key))}
						{/if}
					{:else}
						<span class="font-medium break-all">{values[field.key]}</span>
					{/if}
				</div>
			{/if}
		{/each}

		{#if step > fields.length}
			<p class="text-sm! opacity-30" in:fly={{ y: 8, duration: 250, delay: 150 }}>
				All set. Hit "Send Request" whenever you're ready.
			</p>
		{/if}
	</div>
</div>
