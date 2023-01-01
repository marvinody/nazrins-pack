import Phaser from 'phaser';

export class SlimeEnemyGroup extends Phaser.Physics.Arcade.Group {
  /** @param {Phaser.Scene} scene */
  constructor(scene) {
      super(scene.physics.world, scene);

      this.createMultiple({
          frameQuantity: 10,
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
          this.spawn(Phaser.Math.Between(100, 500), Phaser.Math.Between(100, 500))
        },
        loop: true,
      })
  }

  spawn(x, y) {
      let slime = this.getFirstDead(false);

      if (slime) {
          slime.spawn(x, y);
      }
  }
}

export class SlimeEnemy extends Phaser.Physics.Arcade.Sprite {
    /** @param {Phaser.Scene} scene */
  constructor(scene, x, y) {
      super(scene, x, y, 'characters', 48);
      this.bounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(scene.physics.world.bounds), 100, 100);
  }

  spawn(x, y) {
      console.log('SPAWNED')
      console.log(this.texture)
      this.body.reset(x, y);

      this.setActive(true);
      this.setVisible(true);
      this.enableBody();

      this.setVelocityX(10);
      this.anims.play('slime.walk.right')
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

  update(time, delta) {
      console.log(this, time, delta)
  }
}