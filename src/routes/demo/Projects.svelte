<!-- Projects.svelte -->
<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section class="w-full h-[200dvh] bg-amber-800" bind:this={el}>
    <div>
        <h1>projects</h1>
    </div>
</section>