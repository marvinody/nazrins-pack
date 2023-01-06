import Phaser from 'phaser';
import { Enemy, EnemyGroup, TrackingEnemy } from './IEnemy';
import Player from '../Player/Player';
import config from '../../config';

export class SlimeEnemyGroup extends EnemyGroup {
  /** @param {Phaser.Scene} scene */
  /** @param {Player} player */
  constructor(scene, player) {
    const bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    super(scene, bounds);

    this.createMultiple({
      frameQuantity: 10,
      frame: 48,
      key: 'characters',
      active: false,
      visible: false,
      classType: SlimeEnemy,
    });

    scene.anims.create({
      key: 'slime.walk.down',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [48, 49, 50] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'slime.walk.left',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [60, 61, 21] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'slime.walk.right',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [72, 73, 74] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: 'slime.walk.up',
      frames: scene.anims.generateFrameNumbers('characters', { frames: [84, 85, 86] }),
      frameRate: 8,
      repeat: -1,
    })

    scene.time.addEvent({
      delay: 3000,
      callback: () => {
        // this.spawn(Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 500), player)
      },
      loop: true,
    })
  }

  /** @param {Number} x */
  /** @param {Number} y */
  /** @param {Player} player */
  spawn(x, y, player) {
    super
      .spawn(x, y)
      ?.setTarget(player)
  }

  update() {
    this.children.each(slime => {
      slime.track();
    })
  }
}

export class SlimeEnemy extends TrackingEnemy {

  speed = config.enemies.slime.speed

  /** @param {Number} x */
  /** @param {Number} y */
  /** @param {Player} player */
  /** @return {SlimeEnemy} */
  spawn(x, y, player) {
    super.spawn(x, y).setTarget(player);
    this.anims.play('slime.walk.right')
  }
}