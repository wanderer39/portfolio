<script lang="ts">
	let { el = $bindable() }: { el?: HTMLElement } = $props();
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
						<div
							class="flex h-14 w-64 items-center justify-center gap-6 rounded-full text-[1.1rem] outline-1 outline-(--light-accent)"
						>
							<span>Drop an email</span>
							<span>@</span>
						</div>
					</div>
				</div>

				<!-- socials -->
				<div class="flex h-full w-1/2 flex-col items-center justify-center gap-8">
					<div
						class="flex translate-x-30 translate-y-12 flex-col gap-1 font-ppneuemontreal text-3xl no-underline"
					>
						<a href="https://www.linkedin.com/" class="link">Linkedin</a>
						<a href="https://www.reddit.com/" class="link">Reddit</a>
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
