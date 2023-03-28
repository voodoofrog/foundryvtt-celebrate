import { GsapCompose, easingFunc } from '@typhonjs-fvtt/runtime/svelte/gsap';
import '@typhonjs-fvtt/runtime/svelte/gsap/plugin/bonus/Physics2DPlugin';
import { CONFETTI_STRENGTH, CONFETTI_STYLES, MODULE_ID, SETTINGS, SOUNDS, WINDOW_ID } from '../constants';
import { log, random } from '../helpers';
import { cooldownStore } from '../index';

const DECAY = 3;
const SPREAD = 50;
const GRAVITY = 1200;
const RGB_SCALAR = 1 / 255;
const {
  APPEARANCE: { CONFETTI_SCALE, CONFETTI_STYLE_CHOICE, CONFETTI_COLOR_BASE, CONFETTI_GLITTER_STRENGTH },
  CONFETTI_MULTIPLIER,
  FIRE_RATE_LIMIT,
  GM_ONLY,
  SHOW_OTHERS_CONFETTI_SCALE,
  SHOW_OTHERS_GLITTER_STRENGTH,
  SOUND_VOLUME,
} = SETTINGS;

/**
 * Stolen right from Dice so Nice and butchered
 * https://gitlab.com/riccisi/foundryvtt-dice-so-nice/-/blob/master/module/main.js
 * Main class to handle ~~3D Dice~~ Confetti animations.
 */
export class Confetti {
  static instance;
  isOnCooldown = false;
  ctx;

  /**
   * Create and initialize a new Confetti.
   */
  constructor() {
    if (Confetti.instance) {
      throw new Error("Singleton classes can't be instantiated more than once.");
    }

    Confetti.instance = this;
    this.dpr = canvas.app.renderer.resolution ?? window.devicePixelRatio ?? 1;

    this._initListeners();
    this.confettiSprites = {};

    game.audio.pending.push(this._preloadSounds.bind(this));

    cooldownStore.subscribe((value) => {
      this.isOnCooldown = value;
    });

    // TODO: The old api for backwards compatibily - to be removed
    window[WINDOW_ID] = {
      confettiStrength: CONFETTI_STRENGTH,
      getShootConfettiProps: Confetti.getShootConfettiProps,
      handleShootConfetti: this.handleShootConfetti.bind(this),
      shootConfetti: this.shootConfetti.bind(this),
    };
    Hooks.call(`${WINDOW_ID}Ready`, this);
  }

  get constraints() {
    return {
      width: this.ctx.canvas.width,
      height: this.ctx.canvas.height,
    };
  }

  /**
   * Set the canvas element for confetti.
   *
   * @param {Element} canvasElement The canvas element to attach to
   */
  setCanvasElement(canvasElement) {
    this.ctx = canvasElement.getContext('2d');
  }

  /**
   * Init listeners on windows resize and socket.
   *
   * @private
   */
  _initListeners() {
    game.socket.on(`module.${MODULE_ID}`, (request) => {
      log(false, 'got socket connection', {
        request,
      });
      this.handleShootConfetti(request.data);
    });
  }

  /**
   * Preload sounds so they're ready to play
   *
   * @returns {Array} An array of sound player functions
   */
  _preloadSounds() {
    return Object.values(SOUNDS).map((soundPath) => () => game.audio.preload(soundPath));
  }

  /**
   * Callback for `resizeObserver` on canvas to set the canvas size.
   *
   * @param {number} width The width to set
   *
   * @param {number} height The height to set
   */
  onCanvasResize(width, height) {
    log(false, `onCanvasResize - width: ${width}; height: ${height}`);

    const w = width * this.dpr;
    const h = height * this.dpr;

    this.ctx.canvas.width = w;
    this.ctx.canvas.height = h;
  }

  _randomizeShade(color, maxDeviation = 50) {
    const randomDeviation = Math.round(random(0, maxDeviation));
    const scaledRandomDeviation = RGB_SCALAR * randomDeviation;

    if (Math.random() < 0.5) {
      return color.subtract(scaledRandomDeviation);
    } else {
      return color.add(scaledRandomDeviation);
    }
  }

  _getDrawColor(sprite) {
    if (sprite.style === CONFETTI_STYLES.glitter.key || sprite.style === CONFETTI_STYLES.baseGlitter.key) {
      const { red, green, blue } = sprite.originalColor;
      const randomShade = this._randomizeShade(Color.fromRGB([red, green, blue]), sprite.gDeviation);
      return `rgb(${randomShade.r * 255}, ${randomShade.g * 255}, ${randomShade.b * 255})`;
    }

    return sprite.color;
  }

  /**
   * Adds a given number of confetti particles and kicks off the tweening magic
   *
   * @param {AddConfettiParticleProps} confettiParticleProps An object containing the particle properties
   */
  addConfettiParticles({ amount, angle, velocity, sourceX, sourceY, cColor, cStyle, cScale, cgStrength }) {
    log(false, {});
    let i = 0;
    const allowSyncScale = game.settings.get(MODULE_ID, SHOW_OTHERS_CONFETTI_SCALE);
    const allowSyncDeviation = game.settings.get(MODULE_ID, SHOW_OTHERS_GLITTER_STRENGTH);
    const confettiScale = allowSyncScale && cScale ? cScale : game.settings.get(MODULE_ID, CONFETTI_SCALE);
    const style = cStyle ?? game.settings.get(MODULE_ID, CONFETTI_STYLE_CHOICE);
    const confettiColor = Color.from(cColor ?? game.settings.get(MODULE_ID, CONFETTI_COLOR_BASE));
    const gDeviation =
      allowSyncDeviation && cgStrength ? cgStrength : game.settings.get(MODULE_ID, CONFETTI_GLITTER_STRENGTH);

    while (i < amount) {
      // sprite
      const r = random(4, 6) * this.dpr * confettiScale;
      const d = random(15, 25) * this.dpr * confettiScale;

      let blue, green, red;
      if (style === CONFETTI_STYLES.base.key || style === CONFETTI_STYLES.baseGlitter.key) {
        const randomShade = this._randomizeShade(confettiColor);
        red = randomShade.r * 255;
        green = randomShade.g * 255;
        blue = randomShade.b * 255;
      } else {
        red = random(50, 255);
        green = random(50, 200);
        blue = random(50, 200);
      }
      const color = `rgb(${red}, ${green}, ${blue})`;

      const tilt = random(10, -10);
      const tiltAngleIncremental = random(0.07, 0.05);
      const tiltAngle = 0;

      const id = randomID(); // foundry core
      const sprite = {
        angle,
        velocity,
        x: sourceX,
        y: sourceY,
        r,
        d,
        color,
        tilt,
        tiltAngleIncremental,
        tiltAngle,
        originalColor: { red: red / 255, green: green / 255, blue: blue / 255 },
        style,
        gDeviation,
      };

      this.confettiSprites = {
        ...this.confettiSprites,
        [id]: sprite,
      };

      log(false, 'addConfettiParticles', {
        sprite,
        confettiSprites: this.confettiSprites,
      });

      this.tweenConfettiParticle(id);
      i++;
    }
  }

  /**
   * Clear the confettiCanvas
   */
  clearConfetti() {
    log(false, 'clearConfetti');
    this.ctx.clearRect(0, 0, this.constraints.width, this.constraints.height);
  }

  /**
   * Draw a frame of the animation.
   */
  drawConfetti() {
    log(false, 'drawConfetti');

    // map over the confetti sprites
    Object.keys(this.confettiSprites).map((spriteId) => {
      const sprite = this.confettiSprites[spriteId];

      this.ctx.beginPath();
      this.ctx.lineWidth = sprite.d / 2;

      this.ctx.strokeStyle = this._getDrawColor(sprite);
      this.ctx.moveTo(sprite.x + sprite.tilt + sprite.r, sprite.y);
      this.ctx.lineTo(sprite.x + sprite.tilt, sprite.y + sprite.tilt + sprite.r);
      this.ctx.stroke();

      this.updateConfettiParticle(spriteId);
    });
  }

  /**
   * Get ShootConfettiProps from strength
   *
   * @param {(0|1|2)} strength The input strength
   *
   * @param {object} [options={}] Optional parameters object
   *
   * @param {string} [options.style] The confetti style
   *
   * @param {number} [options.scale] The confetti scale
   *
   * @param {string} [options.color] Colour hex string
   *
   * @param {number} [options.glitterStr] Glitter strength
   *
   * @returns {object} The props
   */
  static getShootConfettiProps(strength, options = {}) {
    const { style, scale, color, glitterStr } = options;
    const _style = style ?? game.settings.get(MODULE_ID, CONFETTI_STYLE_CHOICE);

    const shootConfettiProps = {
      strength,
      cStyle: _style,
      cScale: scale ?? game.settings.get(MODULE_ID, CONFETTI_SCALE),
    };

    if (_style === CONFETTI_STYLES.base.key || _style === CONFETTI_STYLES.baseGlitter.key) {
      shootConfettiProps.cColor = color ?? game.settings.get(MODULE_ID, CONFETTI_COLOR_BASE);
    }

    if (_style === CONFETTI_STYLES.glitter.key || _style === CONFETTI_STYLES.baseGlitter.key) {
      shootConfettiProps.cgStrength = glitterStr ?? game.settings.get(MODULE_ID, CONFETTI_GLITTER_STRENGTH);
    }

    switch (strength) {
      case CONFETTI_STRENGTH.high:
        shootConfettiProps.amount = 200;
        shootConfettiProps.velocity = 3000;
        break;
      case CONFETTI_STRENGTH.low:
        shootConfettiProps.amount = 50;
        shootConfettiProps.velocity = 1000;
        break;
      default:
        shootConfettiProps.amount = 100;
        shootConfettiProps.velocity = 2000;
    }

    log(false, 'getShootConfettiProps returned', {
      strength,
      shootConfettiProps,
    });

    return shootConfettiProps;
  }

  /**
   * Fires Confetti on the Local instance of Confetti
   *
   * @param {ShootConfettiProps} shootConfettiProps The confetti props
   */
  handleShootConfetti({ amount, ...shootConfettiProps }) {
    log(false, 'handleShootConfetti', {
      shootConfettiProps,
      ticker: canvas.app.ticker.count,
    });

    const confettiMultiplier = game.settings.get(MODULE_ID, CONFETTI_MULTIPLIER);
    const volume = game.settings.get(MODULE_ID, SOUND_VOLUME);
    const mute = volume === 0.0;

    canvas.app.ticker.add(this.render, this);

    if (!mute) {
      game.audio.play(SOUNDS[shootConfettiProps.strength], { volume });
    }

    // bottom left
    this.addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -70,
      sourceX: 0,
      sourceY: this.constraints.height,
      ...shootConfettiProps,
    });

    // bottom right
    this.addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -110,
      sourceX: this.constraints.width - $('#sidebar').width() * this.dpr,
      sourceY: this.constraints.height,
      ...shootConfettiProps,
    });
  }

  /**
   * Clear the old frame and render a new one.
   */
  render() {
    log(false, 'render', {
      ctx: this.ctx,
    });

    // first clear the board
    this.clearConfetti();

    // draw the sprites
    this.drawConfetti();
  }

  /**
   * Emit a socket message to all users with the ShootConfettiProps
   * Also fire confetti on this screen
   *
   * @param {ShootConfettiProps} shootConfettiProps The confetti props
   */
  shootConfetti(shootConfettiProps) {
    const socketProps = { data: shootConfettiProps };
    const rapidFireLimit = game.settings.get(MODULE_ID, FIRE_RATE_LIMIT);
    const gmOnly = game.settings.get(MODULE_ID, GM_ONLY);

    if (this.isOnCooldown) {
      log(false, 'shootConfetti prevented by rapid fire setting');
      return;
    } else if (gmOnly && !game.user.isGM) {
      log(false, 'shootConfetti prevented by gm only setting');
      ui.notifications.warn(game.i18n.localize(`${MODULE_ID}.gmWarning`));
      return;
    } else {
      cooldownStore.set(true);
      setTimeout(() => cooldownStore.set(false), rapidFireLimit * 1000, this);
    }

    log(false, 'shootConfetti, emitting socket', {
      shootConfettiProps,
      socketProps,
    });

    this.handleShootConfetti(socketProps.data);

    game.socket.emit(`module.${MODULE_ID}`, socketProps);
  }

  /**
   * GSAP Magic. Does things involving gravity, velocity, and other forces a mere
   * mortal cannot hope to understand.
   * Taken pretty directly from: https://codepen.io/elifitch/pen/apxxVL
   *
   * @param {string} spriteId The sprite ID
   */
  tweenConfettiParticle(spriteId) {
    const minAngle = this.confettiSprites[spriteId].angle - SPREAD / 2;
    const maxAngle = this.confettiSprites[spriteId].angle + SPREAD / 2;

    const minVelocity = this.confettiSprites[spriteId].velocity / 4;
    const maxVelocity = this.confettiSprites[spriteId].velocity;

    // Physics Props
    const velocity = random(minVelocity, maxVelocity);
    const angle = random(minAngle, maxAngle);
    const gravity = GRAVITY;
    const friction = random(0.01, 0.05);
    const d = 0;

    GsapCompose.to(this.confettiSprites[spriteId], {
      physics2D: {
        velocity,
        angle,
        gravity,
        friction,
      },
      d,
      ease: easingFunc['power4.in'],
      onComplete: () => {
        // remove confetti sprite and id
        delete this.confettiSprites[spriteId];

        log(false, 'tween complete', {
          spriteId,
          confettiSprites: this.confettiSprites,
        });

        if (Object.keys(this.confettiSprites).length === 0) {
          log(false, 'all tweens complete');
          this.clearConfetti();
          canvas.app.ticker.remove(this.render, this);
        }
      },
      duration: DECAY,
    });
  }

  /**
   * Randomize a given sprite for the next frame
   *
   * @param {string} spriteId The sprite ID
   */
  updateConfettiParticle(spriteId) {
    const sprite = this.confettiSprites[spriteId];

    const tiltAngle = 0.0005 * sprite.d;

    sprite.angle += 0.01;
    sprite.tiltAngle += tiltAngle;
    sprite.tiltAngle += sprite.tiltAngleIncremental;
    sprite.tilt = Math.sin(sprite.tiltAngle - sprite.r / 2) * sprite.r * 2;
    sprite.y += Math.sin(sprite.angle + sprite.r / 2) * 2;
    sprite.x += Math.cos(sprite.angle) / 2;
  }
}
