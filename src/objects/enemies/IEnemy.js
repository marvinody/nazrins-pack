import Phaser from 'phaser';
import Player from '../Player/Player';

export class EnemyGroup extends Phaser.Physics.Arcade.Group {
  /** @type {Phaser.Geom.Rectangle} */
  globalBounds

  /** @param {Phaser.Scene} scene */
  /** @param {Phaser.Geom.Rectangle} bounds */
  constructor(scene, bounds) {
    super(scene.physics.world, scene);
    if (bounds) {
      this.globalBounds = bounds;
    }
  }

  /** @param {Number} x */
  /** @param {Number} y */
  spawn(x, y) {
    let enemy = this.getFirstDead(false);

    if (enemy) {
      enemy
        .setBounds(this.globalBounds)
        .spawn(x, y)

      return enemy;
    }
  }

  preUpdate() {
    console.log('group preupdate')
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

  // despawn will just remove the mob, no drops
  despawn() {
    if(!this.active) {
      return;
    }
    this.setActive(false);
    this.setVisible(false);
    this.disableBody();
  }

  // die should normally be used and overwritten if the monster does something on death
  die() {
    this.despawn();
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.bounds.contains(this.x, this.y)) {
      this.despawn();
    }

  }
}

export class TrackingSprite extends Enemy {
  /** @type {Phaser.Math.Vector2} */
  target

  /** @type {Number} */
  speed

  /** @param {Phaser.Math.Vector2} target */
  setTarget(target) {
    this.target = target;
  }

  update() {
    if (!this.active) {
      return
    }

    this.scene.physics.moveToObject(this, this.target, this.speed)

    return this;
  }

}