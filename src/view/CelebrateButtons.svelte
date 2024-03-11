<svelte:options accessors={true} />

<script>
  import { CONFETTI_STRENGTH, MODULE_ID } from '../constants';
  import { Confetti } from '../classes/Confetti';
  import { cooldownStore } from '../stores';

  const title = game.i18n.localize(`${MODULE_ID}.buttons.title`);
  const low = game.i18n.localize(`${MODULE_ID}.buttons.intensity.low`);
  const med = game.i18n.localize(`${MODULE_ID}.buttons.intensity.med`);
  const high = game.i18n.localize(`${MODULE_ID}.buttons.intensity.high`);

  let isOnCooldown = false;

  function onClick(strength) {
    const confettiStrength = CONFETTI_STRENGTH[strength];
    const shootConfettiProps = Confetti.getShootConfettiProps(confettiStrength);
    Confetti.instance.shootConfetti(shootConfettiProps);
  }

  cooldownStore.subscribe((value) => {
    isOnCooldown = value;
  });
</script>

<section class="celebrate-buttons flexrow">
  <p>{title}:</p>
  <button on:click={() => onClick('low')} disabled={isOnCooldown} title={low}>
    <i class="fa-solid fa-face-meh" />
  </button>
  <button on:click={() => onClick('med')} disabled={isOnCooldown} title={med}>
    <i class="fa-solid fa-party-bell" />
  </button>
  <button on:click={() => onClick('high')} disabled={isOnCooldown} title={high}>
    <i class="fa-solid fa-party-horn" />
  </button>
</section>

<style lang="scss">
  $c-blaze: #ff6400;
  $c-rainbow-1: red;
  $c-rainbow-2: orange;
  $c-rainbow-3: yellow;
  $c-rainbow-4: green;
  $c-rainbow-5: blue;
  $c-rainbow-6: violet;
  $c-rainbow-7: red;

  .celebrate-buttons {
    flex: 0;
    align-items: center;

    > * {
      margin: 2px;
    }

    p {
      margin-left: 0.4rem;
    }

    button {
      background: transparent;
      border: 1px solid black;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 18px;
      box-shadow: 0 0 6px inset #8d9ea7;
      transition: all ease-in-out 0.25s;
      position: relative;
      padding: 0.2rem 0;

      &:disabled {
        opacity: 50%;

        &:hover {
          color: inherit;
          border-color: black;
          box-shadow: 0 0 6px inset #8d9ea7;
          opacity: 50%;
          animation: none;

          i * {
            fill: white;
          }
        }
      }

      &:hover {
        color: $c-blaze;
        border-color: $c-blaze;
        animation: color-rainbow infinite 1500ms;

        i * {
          fill: $c-blaze;
        }
      }

      i {
        height: 1.2rem;
        width: auto;
        transition: none;

        * {
          fill: #fff;
        }
      }
    }

    @keyframes color-rainbow {
      0% {
        border-color: $c-rainbow-1;
        box-shadow: 0 0 6px inset $c-rainbow-1;
      }
      16% {
        border-color: $c-rainbow-2;
        box-shadow: 0 0 6px inset $c-rainbow-2;
      }
      32% {
        border-color: $c-rainbow-3;
        box-shadow: 0 0 6px inset $c-rainbow-3;
      }
      48% {
        border-color: $c-rainbow-4;
        box-shadow: 0 0 6px inset $c-rainbow-4;
      }
      66% {
        border-color: blue;
        box-shadow: 0 0 6px inset $c-rainbow-5;
      }
      82% {
        border-color: $c-rainbow-6;
        box-shadow: 0 0 6px inset $c-rainbow-6;
      }
      100% {
        border-color: $c-rainbow-7;
        box-shadow: 0 0 6px inset $c-rainbow-7;
      }
    }
  }
</style>
