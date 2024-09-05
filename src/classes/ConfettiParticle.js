import { get } from 'svelte/store';
import { GsapCompose, easingFunc, gsap } from '#runtime/svelte/gsap';
import { colord } from '#runtime/color/colord';
import { log, callback } from '../helpers';
import { particleStore } from '../stores';
import { CONFETTI_STYLES } from '../constants';

const random = gsap.utils.random;

const DECAY = 3;
const SPREAD = 50;
const GRAVITY = 1200;
const RGB_SCALAR = 1 / 255;

/**
 *
 * @param {Colord} color The colour to manipulate
 *
 * @param {number} maxDeviation The maximum amount of drift allowed for the shade
 *
 * @returns {Colord} Modified colour
 */
const randomizeShade = (color, maxDeviation = 50) => {
  const randomDeviation = Math.round(random(0, maxDeviation));
  const scaledRandomDeviation = RGB_SCALAR * randomDeviation;

  if (scaledRandomDeviation > 0) {
    if (Math.random() < 0.5) {
      return color.darken(scaledRandomDeviation);
    } else {
      return color.lighten(scaledRandomDeviation);
    }
  }

  return color;
};

/**
 *
 * @param {number} _ The index of the target (not used)
 *
 * @param {ConfettiParticle} particle The particle to get a color for
 *
 * @returns {string} An RGB string
 */
const gsapGetDrawColor = (_, particle) => {
  if (particle.style === CONFETTI_STYLES.glitter.key || particle.style === CONFETTI_STYLES.baseGlitter.key) {
    return randomizeShade(colord(particle.originalColor), particle.gDeviation).toRgbString();
  }

  return particle.originalColor;
};

const getStartingColor = (style, colourHex) => {
  if (style === CONFETTI_STYLES.base.key || style === CONFETTI_STYLES.baseGlitter.key) {
    return randomizeShade(colord(colourHex)).rgba;
  } else {
    return {
      r: random(50, 255),
      g: random(50, 200),
      b: random(50, 200)
    };
  }
};

export class ConfettiParticle extends PIXI.Sprite {
  /**
   * Create and initialize a new ConfettiParticle.
   *
   * @param {PIXI.Texture} texture The texture for the particle
   *
   * @param {string} style The style identifier
   *
   * @param {string} color The particle's hex string base colour
   *
   * @param {number} scale The particle's base scale
   *
   * @param {number} angle The particle's starting angle
   *
   * @param {number} sourceX The starting x position
   *
   * @param {number} sourceY The starting y position
   *
   * @param {number} velocity The starting velocity
   *
   * @param {number} gDeviation The amount of glitter deviation
   */
  constructor(texture, style, color, scale, angle, sourceX, sourceY, velocity, gDeviation) {
    super(texture);

    const colorHex = colord(getStartingColor(style, color)).toHex();
    const rScale = Math.max(random(scale / 2, (scale - 0.4) / 2), 0.1);

    this.id = foundry.utils.randomID(); // foundry core
    this.anchor.set(0.5);
    this.angle = random(0, 360);
    this.launchAngle = angle;
    this.x = sourceX;
    this.y = sourceY;
    this.scale.set(rScale, rScale);
    this.tint = `0x${colorHex.replace('#', '')}`;
    this.velocity = velocity;
    this.originalColor = colorHex;
    this.style = style;
    this.gDeviation = gDeviation;
  }

  /**
   * Spawns a particle to the canvas and animates it
   */
  spawnParticle() {
    canvas.overlay.addChild(this);

    const minAngle = this.launchAngle - SPREAD / 2;
    const maxAngle = this.launchAngle + SPREAD / 2;

    const minVelocity = this.velocity / 4;
    const maxVelocity = this.velocity;

    // Physics Props
    const velocity = random(minVelocity, maxVelocity);
    const angle = random(minAngle, maxAngle);
    const gravity = GRAVITY;
    const friction = random(0.01, 0.05);

    const colorTl = gsap.timeline({ repeat: -1, repeatRefresh: true });
    const skewTl = gsap.timeline({ repeat: -1, repeatRefresh: true });
    colorTl.to(this, {
      pixi: {
        tint: gsapGetDrawColor
      },
      duration: 0.05
    });

    skewTl.to(this, {
      pixi: { skewX: 'random(-90, 90)', skewY: 'random(-45, 45)' },
      duration: 0.5
    });

    GsapCompose.to(this, {
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
        // remove confetti sprite from list and canvas
        particleStore.remove(this);
        canvas.overlay.removeChild(this);

        // clean up timelines
        colorTl.killTweensOf(this);
        colorTl.kill();
        skewTl.killTweensOf(this);
        skewTl.kill();

        // kill the tween and destroy the sprite
        tween.kill();
        this.destroy();

        log(false, 'tween complete', {
          particleId: this.id,
          confettiSprites: get(particleStore)
        });

        if (!get(particleStore).length) {
          log(false, 'all tweens complete');
        }
      }),
      duration: DECAY
    });
  }
}
