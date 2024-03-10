import { GsapCompose, easingFunc, gsap } from '#runtime/svelte/gsap';
import { Colord } from '#runtime/color/colord';
import '#runtime/svelte/gsap/plugin/bonus/Physics2DPlugin';
import '#runtime/svelte/gsap/plugin/PixiPlugin';
import '#runtime/svelte/gsap/plugin/bonus/CustomWiggle';
import { CONFETTI_STRENGTH, CONFETTI_STYLES, MODULE_ID, SETTINGS } from '../constants';
import { log, random, getSoundsMap, callback } from '../helpers';
import { cooldownStore } from '../index';

const DECAY = 3;
const SPREAD = 50;
const GRAVITY = 1200;
const RGB_SCALAR = 1 / 255;
const {
  APPEARANCE: {
    CONFETTI_SCALE,
    CONFETTI_STYLE_CHOICE,
    CONFETTI_COLOR_BASE,
    CONFETTI_GLITTER_STRENGTH,
    CONFETTI_TEXTURE
  },
  CONFETTI_MULTIPLIER,
  FIRE_RATE_LIMIT,
  GM_ONLY,
  SHOW_OTHERS_CONFETTI_SCALE,
  SHOW_OTHERS_GLITTER_STRENGTH,
  SOUND_VOLUME
} = SETTINGS;

const randomizeShade = (color, maxDeviation = 50) => {
  const randomDeviation = Math.round(random(0, maxDeviation));
  const scaledRandomDeviation = RGB_SCALAR * randomDeviation;

  if (Math.random() < 0.5) {
    return color.subtract(scaledRandomDeviation);
  } else {
    return color.add(scaledRandomDeviation);
  }
};

const getDrawColor = (time, sprite) => {
  if (sprite.style === CONFETTI_STYLES.glitter.key || sprite.style === CONFETTI_STYLES.baseGlitter.key) {
    const { red, green, blue } = sprite.originalColor;
    const randomShade = randomizeShade(Color.fromRGB([red, green, blue]), sprite.gDeviation);
    return `rgb(${randomShade.r * 255}, ${randomShade.g * 255}, ${randomShade.b * 255})`;
  }

  return sprite.color;
};

export class Confetti {
  static instance;
  isOnCooldown = false;
  ctx;
  textures = {
    circle: null,
    classic: null,
    crescent: null,
    skull: null,
    star: null
  };

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
    this.loadTextures();

    cooldownStore.subscribe((value) => {
      this.isOnCooldown = value;
    });
  }

  get constraints() {
    return {
      width: canvas.app.renderer.width,
      height: canvas.app.renderer.height
    };
  }

  async loadTextures() {
    this.textures.circle = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/circle.png`);
    this.textures.classic = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/classic.png`);
    this.textures.crescent = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/crescent.png`);
    this.textures.skull = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/skull.png`);
    this.textures.star = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/star.png`);
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
        request
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
    return Object.values(getSoundsMap()).map((soundPath) => () => game.audio.preload(soundPath));
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

  /**
   * Adds a given number of confetti particles and kicks off the tweening magic
   *
   * @param {AddConfettiParticleProps} confettiParticleProps An object containing the particle properties
   */
  addConfettiParticles({ amount, angle, velocity, sourceX, sourceY, cColor, cStyle, cScale, cgStrength, texture }) {
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
      let blue, green, red;
      if (style === CONFETTI_STYLES.base.key || style === CONFETTI_STYLES.baseGlitter.key) {
        const randomShade = randomizeShade(confettiColor);
        red = randomShade.r * 255;
        green = randomShade.g * 255;
        blue = randomShade.b * 255;
      } else {
        red = random(50, 255);
        green = random(50, 200);
        blue = random(50, 200);
      }
      const colorHex = new Colord(`rgb(${red}, ${green}, ${blue})`).toHex();

      const rScale = Math.max(random(confettiScale / 2, (confettiScale - 0.4) / 2), 0.1);

      const pixiSprite = new PIXI.Sprite(this.textures[texture]);
      pixiSprite.anchor.set(0.5);
      pixiSprite.angle = angle;
      pixiSprite.x = sourceX;
      pixiSprite.y = sourceY;
      pixiSprite.scale.set(rScale, rScale);
      pixiSprite.tint = `0x${colorHex.replace('#', '')}`;

      // additional
      pixiSprite.velocity = velocity;
      pixiSprite.originalColor = { red: red / 255, green: green / 255, blue: blue / 255 };
      pixiSprite.style = style;
      pixiSprite.gDeviation = gDeviation;

      canvas.overlay.addChild(pixiSprite);

      const id = randomID(); // foundry core

      this.confettiSprites = {
        ...this.confettiSprites,
        [id]: pixiSprite
      };

      log(false, 'addConfettiParticles', {
        pixiSprite,
        confettiSprites: this.confettiSprites
      });

      this.tweenConfettiParticle(id);
      i++;
    }
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
    const { style, scale, color, glitterStr, texture } = options;
    const _style = style ?? game.settings.get(MODULE_ID, CONFETTI_STYLE_CHOICE);
    const _texture = texture ?? game.settings.get(MODULE_ID, CONFETTI_TEXTURE);

    const shootConfettiProps = {
      strength,
      cStyle: _style,
      cScale: scale ?? game.settings.get(MODULE_ID, CONFETTI_SCALE),
      texture: _texture
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
      shootConfettiProps
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
      ticker: canvas.app.ticker.count
    });

    const confettiMultiplier = game.settings.get(MODULE_ID, CONFETTI_MULTIPLIER);
    const volume = game.settings.get(MODULE_ID, SOUND_VOLUME);
    const mute = volume === 0.0;

    if (!mute) {
      game.audio.play(getSoundsMap()[shootConfettiProps.strength], { volume });
    }

    // bottom left
    this.addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -70,
      sourceX: 0,
      sourceY: this.constraints.height,
      ...shootConfettiProps
    });

    // bottom right
    this.addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -110,
      sourceX: this.constraints.width - $('#sidebar').width() * this.dpr,
      sourceY: this.constraints.height,
      ...shootConfettiProps
    });
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
      socketProps
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

    const sprite = this.confettiSprites[spriteId];

    const colorTl = gsap.timeline({ repeat: -1, repeatRefresh: true });
    const skewTl = gsap.timeline({ repeat: -1, repeatRefresh: true });
    colorTl.to(sprite, {
      pixi: {
        colorize: getDrawColor,
        colorizeAmount: 1
      },
      duration: 0.05
    });

    skewTl.to(sprite, {
      pixi: { skewY: 'random([90, 0, 90])' },
      duration: 0.5
    });

    GsapCompose.to(sprite, {
      physics2D: {
        velocity,
        angle,
        gravity,
        friction
      },
      pixi: {
        scale: 0,
        alpha: 0
      },
      ease: easingFunc['power4.in'],
      onComplete: callback((tween) => {
        // remove confetti sprite and id
        canvas.overlay.removeChild(sprite);
        delete this.confettiSprites[spriteId];

        log(false, 'tween complete', {
          spriteId,
          confettiSprites: this.confettiSprites
        });

        if (Object.keys(this.confettiSprites).length === 0) {
          log(false, 'all tweens complete');
        }

        // clean up animations
        tween.kill();
        colorTl.kill();
        skewTl.kill();
      }),
      duration: DECAY
    });
  }
}
