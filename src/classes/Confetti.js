import { get } from 'svelte/store';
import '#runtime/svelte/gsap/plugin/bonus/Physics2DPlugin';
import '#runtime/svelte/gsap/plugin/PixiPlugin';
import '#runtime/svelte/gsap/plugin/bonus/CustomWiggle';
import { CONFETTI_STRENGTH, CONFETTI_STYLES, MODULE_ID, SETTINGS } from '../constants';
import { log, getSoundsMap } from '../helpers';
import { cooldownStore, particleStore } from '../stores';
import { ConfettiParticle } from './ConfettiParticle';

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

    game.audio.pending.push(this._preloadSounds.bind(this));
    this._loadTextures();

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

  /**
   * Load textures for confetti particles
   *
   * @private
   */
  async _loadTextures() {
    this.textures.circle = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/circle.png`);
    this.textures.classic = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/classic.png`);
    this.textures.crescent = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/crescent.png`);
    this.textures.skull = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/skull.png`);
    this.textures.star = await PIXI.Texture.from(`modules/${MODULE_ID}/assets/images/star.png`);
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
   * @private
   * @returns {Array} An array of sound player functions
   */
  _preloadSounds() {
    return Object.values(getSoundsMap()).map((soundPath) => () => game.audio.preload(soundPath));
  }

  /**
   * Adds a given number of confetti particles and kicks off the tweening magic
   *
   * @private
   *
   * @param {AddConfettiParticleProps} confettiParticleProps An object containing the particle properties
   */
  _addConfettiParticles(confettiParticleProps) {
    const {
      amount,
      angle,
      velocity,
      sourceX,
      sourceY,
      cColor,
      cStyle,
      cScale = 1,
      cgStrength = 128,
      texture
    } = confettiParticleProps;
    log(false, 'addConfettiParticles props: ', confettiParticleProps);
    let i = 0;
    const allowSyncScale = game.settings.get(MODULE_ID, SHOW_OTHERS_CONFETTI_SCALE);
    const allowSyncDeviation = game.settings.get(MODULE_ID, SHOW_OTHERS_GLITTER_STRENGTH);
    const confettiScale = allowSyncScale ? cScale : game.settings.get(MODULE_ID, CONFETTI_SCALE);
    const style = cStyle ?? game.settings.get(MODULE_ID, CONFETTI_STYLE_CHOICE);
    const confettiColor = cColor ?? game.settings.get(MODULE_ID, CONFETTI_COLOR_BASE);
    const gDeviation = allowSyncDeviation ? cgStrength : game.settings.get(MODULE_ID, CONFETTI_GLITTER_STRENGTH);

    while (i < amount) {
      const particle = new ConfettiParticle(
        this.textures[texture],
        style,
        confettiColor,
        confettiScale,
        angle,
        sourceX,
        sourceY,
        velocity,
        gDeviation
      );

      particleStore.add(particle);

      log(false, 'addConfettiParticles', {
        pixiSprite: particle,
        confettiSprites: get(particleStore)
      });

      particle.spawnParticle();
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
    this._addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -70,
      sourceX: 0,
      sourceY: this.constraints.height,
      ...shootConfettiProps
    });

    // bottom right
    this._addConfettiParticles({
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
}
