import Phaser from 'phaser';
import { Enemy, EnemyGroup, TrackingSprite } from '../enemies/IEnemy';
import Player from '../Player/Player';
import config from '../../config';


export class CheeseGroup extends EnemyGroup {
  /** @param {Phaser.Scene} scene */
  /** @param {Player} player */
  constructor(scene, player) {
    const bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    super(scene, bounds);

    this.createMultiple({
      frameQuantity: 5,
      key: 'nazrinpack',
      frame: 'misc/cheese.png',
      active: false,
      visible: false,
      classType: Cheese,
    });

    this.spawn(400,300)

  }

  /** @param {Number} x */
  /** @param {Number} y */
  /** @param {Player} player */
  spawn(x, y) {
    super.spawn(x, y)
  }
}

export class Cheese extends TrackingSprite {
  touchedByPlayer(player) {
    player.heal(config.misc.cheese.heal)
    this.die();
  }
}