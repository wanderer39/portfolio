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
					ease:"power2.out",
					duration: 0.6,					
					stagger: 0.2	
				})
			}
		})
		
	});
</script>

<div class="flex h-screen w-full justify-center bg-(--light-background)">

	<div class="flex p-0 m-0 absolute top-32 left-8">
		<h1 
			bind:this={heroHeadingEls[0]} 
			class="m-0 p-0 text-[clamp(4rem,7vw,10rem)] leading-[0.9] text-(--light-text) font-montserrat font-semibold italic"
			>Creative
		</h1>
	</div>

	<div class="flex p-0 m-0 absolute top-[41%] right-10">
		<h1 
			bind:this={heroHeadingEls[1]} 
			class="m-0 p-0 text-[clamp(4rem,7vw,10rem)] leading-[0.9] text-(--light-text) font-montserrat font-semibold italic" 
			>Developer
		</h1>
	</div>

	<div class="absolute left-10 top-[43%] h-24 w-126 py-0 px-2 m-0 flex">
		<p bind:this={heroTextEl} 
			class="m-0 p-0 text-[clamp(0.7rem,0.7vw,0.95rem)] leading-[1.4] text-(--light-accent) font-inter font-normal uppercase">
			Shaping ideas into refined digital experiences where creative thinking meets systems design, analytical problem-solving, and careful engineering to create work that is purposeful, intuitive, and built to last.
		</p>
	</div>

</div>