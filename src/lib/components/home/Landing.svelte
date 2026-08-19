<script lang="ts">
    import { onMount } from 'svelte';
    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';
    import HomeBackground from '$lib/assets/images/home-background.jpg';

    let firstText = $state<HTMLParagraphElement | null>(null);
    let secondText = $state<HTMLParagraphElement | null>(null);
    let slider = $state<HTMLDivElement | null>(null);

    let xPercent = 0;
    let direction = -1;
    let animationFrameId: number;

    const animate = () => {
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

<main class="relative flex h-screen mb-[100vh] overflow-x-clip">
    <enhanced:img 
        src={HomeBackground} 
        alt="Landing Page"
        class="absolute inset-0 h-full w-full object-cover -z-10" 
    />

    <div class="absolute top-[calc(100vh-350px)]">
        <div bind:this={slider} class="slider relative whitespace-nowrap">
            <p bind:this={firstText} class="relative m-0 text-white text-[230px] font-medium pr-12.5">
                Freelance Developer -
            </p>
            <p bind:this={secondText} class="absolute left-full top-0 m-0 text-white text-[230px] font-medium pr-12.5">
                Freelance Developer -
            </p>
        </div>
    </div>
</main>