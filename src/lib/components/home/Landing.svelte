<script lang="ts">
	import { onMount } from "svelte";
	import gsap from "gsap";
	import { SplitText } from "gsap/SplitText";

	let heroHeadingEls: HTMLHeadingElement[] = $state([]);
	let heroTextEl: HTMLParagraphElement;

	onMount(async () => {
		gsap.registerPlugin(SplitText);

		await document.fonts.ready;

		heroHeadingEls.forEach((heroHeadingEl) => {
			SplitText.create(heroHeadingEl, {
				type: "chars",
				smartWrap: true,

				onSplit: (self) => {
					return gsap.from(self.chars, {
						rotationX: 90,
						transformOrigin: "50% 50% -20px",
						autoAlpha: 0,
						ease: "power3.out",
						duration: 1.4,
						stagger: {
							amount: 0.6
						}
					});
				}
			});
		});

		SplitText.create(heroTextEl, {
			type: "lines",
			smartWrap: true,
			mask: "lines",

			onSplit: (self) => {
				return gsap.from(self.lines, {
					y: 20,
					opacity: 0,
					autoAlpha: 0,
					ease: "power2.out",
					duration: 0.6,
					stagger: 0.2
				});
			}
		});
	});
</script>

<div
	class="relative flex h-screen w-full flex-col justify-between overflow-hidden bg-(--light-background) px-6 pt-14 pb-10 sm:px-8 md:block md:p-0"
>
	<!-- Headings: stacked column on mobile, contents (free to position absolutely) on md+ -->
	<div class="flex flex-col gap-1 md:contents">
		<div class="flex p-0 m-0 md:absolute md:top-32 md:left-8">
			<!-- svelte-ignore a11y_unknown_role -->
			<h1
				bind:this={heroHeadingEls[0]}
				role="text"
				class="m-0 p-0 text-[clamp(2.75rem,13vw,10rem)] leading-[0.9] text-(--light-text) font-montserrat font-semibold italic md:text-[clamp(4rem,7vw,10rem)]"
			>
				Creative
			</h1>
		</div>

		<div class="flex justify-end p-0 m-0 md:absolute md:top-[81%] md:right-10 md:justify-start">
			<!-- svelte-ignore a11y_unknown_role -->
			<h1
				bind:this={heroHeadingEls[1]}
				role="text"
				class="m-0 p-0 text-[clamp(2.75rem,13vw,10rem)] leading-[0.9] text-(--light-text) font-montserrat font-semibold italic md:text-[clamp(4rem,7vw,10rem)]"
			>
				Developer
			</h1>
		</div>
	</div>

	<!-- Body text: full-width block at the bottom on mobile, absolute-positioned column on md+ -->
	<div
		class="flex w-full max-w-md py-0 px-0 m-0 md:absolute md:top-[83%] md:left-10 md:h-24 md:w-126 md:max-w-none md:px-2"
	>
		<!-- svelte-ignore a11y_unknown_role -->
		<p
			bind:this={heroTextEl}
			role="text"
			class="m-0 p-0 text-[clamp(0.7rem,2.6vw,0.95rem)] leading-normal text-(--light-accent) font-inter font-normal uppercase md:text-[clamp(0.7rem,0.7vw,0.95rem)] md:leading-[1.4]"
		>
			Shaping ideas into refined digital experiences where creative thinking meets systems design, analytical problem-solving, and careful engineering to create work that is purposeful, intuitive, and built to last.
		</p>
	</div>
</div>