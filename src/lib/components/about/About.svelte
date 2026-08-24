<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section bind:this={el} class="flex h-[200dvh] items-center justify-center">
    <div>
        <h1 class="text-(--light-text)">About</h1>
    </div>
</section>