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

    type SectionProgress = { value: number; pct: number }

    function useSectionProgress(
        getEl: () => HTMLElement | undefined,
        offset: [string, string]
    ): SectionProgress {
        const state = $state<SectionProgress>({ value: 0, pct: 0 })
        const { scrollYProgress } = useScroll({ target: getEl, offset })

        useMotionValueEvent(scrollYProgress, 'change', (v: number) => {
            state.value = Math.min(1, Math.max(0, v))
            state.pct = Math.round(state.value * 100)
        })

        return state
    }

    const landing = useSectionProgress(() => landingEl, ['start start', 'end start'])
    const works = useSectionProgress(() => worksEl, ['start start', 'end start'])
    const projects = useSectionProgress(() => projectsEl, ['start start', 'end start'])
    const footer = useSectionProgress(() => footerEl, ['start start', 'end end'])

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

    // Bundle each section's data so the markup can iterate instead of
    // repeating four near-identical blocks.
    const bars = $derived([
        { key: 'landing', height: landingHeight, progress: landing, label: 'landing' },
        { key: 'works', height: worksHeight, progress: works, label: 'works' },
        { key: 'projects', height: projectsHeight, progress: projects, label: 'projects' },
        { key: 'footer', height: footerHeight, progress: footer, label: 'footer' }
    ])

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

{#snippet progressBar(height: number, value: number)}
    <div class="min-w-0" style="flex: {height || 1} 1 0;">
        <div style={trackStyle}>
            <motion.div
                style={fillStyle}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: value }}
                transition={barTransition}
            />
        </div>
    </div>
{/snippet}

<div class="fixed top-6 left-6 right-6 flex items-center gap-6 z-50 pointer-events-none">
    {#each bars as bar (bar.key)}
        {@render progressBar(bar.height, bar.progress.value)}
    {/each}
</div>

<!-- TESTING ONLY: remove before shipping -->
<div class="debug-readout">
    {#each bars as bar (bar.key)}
        <span>{bar.label}: {bar.progress.pct}%</span>
    {/each}
</div>

<style>
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