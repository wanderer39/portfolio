<script lang="ts">
	import MailHeading from '$lib/components/footer/MailHeading.svelte';
	import MailContent from '$lib/components/footer/MailContent.svelte';
	import MailFooter from '$lib/components/footer/MailFooter.svelte';
	import type { MailValues } from '$lib/components/footer/mail-types';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let subject = $state('');
	let values = $state<MailValues>({ name: '', email: '', message: '' });
	let step = $state(0);

	const isDirty = $derived(subject !== '' || step > 0);

	function clearAll() {
		subject = '';
		values = { name: '', email: '', message: '' };
		step = 0;
	}
</script>

<section bind:this={el} class="h-[200dvh] w-full">
	<!-- mail section -->
	<div class="h-dvh w-full outline-1">
		<!-- left side -->
		<div class="flex h-full w-1/2 flex-col items-start justify-start gap-4 pt-38 pl-10">
			<MailHeading />
			<MailContent bind:subject bind:values bind:step />
			<MailFooter {isDirty} onclear={clearAll} />
		</div>
	</div>

	<!-- footer section -->
	<div></div>
</section>