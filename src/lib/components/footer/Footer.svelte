<script lang="ts">
	import { onMount } from 'svelte';
	import { gsap } from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import MailHeading from '$lib/components/footer/MailHeading.svelte';
	import MailContent from '$lib/components/footer/MailContent.svelte';
	import MailFooter from '$lib/components/footer/MailFooter.svelte';
	import type { MailValues } from '$lib/components/footer/mail-types';

	let {
		el = $bindable(),
		aboutEl
	}: { el?: HTMLElement; aboutEl?: HTMLElement } = $props();


	let subject = $state('');
	let values = $state<MailValues>({ name: '', email: '', message: '' });
	let step = $state(0);

	const isDirty = $derived(subject !== '' || step > 0);

	function clearAll() {
		subject = '';
		values = { name: '', email: '', message: '' };
		step = 0;
	}

	let pinEl: HTMLDivElement | undefined = $state();
	let headingWrap: HTMLDivElement | undefined = $state();
	let contentWrap: HTMLDivElement | undefined = $state();
	let footerWrap: HTMLDivElement | undefined = $state();

	onMount(() => {
		if (!pinEl || !headingWrap || !contentWrap || !footerWrap || !aboutEl) return;

		gsap.registerPlugin(ScrollTrigger);

		const items = [headingWrap, contentWrap, footerWrap].filter(Boolean) as HTMLElement[];

		gsap.set(items, { x: -120, opacity: 0 });

		const tl = gsap.timeline({
			scrollTrigger: {
				markers: true,
				trigger: aboutEl, // fires based on the About section's scroll position, not the mail section
				start: '60% top', // About section is ~80% scrolled through / 80% visible-from-bottom
				end: '+=100%',
				scrub: true,
				// pin: pinEl, // pin target stays the mail section even though trigger is elsewhere
				// pinSpacing: true
			}
		});

		tl.to(headingWrap, { x: 0, opacity: 1, ease: 'power3.out', duration: 1 })
			.to(contentWrap, { x: 0, opacity: 1, ease: 'power3.out', duration: 1 }, 0.3)
			.to(footerWrap, { x: 0, opacity: 1, ease: 'power3.out', duration: 1 }, 0.6);

		return () => {
			tl.scrollTrigger?.kill();
			tl.kill();
		};
	});
</script>

<section bind:this={el} class="h-[240dvh] w-full">
	<!-- mail section -->
	<div bind:this={pinEl} class="h-[140dvh] w-full sticky top-0">
		<!-- left side -->
		<div class="z-100 flex h-full w-1/2 flex-col items-start justify-start gap-4 pt-38 pl-10">
			<div bind:this={headingWrap} class="w-full">
				<MailHeading />
			</div>

			<div bind:this={contentWrap} class="w-full">
				<MailContent bind:subject bind:values bind:step />
			</div>

			<div bind:this={footerWrap} class="w-full">
				<MailFooter {isDirty} onclear={clearAll} />
			</div>
		</div>
	</div>

	<!-- footer section -->
	<div class="h-dvh w-full bg-amber-50"></div>
</section>
