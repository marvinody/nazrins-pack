import Phaser from 'phaser';
import { Enemy, EnemyGroup, TrackingSprite } from '../enemies/IEnemy';
import Player from '../Player/Player';
import config from '../../config';


export class SuperExpGroup extends EnemyGroup {
  /** @param {Phaser.Scene} scene */
  /** @param {Player} player */
  constructor(scene, player) {
    const bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    super(scene, bounds);

    this.createMultiple({
      frameQuantity: config.misc.exp.maxSuper,
      key: 'fullpower',
      active: false,
      visible: false,
      classType: SuperExpGem,
    });

  }

  /** @param {Number} x */
  /** @param {Number} y */
  /** @param {Player} player */
  spawn(x, y) {
    if (this.canSpawn()) {
      console.log('super spawn 2')
      super.spawn(x, y)
    } else {
      // can't spawn more, just increase value of one
      const gem = this.getFirstAlive();
      gem.increaseValue();
    }
  }

  canSpawn() {
    return this.getTotalUsed() < config.misc.exp.maxSuper
  }

  update() {
    const collectionRing = this.scene.player.getCollectionCircle();
    this.children.each(gem => {
      gem.update(collectionRing);
    })
  }
}

export class SuperExpGem extends TrackingSprite {

  speed = config.misc.exp.speed
  radius = config.misc.exp.radius
  value = config.misc.exp.value

  isFollowing = false

  /** @param {Number} x */
  /** @param {Number} y */
  spawn(x, y) {
    super.spawn(x, y);
    this.setTarget(this.scene.player)
    this.setScale(0.5)
    this.isFollowing = false;
  }

  die() {
    super.die();
  }

  increaseValue() {
    this.value += config.misc.exp.value;
  }

  startFollow() {
    this.isFollowing = true;
  }

  /** @param {Phaser.Geom.Circle} collectionCircle */
  update(collectionCircle) {
    if (!this.active) {
      return
    }

    if (this.isFollowing) {
      return super.update();
    }

    if (collectionCircle.contains(this.x, this.y)) {
      this.startFollow();
      return;
    }
  }
}