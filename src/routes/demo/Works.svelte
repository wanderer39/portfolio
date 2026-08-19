<!-- Works.svelte -->
<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section class="w-full h-[300dvh] bg-cyan-700" bind:this={el}>
    <div>
        <h1>works</h1>
    </div>
</section>