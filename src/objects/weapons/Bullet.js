import config from '../../config';
import Player from '../Player/Player';
import { splitUnitCircle } from './util'

const LEVEL_UP_OPTIONS = {
  stats: {
    amount: {
      key: 'amount',
      text: 'Increases the amount of bullets fired',
      prereq: {
        amount: {
          lte: 7,
        }
      },
      onLevelUp: {
        inc: {
          amount: 1,
        }
      }
    },
    delay: {
      key: 'delay',
      text: 'Increases how often bullets fire',
      prereq: {
        delay: {
          gt: 500,
        }
      },
      onLevelUp: {
        dec: {
          delay: 250
        }
      },
    }
  },
  unique: {
    rotation: {
      key: 'BULLET_ROTATION',
      prereq: {
        amount: {
          gt: 5,
        },
        delay: {
          lt: 1000,
        },
      }
    }
  }
}

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  /** @type {Phaser.Geom.Rectangle} */
  bounds

  /** @param {Phaser.Scene} scene */
  constructor(scene, x, y) {
    super(scene, x, y, 'nazrinpack', 'misc/bullet.png');
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

export class Bullets extends Phaser.Physics.Arcade.Group {

  amount = config.weapons.bullet.startingAmount
  delay = config.weapons.bullet.startingDelay

  level = 1;
  maxLevel = 9;
  /** @param {Phaser.Scene} scene */
  /** @param {Player} player */
  constructor(scene, player) {
    super(scene.physics.world, scene);

    this.createMultiple({
      frameQuantity: 100,
      frame: 'misc/bullet.png',
      key: 'nazrinpack',
      active: false,
      visible: false,
      classType: Bullet,
    });


    const bulletSpeed = config.weapons.bullet.speed;

    this.bulletFireEvent = scene.time.addEvent({
      delay: this.delay,
      callback: () => {
        const vectors = splitUnitCircle(this.amount).map(angle => ([
          Math.cos(angle), -Math.sin(angle)
        ]));

        
        vectors.forEach((vector) => {
          this.fireBullet(player.x, player.y, vector[0] * bulletSpeed, vector[1] * bulletSpeed);
        })
      },
      loop: true,
    })
    
  }

  getAvailableLevelups() {

    const buildPreqreqConditionals = prereq => {
      const allChecks = Object.entries(prereq).flatMap(([key, checks]) => {
        const checkers = Object.entries(checks).map(([op, val]) => {
          return obj => {
            switch (op) {
              case 'lte':
                return obj[key] <= val
              case 'lt':
                return obj[key] < val
              case 'gte':
                return obj[key] >= val
              case 'gt':
                return obj[key] > val
              default:
                throw new Error(`NO CHECKER for: ${key}: ${op}:${val}`);
            }
          }
        });

        return checkers;
      });
      return current => {
        return allChecks.every(pred => pred(current));
      }
    }

    const statUpgrades = Object.values(LEVEL_UP_OPTIONS.stats).map(upgrade => {
      const canUpgrade = buildPreqreqConditionals(upgrade.prereq)(this);

      return {
        weapon: 'GUN',
        type: 'stats',
        canUpgrade,
        key: upgrade.key,
        text: `GUN [img=gun]\n${upgrade.text}`
      }
    }).filter(u => u.canUpgrade);

    return statUpgrades;
  }

  levelUp({
    type,
    key,
  }) {

    const changes = LEVEL_UP_OPTIONS[type][key].onLevelUp;
    if(changes?.inc?.amount) {
      this.amount += changes.inc.amount;
    }
    if(changes?.dec?.delay) {
      this.delay -= changes.dec.delay;
    }

    if(this.level === this.maxLevel) {
      return;
    }

    this.level += 1;
    this.bulletFireEvent.delay = this.delay;
  }

  fireBullet(x, y, velX, velY) {
    let bullet = this.getFirstDead(false);

    if (bullet) {
      bullet.fire(x, y, velX, velY);
    }
  }
}
