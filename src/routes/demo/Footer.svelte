<!-- Landing.svelte -->
<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section class="w-full h-[200dvh] bg-white" bind:this={el}>
    <div>
        <h1>Footer</h1>
    </div>
</section>