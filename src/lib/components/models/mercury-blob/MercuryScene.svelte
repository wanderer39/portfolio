<script lang="ts">
    import { T, useTask, useThrelte } from '@threlte/core';
    import { Color, DoubleSide, MathUtils, Vector3, Vector4, type IUniform } from 'three';

    import type { MercuryOptions } from '$lib/components/models/mercury-blob/blob-types';
    
    import vertexShader from '$lib/components/models/mercury-blob/shaders/mercury.vert?raw';
    import fragmentShader from '$lib/components/models/mercury-blob/shaders/mercury.frag?raw';

    interface Props extends MercuryOptions {
        /** Base sphere scale (still shrinks on portrait screens). */
        scale?: number;
    }

    // Defaults match the look you had hardcoded before.
    let {
        color = 0xf2f4f8,
        swirl = 0,
        flow = 4,
        warp = 0.18,
        freq = [4, 7.5, 9, 2],
        segments = 128,
        scale = 0.6
    }: Props = $props();

    
    const { size } = useThrelte();

    // Plain object (not $state) so Svelte doesn't proxy it; it's mutated every frame.
    // Prop-driven values start neutral and are synced from props just below.
    const uniforms = {
        u_time: { value: 0 },
        u_intensity: { value: 0.01 },
        u_move: { value: 500 },

        // from props
        u_color: { value: new Color() },
        u_swirl: { value: 0 },
        u_flow: { value: 0 },
        u_warp: { value: 0 },
        u_freq: { value: new Vector4() },

        // neutral white lights
        u_keyPos: { value: new Vector3(5, 4, 6) },
        u_keyColor: { value: new Color(0xffffff) },
        u_rimPos: { value: new Vector3(-6, -3, -4) },
        u_rimColor: { value: new Color(0xdfe6f0) }
    } satisfies Record<string, IUniform>;

    $effect.pre(() => {
        uniforms.u_color.value.set(color);
        uniforms.u_swirl.value = swirl;
        uniforms.u_flow.value = flow;
        uniforms.u_warp.value = warp;
        uniforms.u_freq.value.set(freq[0], freq[1], freq[2], freq[3]);
    });

    // Original advanced 0.002 per frame at 60fps; same speed, frame-rate independent.
    const SPEED = 0.002 * 60;
    let time = 0;

    useTask((delta) => {
        time += delta * SPEED;
        uniforms.u_time.value = time;

        // Orbit the key light around the blob
        const a = time * 1.5;
        uniforms.u_keyPos.value.set(Math.cos(a) * 6, 4, Math.sin(a) * 6);
    });

    function onMove(event: PointerEvent) {
        const center = size.current.width / 2;
        let xPos = event.clientX - center;
        xPos = xPos > 0 ? xPos + 200 : xPos - 200;

        uniforms.u_move.value = MathUtils.lerp(uniforms.u_move.value, xPos, 0.1);
    }

    // `scale` prop, shrunk on portrait screens; reacts to resizes.
    const meshScale = $derived.by(() => {
        const { width, height } = size.current;
        return scale * (height ? Math.min(1, width / height) : 1);
    });
</script>

<svelte:window onpointermove={onMove} />

<T.PerspectiveCamera makeDefault position={[0, 0, 2.5]} fov={75} near={0.001} far={5000} />

<T.Mesh scale={meshScale}>
    <T.SphereGeometry args={[1, segments, segments]} />
    <T.ShaderMaterial {uniforms} {vertexShader} {fragmentShader} side={DoubleSide} />
</T.Mesh>