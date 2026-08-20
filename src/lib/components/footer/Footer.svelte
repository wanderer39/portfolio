<script lang="ts">
    let { el = $bindable() }: { el?: HTMLElement } = $props()
</script>

<section bind:this={el} data-theme="dark" class="w-full h-[300dvh]">
    <div>
        <h1>Footer</h1>
    </div>
</section>