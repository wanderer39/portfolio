<script lang="ts">
    import { onMount } from 'svelte';
    
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    let firstText: HTMLParagraphElement | undefined = $state();
    let secondText: HTMLParagraphElement | undefined = $state();
    let slider: HTMLDivElement | undefined = $state();

    let xPercent = 0;
    let direction = -1;
    let animationFrameId: number;

    const animate = () => {
        if (!firstText || !secondText) return;

        if (xPercent < -100) {
            xPercent = 0;
        } else if (xPercent > 0) {
            xPercent = -100;
        }
        gsap.set(firstText, { xPercent: xPercent });
        gsap.set(secondText, { xPercent: xPercent });
        animationFrameId = requestAnimationFrame(animate);
        xPercent += 0.1 * direction;
    };

    onMount(() => {
        gsap.registerPlugin(ScrollTrigger);

        if (!slider) return;

        if (secondText) {
            gsap.set(secondText, { left: secondText.getBoundingClientRect().width });
        }

        const tween = gsap.to(slider, {
            scrollTrigger: {
                trigger: document.documentElement,
                scrub: 0.5,
                start: 0,
                end: window.innerHeight,
                onUpdate: (e) => (direction = e.direction * -1)
            },
            x: '-500px'
        });

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
            tween.kill();
            ScrollTrigger.getAll().forEach((st) => st.kill());
        };
    });
</script>

<div class="relative w-full h-screen">
    <div class="absolute top-[calc(100vh-350px)]">
        <div bind:this={slider} class="slider relative whitespace-nowrap">
            <p bind:this={firstText} class="relative m-0 text-white text-[230px] font-medium pr-12.5">
                Software Developer -
            </p>
            <p bind:this={secondText} class="absolute left-full top-0 m-0 text-white text-[230px] font-medium pr-12.5">
                Software Developer -
            </p>
        </div>
    </div>
</div>