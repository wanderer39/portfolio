<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { SplitText } from 'gsap/SplitText';

	let { el = $bindable() }: { el?: HTMLElement } = $props();

	let emailLabelEl: HTMLSpanElement;
	let isEmailShown = $state(false);

	const DEFAULT_LABEL = 'Drop an email @';
	const EMAIL_ADDRESS = 'wanderer3@tutamail.com';

	function rollLabel(labelEl: HTMLElement, nextText: string) {
		const outSplit = SplitText.create(labelEl, {
			type: 'chars',
			smartWrap: true
		});

		gsap.to(outSplit.chars, {
			rotationX: -90,
			transformOrigin: '50% 50% -20px',
			autoAlpha: 0,
			ease: 'power3.in',
			duration: 0.5,
			stagger: { amount: 0.3 },
			onComplete: () => {
				outSplit.revert();
				labelEl.textContent = nextText;

				const inSplit = SplitText.create(labelEl, {
					type: 'chars',
					smartWrap: true
				});

				gsap.from(inSplit.chars, {
					rotationX: 90,
					transformOrigin: '50% 50% -20px',
					autoAlpha: 0,
					ease: 'power3.out',
					duration: 0.9,
					stagger: { amount: 0.4 }
				});
			}
		});
	}

	function handleEmailClick() {
		isEmailShown = !isEmailShown;
		rollLabel(emailLabelEl, isEmailShown ? EMAIL_ADDRESS : DEFAULT_LABEL);
	}

	onMount(() => {
		gsap.registerPlugin(SplitText);
	});
</script>

<section bind:this={el} class="h-dvh w-full">
	<div class="h-dvh w-full">
		<div class="h-1/2 w-full">
			<div class="flex size-full px-8 pt-26">
				<div class="flex h-full w-1/2 flex-col items-start justify-start gap-8">
					<div>
						<h1 class="font-ppneuemontreal text-8xl">Let's talk</h1>
					</div>
					<div>
						<!-- email -->
						<button
							type="button"
							onclick={handleEmailClick}
							class="flex h-14 w-64 items-center justify-center gap-6 rounded-full text-[1.1rem] outline-1 outline-(--light-accent)"
						>
							<span bind:this={emailLabelEl}>{DEFAULT_LABEL}</span>
						</button>
					</div>
				</div>

				<!-- socials -->
				<div class="flex h-full w-1/2 flex-col items-center justify-center gap-8">
					<div class="flex translate-x-30 translate-y-12 flex-col gap-1 font-ppneuemontreal text-3xl no-underline">
						<a
							href="https://www.linkedin.com/in/binay-s-198a79316/"
							class="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							Linkedin
						</a>
						<a
							href="https://www.reddit.com/user/Maximum_Art_431/"
							class="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							Reddit
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="h-1/2 w-full">
			<div class="flex size-full items-center justify-center pt-36">
				<h1 class="m-0 p-0 font-ppneuemontreal text-[21rem] leading-8 text-(--dark-text) uppercase">
					Wanderer
				</h1>
			</div>
		</div>
	</div>
</section>

<style>
	.link {
		position: relative;
		display: inline-block;
		width: fit-content;
		border: none;
		outline: none;
		text-decoration: none;
	}

	.link::after {
		content: '';
		position: absolute;
		left: 0;
		bottom: -4px;
		width: 100%;
		height: 1px;
		background: currentColor;

		transform: scaleX(0);
		transform-origin: right;
		transition: transform 0.4s ease;
	}

	.link:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}
</style>
