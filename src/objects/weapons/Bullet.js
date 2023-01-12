import config from '../../config';
import Player from '../Player/Player';
import { splitUnitCircle } from './util'


export class Bullet extends Phaser.Physics.Arcade.Sprite {
  /** @type {Phaser.Geom.Rectangle} */
  bounds

  /** @param {Phaser.Scene} scene */
  constructor(scene, x, y) {
    super(scene, x, y, 'bullet');
    this.bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
  }


  fire(x, y, velX, velY) {
    this.body.reset(x, y);

    this.setActive(true);
    this.setVisible(true);

    this.setVelocity(velX, velY);
  }

  preUpdate(time, delta) {
    super.preUpdate(time, delta);

    if (!this.bounds.contains(this.x, this.y)) {
      this.setActive(false);
      this.setVisible(false);
    }

  }
}

const levelToCooldown = (level) => {
  return Math.round(4375 / 2 - (375*level)/2);
}

export class Bullets extends Phaser.Physics.Arcade.Group {

  level = 1;
  maxLevel = 9;
  /** @param {Phaser.Scene} scene */
  /** @param {Player} player */
  constructor(scene, player) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100,
      key: 'bullet',
      active: false,
      visible: false,
      classType: Bullet,
    });

    const vectors = splitUnitCircle(config.weapons.bullet.amount).map(angle => ([
      Math.cos(angle), -Math.sin(angle)
    ]));

    const bulletSpeed = config.weapons.bullet.speed;

    this.bulletFireEvent = scene.time.addEvent({
      delay: levelToCooldown(this.level),
      callback: () => {
        vectors.forEach((vector) => {
          this.fireBullet(player.x, player.y, vector[0] * bulletSpeed, vector[1] * bulletSpeed);
        })
      },
      loop: true,
    })


  }

  levelUp() {
    if(this.level === this.maxLevel) {
      return;
    }

    this.level += 1;
    this.bulletFireEvent.delay = levelToCooldown(this.level)
  }

  fireBullet(x, y, velX, velY) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y, velX, velY);
    }
  }
}
