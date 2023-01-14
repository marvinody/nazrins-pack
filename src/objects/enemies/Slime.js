import Phaser from 'phaser';
import { Enemy, EnemyGroup, TrackingSprite } from './IEnemy';
import Player from '../Player/Player';
import config from '../../config';

export class SlimeEnemyGroup extends EnemyGroup {
  /** 
   * @param {Player} player 
   * @param {Phaser.Scene} scene 
   * */
  constructor(scene, player) {
    const bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
    super(scene, bounds);

    this.createMultiple({
      frameQuantity: 30,
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
      delay: 10,
      callback: () => {
        const outerSpawn = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.cameras.main.worldView), 50, 50);
        const innerSpawn = scene.cameras.main.worldView;
        const spawnLocation = Phaser.Geom.Rectangle.RandomOutside(outerSpawn, innerSpawn, spawnLocation)
        this.spawn(spawnLocation.x, spawnLocation.y, player)
      },
      loop: true,
    })
  }

  getLesserSpawnCap() {
    const level = this.scene.player.level;
    return Math.min(level * 3, 30);
  }

  /** @param {Number} x */
  /** @param {Number} y */
  spawn(x, y) {
    const aliveCount = this.countActive(true);
    const maxAllowedRightNow = this.getLesserSpawnCap();
    if(aliveCount < maxAllowedRightNow) {
      super.spawn(x, y)
    }
  }

  update() {
    const despawnBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.scene.cameras.main.worldView), 100, 100);
    this.children.each(slime => {
      if(!slime.active) {
        return;
      }

      if(!despawnBounds.contains(slime.x, slime.y)) {
        return slime.despawn();
      }
      slime.update();
    })
  }
}

export class SlimeEnemy extends TrackingSprite {

  speed = config.enemies.slime.speed

  /** @param {Number} x */
  /** @param {Number} y */
  /** @return {SlimeEnemy} */
  spawn(x, y) {
    super.spawn(x, y);
    this.anims.play('slime.walk.right')
    this.setTarget(this.scene.player)
  }

  die() {
    if (!this.active) {
      return;
    }
    super.die();
    const center = this.getCenter();
    this.scene.expGems.spawn(center.x, center.y)
  }
}