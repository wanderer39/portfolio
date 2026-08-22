<script lang="ts">
	let { active = false }: { active?: boolean; } = $props();

	let visualState: 'initial' | 'origin' | 'final' = $state('initial');
	let svgEl: SVGSVGElement;

	function restartTransition(next: 'origin' | 'final') {
		// Force a synchronous reflow so the browser "forgets" any in-flight
		// transition before we apply the new class — this is what lets the
		// animation restart cleanly on a fast re-hover instead of resuming
		// mid-flight.
		visualState = 'initial';
		if (svgEl) svgEl.getBoundingClientRect(); // force reflow
		visualState = next;
	}

	$effect(() => {
		if (active) {
			restartTransition('origin');
		} else {
			restartTransition('final');
		}
	});

	function handleTransitionEnd(event: TransitionEvent) {
		if (event.propertyName === 'transform' && visualState === 'final' && !active) {
			visualState = 'initial';
		}
	}
</script>

<div class="arrow-icon-wrapper" class:active>
	<div class="arrow-icon-clip">
		<svg
			bind:this={svgEl}
			class={[
				'arrow-icon',
				{
					'arrow-icon-initial': visualState === 'initial',
					'arrow-icon-origin': visualState === 'origin',
					'arrow-icon-final': visualState === 'final'
				}
			]}
			ontransitionend={handleTransitionEnd}
			viewBox="0 0 256 256"
			fill="currentColor"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M200,64V168a8,8,0,0,1-16,0V83.314L69.65674,197.65723a8.00018,8.00018,0,0,1-11.31348-11.31446L172.686,72H88a8,8,0,0,1,0-16H192A8.00039,8.00039,0,0,1,200,64Z"
			/>
		</svg>
	</div>
</div>

<style>
	.arrow-icon-wrapper {
		position: relative;
		left: -2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		flex: 0 0 auto;
		transform: scale(0);
		transition: transform 0.35s cubic-bezier(0.5, 1, 0.89, 1);
		overflow: hidden;
	}

	.arrow-icon-wrapper::before {
		content: '';
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: var(--dark-text);
		pointer-events: none;
	}

	.arrow-icon-wrapper.active {
		transform: scale(1);
	}

	.arrow-icon-clip {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 50%;
	}

	.arrow-icon {
		position: relative;
		z-index: 1;
		width: 1.3rem;
		height: 1.3rem;
		flex: 0 0 auto;
		color: var(--light-primary);
		mix-blend-mode: difference;
		transition: transform 0.4s cubic-bezier(0.5, 1, 0.89, 1);
	}

	.arrow-icon-initial {
		transform: translate(-150%, 150%);
		transition: none;
	}

	.arrow-icon-origin {
		transform: translate(0);
		transition: transform 0.4s ease 0.1s;
	}

	.arrow-icon-final {
		transform: translate(150%, -150%);
	}
</style>