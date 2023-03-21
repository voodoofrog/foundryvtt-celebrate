<svelte:options accessors={true} />

<script>
  import { ConfettiStrength, MODULE_ABBREV } from '../constants';
  import { Confetti } from '../classes/Confetti';
  import { cooldownStore } from '../index';

  const title = game.i18n.localize(`${MODULE_ABBREV}.title`);
  const low = game.i18n.localize(`${MODULE_ABBREV}.intensity.low`);
  const med = game.i18n.localize(`${MODULE_ABBREV}.intensity.med`);
  const high = game.i18n.localize(`${MODULE_ABBREV}.intensity.high`);

  function onClick(strength) {
    const confettiStrength = ConfettiStrength[strength];
    const shootConfettiProps = Confetti.getShootConfettiProps(confettiStrength);
    Confetti.instance.shootConfetti(shootConfettiProps);
  }

  let isOnCooldown = false;

  cooldownStore.subscribe((value) => {
    isOnCooldown = value;
  });
</script>

<svelte:window />

<div class="celebrate-buttons flexrow">
  <p>{title}:</p>
  <button type="button" on:click={() => onClick('low')} disabled={isOnCooldown} title={low}>
    <svg class="confetti-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g class="" transform="translate(0,0)">
        <path
          d="M254.1 18.63c-81.4 0-231.43 155.97-171.63 300.77 8 25.3 27.83 50.4 49.13 77.1 24.4 30.6 51.6 63.2 68.7 96.9h20.5c-18.1-39.8-48.5-75.9-74.6-108.6-27.4-34.3-48.73-65.2-48.73-87.9.1-9.1 2.23-18.1 5.53-26.3 23-61.4 114-119.7 148.5-135l3.6-2 3.9 1.3c60.9 20.9 129.3 66.7 154 135.7 4.1 11.7 5.9 18 5.6 27.3-.5 15.8-24.5 54.7-55 88.7-29.1 32.4-62.4 67.7-80 106.7h20.5c16.8-32.2 46.2-64 73.3-94.2 23.2-25.6 45.3-50 54.9-74.8 52.9-124-99.2-305.67-178.2-305.67zm.8 135.47c-38.7 21.5-85.1 52.2-113.7 88.2 9.7 83 59 146.1 118.3 146.1 59.2 0 108.3-62.7 118.2-145.3-28.9-42.1-78-72.9-122.8-89zm-58.3 83h2.4c13.1.1 26.1 2.7 39.1 7.4-16.8 40.6-59 42-78.1 0 12.2-4.8 24.4-7.2 36.6-7.4zm124.9 0c13-.1 26 2.3 39.1 7.4-19.2 42-61.3 40.6-78.2 0 13.1-4.7 26.1-7.3 39.1-7.4z"
        />
      </g>
    </svg>
  </button>
  <button type="button" on:click={() => onClick('med')} disabled={isOnCooldown} title={med}>
    <svg class="confetti-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g class="" transform="translate(0,0)">
        <path
          d="M233 25.93L153.2 220.3l25.3 4.6 25.2-23.9 4.6 34.5 30.5 16.6-31.3 15-6.3 34.1-24-25.1-34.4 4.5 16.5-30.6-9.8-20.6-62.33 151.7c-2.47 12.6.28 22 7.44 30.9 7.29 9 19.69 17 35.89 23.2 7.2 2.8 15 5.2 23.4 7.2l3.1-9.9-24.4-32.6 40.7-.6 23.5-33.2 13.2 38.5 38.9 12.1-32.7 24.4.1 10.1c13.2.8 26.7 1 40.2.6 46.6-1.3 93.1-9.2 124.6-21.6 15.8-6.2 27.7-13.6 33.9-20.7 6.2-7.1 7.6-12.5 4.5-20.5L301.3 158.8l-4.5-.2-21.8 27-9.1-33.5-32.5-12.4 29.1-19 1.7-34.09L233 25.93zm74.7 247.97l25.5 31.8 40.7-1.8-22.4 34 14.3 38.1-39.3-10.7-31.8 25.4-1.9-40.7-34-22.4 38.1-14.4 10.8-39.3zm129 133.6c-1.8 5-4.5 9.7-8.1 13.8-1.9 2.2-4.1 4.3-6.5 6.3.3 4.5-.1 8.5-1.1 12-2.7 10.2-9.7 17.5-21.8 23.1-24.2 11.2-67.6 12.5-114 5.9-.5-.1-1-.2-1.5-.2-8.8.7-17.8 1.1-26.7 1.4-19.5.5-39.1 0-57.9-1.8 27 8 55.7 14.4 83.6 18.4 48.1 6.8 93.4 6.9 124.1-7.4 15.4-7.1 27.3-18.7 31.6-34.7 2.9-10.9 2.3-23.1-1.7-36.8z"
        />
      </g>
    </svg>
  </button>
  <button type="button" on:click={() => onClick('high')} disabled={isOnCooldown} title={high}>
    <svg class="confetti-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
      <g class="" transform="translate(0,0)">
        <path
          d="M122.7 23.32l1.7 21.87-16.7 14.25 21.4 5.17 8.4 20.25L149 66.18l21.8-1.75-14.2-16.71 5.1-21.32-20.3 8.35-18.7-11.43zM464 32a16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 16-16 16 16 0 0 0-16-16zM239.8 42.5a16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 16-16 16 16 0 0 0-16-16zm183.9 6.84c-9.2 1.74-17.7 7.18-25.9 14.28-7.6 6.53-14.7 14.66-20.7 23.45-18.8 3.01-37.6 10.67-50.2 21.13-16.1 13.2-30.4 35.8-38.2 59.1-7.4 3.1-14.4 6.8-20.1 10.8-15.5 10.9-23.5 31.8-29.4 50-5.9 18.3-8.8 34.3-8.8 34.3l17.8 3.2s2.7-15 8.1-31.9c5.5-16.9 14.8-35.3 22.7-40.8 1.3-.9 3-1.9 4.5-2.8-.6 5.7-.6 11.4.3 16.8 1.8 11.4 8 22.3 19 28.2 7.8 4.2 16.6 3.2 24 .2 7.4-3.1 14-8.2 19.7-14.2 5.7-6 10.4-13.1 13.2-20.6 2.8-7.5 3.8-16 .2-23.9h-.1c-3.9-8.4-11.4-13.8-19.4-16.1-8-2.3-16.6-2.2-25.2-.9-1.5.2-2.9.7-4.4 1 7.4-15.8 18-30.7 27.5-38.6 6.2-5.1 16.6-10 27.7-13.6-1.4 3.8-2.5 7.6-3 11.5-1.6 10.5.7 21.9 9.1 29.7 6.1 5.6 14.3 6.5 21.5 5.3 7.1-1.2 14-4.4 20.2-8.5 6.2-4.2 11.7-9.4 15.6-15.5 3.9-6.1 6.5-13.9 4-21.7v-.1c-3.3-10.07-11.5-16.99-20.6-20.27-3.9-1.4-8-2.19-12.2-2.66 2.9-3.26 5.9-6.31 8.9-8.92 6.8-5.84 13.7-9.5 17.6-10.23l-3.4-17.68zM174.8 84.39l-15.2 9.56 34.5 55.25-56.4 2.9 26.5 57.8 16.4-7.6-15.5-33.6 60.6-3.1-50.9-81.21zm216.4 19.31c6.1-.1 11.5.6 15.5 2.1 5.4 1.9 8.1 4.3 9.5 8.8.4 1.1.2 3.3-1.9 6.6-2.2 3.4-6.1 7.2-10.5 10.2-4.5 3-9.5 5.1-13.2 5.7-3.8.7-5.5 0-6.3-.7-3.5-3.2-4.5-7.2-3.5-13.9.8-5.4 3.3-11.9 7-18.6 1.2 0 2.3-.2 3.4-.2zM94.99 123a16 16 0 0 0-16 16 16 16 0 0 0 16 16A16 16 0 0 0 111 139a16 16 0 0 0-16.01-16zm356.11 37.2l-14.4 16.6-21.8-1.8 11.4 18.8-8.5 20.2 21.4-5 16.6 14.3 1.9-21.9 18.7-11.4-20.2-8.5-5.1-21.3zm-123.5 16.5c2.9.1 5.6.5 7.7 1.1 4.3 1.2 6.6 3 8.2 6.4.9 1.9 1 5.4-.7 10-1.7 4.7-5.2 10.1-9.4 14.6s-9.3 8.1-13.5 9.8c-4.2 1.7-6.8 1.6-8.5.7h-.1c-5.8-3.2-8.6-7.8-9.7-15.2-1-6.3-.3-14.3 1.8-22.9 4.9-1.7 9.8-3.1 14.5-3.8 3.5-.5 6.7-.7 9.7-.7zm-202.4 51.9c-7.2-.2-11.7 1.5-14.5 4.3-2.8 2.8-4.5 7.3-4.3 14.5.2 7.3 2.6 16.9 7.2 27.6 9.2 21.5 27.3 47.4 51.6 71.8 24.3 24.3 50.3 42.3 71.8 51.5 10.6 4.6 20.2 7 27.5 7.2 7.3.3 11.7-1.5 14.5-4.3 2.8-2.8 4.6-7.2 4.3-14.5-.2-7.3-2.6-16.9-7.2-27.6-9.2-21.4-27.2-47.4-51.5-71.7-24.3-24.4-50.3-42.4-71.8-51.6-10.7-4.6-20.3-7-27.6-7.2zm232 31.3l-33 54-29.1-27.9-12.4 13 45.1 43.3 33.8-55.2 38.7 32.3 89.3-38.2-7-16.6-79.3 34-46.1-38.7zM93.43 272.6l-17.64 57.9c41.41 49.1 89.71 76.7 142.11 94.7l21.6-6.6c-3.1-1.1-6.4-2.4-9.7-3.8-24.4-10.4-51.7-29.6-77.3-55.3-25.7-25.7-44.9-53-55.34-77.4-1.41-3.2-2.65-6.4-3.73-9.5zm-23.82 78.2l-14.01 46c28.89 27 59 39.2 90.6 50.2l43.4-13.2c-43.2-17.6-84-43.3-119.99-83zM368 352a16 16 0 0 0-16 16 16 16 0 0 0 16 16 16 16 0 0 0 16-16 16 16 0 0 0-16-16zM49.81 415.9l-20.29 66.6 88.28-26.9c-22.77-9.1-45.78-20.7-67.99-39.7z"
        />
      </g>
    </svg>
  </button>
</div>

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

          svg * {
            fill: white;
          }
        }
      }

      &:hover {
        color: $c-blaze;
        border-color: $c-blaze;
        animation: color-rainbow infinite 1500ms;

        svg * {
          fill: $c-blaze;
        }
      }

      svg {
        height: 1.2rem;
        width: auto;
        transition: all ease-in-out 0.25s;

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
