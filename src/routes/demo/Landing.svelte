<!-- Landing.svelte -->
<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section class="w-full h-dvh bg-white" bind:this={el}>
    <div>
        <h1>Landing</h1>
    </div>
</section>