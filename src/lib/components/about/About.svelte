<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section bind:this={el} data-theme="light" class="flex h-[150dvh] items-center justify-center bg-(--light-background)!">
    <div>
        <h1 class="text-(--light-text)">About</h1>
    </div>
</section>