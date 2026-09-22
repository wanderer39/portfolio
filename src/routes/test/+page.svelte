<!-- hero -->
<script lang="ts">
    import { onMount } from 'svelte';

    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import { SplitText } from 'gsap/SplitText';

    let heroEl: HTMLDivElement | undefined = $state();

    let leftMove: HTMLDivElement | undefined = $state();
    let leftText: HTMLParagraphElement | undefined = $state();

    let rightMove: HTMLDivElement | undefined = $state();
    let rightText: HTMLParagraphElement | undefined = $state();

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        const ctx = gsap.context(() => {
            if (
                !heroEl ||
                !leftMove ||
                !leftText ||
                !rightMove ||
                !rightText
            ) return;

            /*
             * SPLIT TEXT
             */
            const leftSplit = new SplitText(leftText, {
                type: 'lines'
            });

            const rightSplit = new SplitText(rightText, {
                type: 'lines'
            });

            const leftLines = leftSplit.lines;
            const rightLines = rightSplit.lines;

            /*
             * PERSPECTIVE
             */
            [...leftLines, ...rightLines].forEach((line) => {
                gsap.set(line.parentNode, {
                    perspective: 2000
                });
            });

            /*
             * LEFT LINE REVEAL
             */
            gsap.fromTo(
                leftLines,
                {
                    opacity: 0,
                    rotationX: -90,
                    yPercent: 50,
                    transformOrigin: '50% 100%'
                },
                {
                    opacity: 1,
                    rotationX: 0,
                    yPercent: 0,
                    ease: 'power1.inOut',
                    stagger: 0.12,

                    scrollTrigger: {
                        trigger: heroEl,
                        start: 'top top',
                        end: '40% top',
                        scrub: true
                    }
                }
            );

            /*
             * RIGHT LINE REVEAL
             */
            gsap.fromTo(
                rightLines,
                {
                    opacity: 0,
                    rotationX: -90,
                    yPercent: 50,
                    transformOrigin: '50% 100%'
                },
                {
                    opacity: 1,
                    rotationX: 0,
                    yPercent: 0,
                    ease: 'power1.inOut',
                    stagger: 0.12,

                    scrollTrigger: {
                        trigger: heroEl,
                        start: 'top top',
                        end: '40% top',
                        scrub: true
                    }
                }
            );

            /*
             * HORIZONTAL MOVEMENT
             *
             * 0%  → 70%
             * Stay in original position.
             *
             * 70% → 100%
             * Move away from each other.
             */
            const movement = gsap.timeline({
                scrollTrigger: {
                    trigger: heroEl,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true
                }
            });

            movement
                .to(
                    leftMove,
                    {
                        x: '-5rem',
                        opacity: 0,
                        ease: 'none',
                        duration: 0.3
                    },
                    0.7
                )
                .to(
                    rightMove,
                    {
                        x: '5rem',
                        opacity: 0,
                        ease: 'none',
                        duration: 0.3
                    },
                    0.7
                );
        }, heroEl);

        return () => ctx.revert();
    });
</script>

<div
    bind:this={heroEl}
    class="relative h-[200dvh] w-full"
>
    <div class="pointer-events-none fixed inset-0 z-10">
        <div class="flex h-dvh w-full items-center justify-center">

            <!-- LEFT -->
            <div
                bind:this={leftMove}
                class="absolute left-60 w-110 shrink-0 text-3xl"
            >
                <p bind:this={leftText}>
                    Crafting refined experiences with thoughtful design.
                </p>
            </div>

            <!-- RIGHT -->
            <div
                bind:this={rightMove}
                class="absolute right-60 w-110 shrink-0 text-3xl"
            >
                <p bind:this={rightText}>
                    Bridging creative thinking with thoughtful engineering.
                </p>
            </div>

        </div>
    </div>
</div>