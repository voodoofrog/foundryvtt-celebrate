import { GsapCompose, easingFunc } from '@typhonjs-fvtt/runtime/svelte/gsap';
import '@typhonjs-fvtt/runtime/svelte/gsap/plugin/bonus/Physics2DPlugin';
import { ConfettiStrength, MODULE_ABBREV, MODULE_ID, MySettings, SOUNDS, WINDOW_ID } from '../constants';
import { log, random } from '../helpers';
import { cooldownStore } from '../index';

const DECAY = 3;
const SPREAD = 50;
const GRAVITY = 1200;
const RGB_SCALAR = 1 / 255;

/**
 * Stolen right from Dice so Nice and butchered
 * https://gitlab.com/riccisi/foundryvtt-dice-so-nice/-/blob/master/module/main.js
 * Main class to handle ~~3D Dice~~ Confetti animations.
 */
export class Confetti {
  static instance;
  isOnCooldown = false;

  /**
   * Create and initialize a new Confetti.
   */
  constructor() {
    if (Confetti.instance) {
      throw new Error("Singleton classes can't be instantiated more than once.");
    }

    Confetti.instance = this;
    this.dpr = canvas.app.renderer.resolution ?? window.devicePixelRatio ?? 1;

    this._buildCanvas();
    this._initListeners();
    this.confettiSprites = {};

    game.audio.pending.push(this._preloadSounds.bind(this));

    cooldownStore.subscribe((value) => {
      this.isOnCooldown = value;
    });

    window[WINDOW_ID] = {
      confettiStrength: ConfettiStrength,
      getShootConfettiProps: Confetti.getShootConfettiProps,
      handleShootConfetti: this.handleShootConfetti.bind(this),
      shootConfetti: this.shootConfetti.bind(this),
    };
    Hooks.call(`${MODULE_ID}Ready`, this);
  }

  /**
   * Create and inject the confetti canvas.
   *
   * @private
   */
  _buildCanvas() {
    this.confettiCanvas = $(
      '<canvas id="confetti-canvas" style="position: absolute; left: 0; top: 0;pointer-events: none;">',
    );
    this.confettiCanvas.css('z-index', 2000);
    this.confettiCanvas.appendTo($('body'));

    log(false, {
      dpr: this.dpr,
      confettiCanvas: this.confettiCanvas,
      canvasDims: {
        width: this.confettiCanvas.width(),
        height: this.confettiCanvas.height(),
      },
    });

    this.resizeConfettiCanvas();

    this.ctx = this.confettiCanvas[0].getContext('2d');
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

    this._rtime;
    this._timeout = false;

    $(window).on('resize', () => {
      log(false, 'RESIIIIIIZING');
      this._rtime = new Date();
      if (this._timeout === false) {
        this._timeout = true;
        setTimeout(this._resizeEnd.bind(this), 1000);
      }
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
   * Resize to the window total size.
   */
  resizeConfettiCanvas() {
    const width = window.innerWidth * this.dpr;
    const height = window.innerHeight * this.dpr;
    // set all the heights and widths
    this.confettiCanvas.width(`${window.innerWidth}px`);
    this.confettiCanvas.height(`${window.innerHeight - 1}px`);
    this.confettiCanvas[0].width = width;
    this.confettiCanvas[0].height = height;
  }

  _resizeEnd() {
    if (new Date().getTime() - this._rtime.getTime() < 1000) {
      setTimeout(this._resizeEnd.bind(this), 1000);
    } else {
      log(false, 'resize probably ended');
      this._timeout = false;
      // resize ended probably, lets resize the canvas dimensions
      this.resizeConfettiCanvas();
    }
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

  /**
   * Adds a given number of confetti particles and kicks off the tweening magic
   *
   * @param {AddConfettiParticleProps} confettiParticleProps An object containing the particle properties
   */
  addConfettiParticles({ amount, angle, velocity, sourceX, sourceY, cColor, cStyle, cScale, cgDeviation }) {
    log(false, {});
    let i = 0;
    const allowSyncScale = game.settings.get(MODULE_ID, MySettings.AllowOtherConfettiScale);
    const allowSyncDeviation = game.settings.get(MODULE_ID, MySettings.AllowOtherConfettiDeviation);
    const confettiScale = allowSyncScale && cScale ? cScale : game.settings.get(MODULE_ID, MySettings.ConfettiScale);
    const style = cStyle || game.settings.get(MODULE_ID, MySettings.ConfettiStyleChoice);
    const confettiColor = Color.from(cColor || game.settings.get(MODULE_ID, MySettings.ConfettiColorBase));
    const gDeviation =
      allowSyncDeviation && cgDeviation
        ? cgDeviation
        : game.settings.get(MODULE_ID, MySettings.ConfettiGlitterDeviation);

    while (i < amount) {
      // sprite
      const r = random(4, 6) * this.dpr * confettiScale;
      const d = random(15, 25) * this.dpr * confettiScale;

      let blue, green, red;
      if (style === 'base' || style === 'baseGlitter') {
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
    this.ctx.clearRect(0, 0, this.confettiCanvas[0].width, this.confettiCanvas[0].height);
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

      const getColor = () => {
        if (sprite.style === 'glitter' || sprite.style === 'baseGlitter') {
          const { red, green, blue } = sprite.originalColor;
          const randomShade = this._randomizeShade(Color.fromRGB([red, green, blue]), sprite.gDeviation);
          return `rgb(${randomShade.r * 255}, ${randomShade.g * 255}, ${randomShade.b * 255})`;
        }

        return sprite.color;
      };

      this.ctx.strokeStyle = getColor();
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
   * @returns {object} The props
   */
  static getShootConfettiProps(strength) {
    const style = game.settings.get(MODULE_ID, MySettings.ConfettiStyleChoice);

    const shootConfettiProps = {
      strength,
      cStyle: style,
      cScale: game.settings.get(MODULE_ID, MySettings.ConfettiScale),
    };

    if (style === 'base' || style === 'baseGlitter') {
      shootConfettiProps.cColor = game.settings.get(MODULE_ID, MySettings.ConfettiColorBase);
    }

    if (style === 'glitter' || style === 'baseGlitter') {
      shootConfettiProps.cgDeviation = game.settings.get(MODULE_ID, MySettings.ConfettiGlitterDeviation);
    }

    switch (strength) {
      case ConfettiStrength.high:
        shootConfettiProps.amount = 200;
        shootConfettiProps.velocity = 3000;
        break;
      case ConfettiStrength.low:
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

    const confettiMultiplier = game.settings.get(MODULE_ID, MySettings.ConfettiMultiplier);
    const mute = game.settings.get(MODULE_ID, MySettings.Mute);

    canvas.app.ticker.add(this.render, this);

    if (!mute) {
      game.audio.play(SOUNDS[shootConfettiProps.strength], { volume: 0.8 });
    }

    // bottom left
    this.addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -70,
      sourceX: 0,
      sourceY: this.confettiCanvas[0].height,
      ...shootConfettiProps,
    });

    // bottom right
    this.addConfettiParticles({
      amount: amount * confettiMultiplier,
      angle: -110,
      sourceX: this.confettiCanvas[0].width - $('#sidebar').width() * this.dpr,
      sourceY: this.confettiCanvas[0].height,
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
    const rapidFireLimit = game.settings.get(MODULE_ID, MySettings.RapidFireLimit);
    const gmOnly = game.settings.get(MODULE_ID, MySettings.GmOnly);

    if (this.isOnCooldown) {
      log(false, 'shootConfetti prevented by rapid fire setting');
      return;
    } else if (gmOnly && !game.user.isGM) {
      log(false, 'shootConfetti prevented by gm only setting');
      ui.notifications.warn(game.i18n.localize(`${MODULE_ABBREV}.gm_warning`));
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
