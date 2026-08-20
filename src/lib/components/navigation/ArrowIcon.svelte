<script lang="ts">
	let {
		position = $bindable('initial'),
		active = false
	}: {
		/** Slide-in/slide-out phase of the arrow glyph itself */
		position?: 'initial' | 'origin' | 'final';
		/** Whether the circular wrapper should be scaled in (i.e. parent link is hovered) */
		active?: boolean;
	} = $props();

	function handleTransitionEnd(event: TransitionEvent) {
		if (event.propertyName === 'transform' && position === 'final') {
			position = 'initial';
		}
	}
</script>

<div class="arrow-icon-wrapper" class:active>
	<div class="arrow-icon-clip">
		<svg
			class={[
				'arrow-icon',
				{
					'arrow-icon-initial': position === 'initial',
					'arrow-icon-origin': position === 'origin',
					'arrow-icon-final': position === 'final'
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
	}

	.arrow-icon-origin {
		transform: translate(0);
		transition: transform 0.4s ease 0.1s;
	}

	.arrow-icon-final {
		transform: translate(150%, -150%);
	}
</style>