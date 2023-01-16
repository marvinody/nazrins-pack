import Phaser from 'phaser';
import { Enemy, EnemyGroup, TrackingSprite } from '../enemies/IEnemy';
import Player from '../Player/Player';
import config from '../../config';


export class ItemCollectGroup extends EnemyGroup {
  /** @param {Phaser.Scene} scene */
  /** @param {Player} player */
  constructor(scene, player) {
    const bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    super(scene, bounds);

    this.createMultiple({
      frameQuantity: 5,
      key: 'nazrinpack',
      frame: 'misc/star.png',
      active: false,
      visible: false,
      classType: ItemCollect,
    });

    this.spawn(300,300)

  }

  /** @param {Number} x */
  /** @param {Number} y */
  /** @param {Player} player */
  spawn(x, y) {
    super.spawn(x, y)
  }

  update() {
    const collectionRing = this.scene.player.getCollectionCircle();
    this.children.each(gem => {
      gem.update(collectionRing);
    })
  }
}

export class ItemCollect extends TrackingSprite {

  speed = config.misc.exp.speed

  isFollowing = false

  /** @param {Number} x */
  /** @param {Number} y */
  spawn(x, y) {
    super.spawn(x, y);
    this.setTarget(this.scene.player)
    this.isFollowing = false;
  }

  die() {
    super.die();
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