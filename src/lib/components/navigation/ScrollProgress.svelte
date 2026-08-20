<script lang="ts">
    import { motion, styleString, useScroll, useMotionValueEvent, type MotionTransition } from '@humanspeak/svelte-motion'

    let {
        landingEl,
        projectsEl,
        aboutEl,
        footerEl
    }: {
        landingEl?: HTMLElement
        projectsEl?: HTMLElement
        aboutEl?: HTMLElement
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
    const projects = useSectionProgress(() => projectsEl, ['start start', 'end start'])
    const about = useSectionProgress(() => aboutEl, ['start start', 'end start'])
    const footer = useSectionProgress(() => footerEl, ['start start', 'end end'])

    let landingHeight = $state(0)
    let projectsHeight = $state(0)
    let aboutHeight = $state(0)
    let footerHeight = $state(0)

    function measure() {
        landingHeight = landingEl?.offsetHeight ?? 0
        projectsHeight = projectsEl?.offsetHeight ?? 0
        aboutHeight = aboutEl?.offsetHeight ?? 0
        footerHeight = footerEl?.offsetHeight ?? 0
    }

    $effect(() => {
        measure()
        window.addEventListener('resize', measure)
        return () => window.removeEventListener('resize', measure)
    })

    const bars = $derived([
        { key: 'landing', height: landingHeight * 1.5, progress: landing, label: 'landing' },
        { key: 'projects', height: projectsHeight, progress: projects, label: 'projects' },
        { key: 'about', height: aboutHeight, progress: about, label: 'about' },
        { key: 'footer', height: footerHeight / 2, progress: footer, label: 'footer' }
    ])

    const barTransition: MotionTransition = {
        type: 'tween',
        duration: 0.3,
        ease: 'easeOut'
    }

    // ---- theme tracking (replaces mix-blend-mode) ----
    let wrapperEl: HTMLElement | undefined = $state(undefined)
    let theme = $state<'light' | 'dark'>('light')

    function updateTheme() {
        if (!wrapperEl) return
        const barY = wrapperEl.getBoundingClientRect().top + wrapperEl.offsetHeight / 2
        const sections = [landingEl, projectsEl, aboutEl, footerEl]

        for (const el of sections) {
            if (!el) continue
            const rect = el.getBoundingClientRect()
            if (barY >= rect.top && barY <= rect.bottom) {
                const t = el.dataset.theme as 'light' | 'dark' | undefined
                if (t) theme = t
                return
            }
        }
    }

    $effect(() => {
        let raf = 0
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(updateTheme)
        }
        updateTheme()
        window.addEventListener('scroll', onScroll, { passive: true })
        window.addEventListener('resize', onScroll)
        return () => {
            window.removeEventListener('scroll', onScroll)
            window.removeEventListener('resize', onScroll)
            cancelAnimationFrame(raf)
        }
    })

    const trackStyle = styleString(() => ({
        height: '1px',
        width: '100%',
        background: 'hsl(0, 0%, 70%)',
        overflow: 'hidden'
    }))

    const fillStyle = $derived(
        styleString(() => ({
            height: '100%',
            width: '100%',
            background: theme === 'light' ? 'black' : 'white',
            transformOrigin: 'left',
            transition: 'background-color 0.4s ease'
        }))
    )
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

<div bind:this={wrapperEl} class="fixed top-6 left-6 right-6 flex items-center gap-6 z-50 pointer-events-none">
    {#each bars as bar (bar.key)}
        {@render progressBar(bar.height, bar.progress.value)}
    {/each}
</div>

<!-- TESTING ONLY: remove before shipping -->
<div class="debug-readout fixed bottom-6 right-6 z-50 flex flex-col gap-1 py-2 px-3 border-[#0a0a0a] border
    text-[0.75rem] font-mono text-(--light-text) bg-(--light-primary) pointer-events-none shadow-[4px_4px_0_var(--brut-rule,#d6dedb)]">
    {#each bars as bar (bar.key)}
        <span>{bar.label}: {bar.progress.pct}%</span>
    {/each}
    <span>theme: {theme}</span>
</div>