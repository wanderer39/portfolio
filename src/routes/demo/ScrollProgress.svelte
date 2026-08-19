<script lang="ts">
    import { motion, styleString, useScroll, useMotionValueEvent, type MotionTransition } from '@humanspeak/svelte-motion'

    let {
        landingEl,
        worksEl,
        projectsEl,
        footerEl
    }: {
        landingEl?: HTMLElement
        worksEl?: HTMLElement
        projectsEl?: HTMLElement
        footerEl?: HTMLElement
    } = $props()

    let landingHeight = $state(0)
    let worksHeight = $state(0)
    let projectsHeight = $state(0)
    let footerHeight = $state(0)

    function measure() {
        landingHeight = landingEl?.offsetHeight ?? 0
        worksHeight = worksEl?.offsetHeight ?? 0
        projectsHeight = projectsEl?.offsetHeight ?? 0
        footerHeight = footerEl?.offsetHeight ?? 0
    }

    $effect(() => {
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    })

    // Landing, Works, Projects are all followed by more content, so
    // 'end start' (bottom fully exits past the viewport top) has room
    // to complete. Footer is now the LAST section — the page can't
    // scroll far enough for its bottom to reach the viewport top, so
    // it needs 'end end' instead (bottom meets viewport bottom, which
    // lands exactly at the page's natural max scroll).
    const { scrollYProgress: landingProgress } = useScroll({
        target: () => landingEl,
        offset: ['start start', 'end start']
    })
    const { scrollYProgress: worksProgress } = useScroll({
        target: () => worksEl,
        offset: ['start start', 'end start']
    })
    const { scrollYProgress: projectsProgress } = useScroll({
        target: () => projectsEl,
        offset: ['start start', 'end start']
    })
    const { scrollYProgress: footerProgress } = useScroll({
        target: () => footerEl,
        offset: ['start start', 'end end']
    })

    // Raw 0-1 values, clamped, kept in $state so they drive both the
    // bar animation and the debug readout. No spring — motion.div's
    // own tween transition handles the easing/smoothing instead.
    let landingValue = $state(0)
    let worksValue = $state(0)
    let projectsValue = $state(0)
    let footerValue = $state(0)

    let landingPct = $state(0)
    let worksPct = $state(0)
    let projectsPct = $state(0)
    let footerPct = $state(0)

    useMotionValueEvent(landingProgress, 'change', (v: number) => {
        landingValue = Math.min(1, Math.max(0, v))
        landingPct = Math.round(landingValue * 100)
    })
    useMotionValueEvent(worksProgress, 'change', (v: number) => {
        worksValue = Math.min(1, Math.max(0, v))
        worksPct = Math.round(worksValue * 100)
    })
    useMotionValueEvent(projectsProgress, 'change', (v: number) => {
        projectsValue = Math.min(1, Math.max(0, v))
        projectsPct = Math.round(projectsValue * 100)
    })
    useMotionValueEvent(footerProgress, 'change', (v: number) => {
        footerValue = Math.min(1, Math.max(0, v))
        footerPct = Math.round(footerValue * 100)
    })

    // Smooth, non-spring transition: a plain eased tween applied to
    // scaleX on every value change.
    const barTransition: MotionTransition = {
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut'
    }

    const trackStyle = styleString(() => ({
        height: '6px',
        width: '100%',
        border: '1px solid var(--brut-ink, #0a0a0a)',
        background: 'var(--brut-bg-2, #eef4f1)',
        overflow: 'hidden'
    }))

    const fillStyle = styleString(() => ({
        height: '100%',
        width: '100%',
        background: 'var(--brut-accent, #247768)',
        transformOrigin: 'left'
    }))
</script>

<div class="progress-strip">
    <div class="bar-wrapper" style="flex: {landingHeight || 1} 1 0;">
        <div style={trackStyle}>
            <motion.div
                style={fillStyle}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: landingValue }}
                transition={barTransition}
            />
        </div>
    </div>
    <div class="bar-wrapper" style="flex: {worksHeight || 1} 1 0;">
        <div style={trackStyle}>
            <motion.div
                style={fillStyle}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: worksValue }}
                transition={barTransition}
            />
        </div>
    </div>
    <div class="bar-wrapper" style="flex: {projectsHeight || 1} 1 0;">
        <div style={trackStyle}>
            <motion.div
                style={fillStyle}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: projectsValue }}
                transition={barTransition}
            />
        </div>
    </div>
    <div class="bar-wrapper" style="flex: {footerHeight || 1} 1 0;">
        <div style={trackStyle}>
            <motion.div
                style={fillStyle}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: footerValue }}
                transition={barTransition}
            />
        </div>
    </div>
</div>

<!-- TESTING ONLY: remove before shipping -->
<div class="debug-readout">
    <span>landing: {landingPct}%</span>
    <span>works: {worksPct}%</span>
    <span>projects: {projectsPct}%</span>
    <span>footer: {footerPct}%</span>
</div>

<style>
    .progress-strip {
        position: fixed;
        top: 1.5rem;
        left: 1.5rem;
        right: 1.5rem;
        display: flex;
        align-items: center;
        gap: 1.5rem;
        z-index: 50;
        pointer-events: none;
    }
    .bar-wrapper {
        min-width: 0;
    }

    .debug-readout {
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 0.5rem 0.75rem;
        font-family: var(--brut-mono, monospace);
        font-size: 0.75rem;
        color: var(--brut-ink, #0a0a0a);
        background: var(--brut-bg, #f8fcfb);
        border: 1px solid var(--brut-ink, #0a0a0a);
        box-shadow: 4px 4px 0 var(--brut-rule, #d6dedb);
        pointer-events: none;
    }
</style>