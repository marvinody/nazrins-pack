import Phaser from 'phaser';
import Player from '../Player/Player';

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  /** @type {Phaser.Geom.Rectangle} */
  bounds

  /** @param {Phaser.Scene} scene */
  /** @param {Phaser.Geom.Rectangle} bounds */
  constructor(scene, bounds) {
    super(scene.physics.world, scene);
    if (bounds) {
      this.bounds = bounds;
    }
  }

  /** @param {Number} x */
  /** @param {Number} y */
  spawn(x, y) {
    let enemy = this.getFirstDead(false);

    if (enemy) {
      enemy
        .setBounds(this.bounds)
        .spawn(x, y)

        return enemy;
    }
  }

}

export class Enemy extends Phaser.Physics.Arcade.Sprite {

  /** @type {Phaser.Geom.Rectangle} */
  bounds

  /** @param {Phaser.Scene} scene */
  /** @param {Number} x */
  /** @param {Number} y */
  /** @param {String} texture */
  /** @param {Number} frame */
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);
  }


  /** @param {Phaser.Geom.Rectangle} bounds */
  setBounds(bounds) {
    this.bounds = bounds;

    return this;
  }

  /** @param {Number} x */
  /** @param {Number} y */
  spawn(x, y) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);
    this.enableBody();

    return this;
  }

  die() {
    this.setActive(false);
    this.setVisible(false);
    this.disableBody();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.bounds.contains(this.x, this.y)) {
      this.die();
    }

  }
}

export class TrackingEnemy extends Enemy {
  /** @type {Phaser.Math.Vector2} */
  target

  /** @type {Number} */
  speed

  /** @param {Phaser.Math.Vector2} target */
  setTarget(target) {
    console.log("SETTING TARGET")
    this.target = target;
    console.log({this: this.target, target})
  }

  track() {
    if (!this.active) {
      return
    }

    const angle = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y);

    // Set the velocity of the enemy based on the calculated angle and the speed
    this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);

    return this;
  }

}